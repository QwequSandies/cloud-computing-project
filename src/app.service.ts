import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate, isEmpty } from 'class-validator';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';
import { errorMessage, resErrors } from './utils/response';
import bcrypt = require('bcrypt');

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    readonly repository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  private _hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async login(username: string, password: string): Promise<User> {
    if (isEmpty(username)) {
      throw new UnauthorizedException(
        resErrors([errorMessage('username', 'Username is invalid')]),
      );
    }
    const user = await this.repository.findOne({ username: username });
    if (user == null) {
      throw new NotFoundException(
        resErrors([errorMessage('user', 'This user does not exist')]),
      );
    }
    const check =
      user?.username == username && bcrypt.compareSync(password, user.password);
    if (!check) {
      if (user == null) {
        throw new UnauthorizedException(
          resErrors([errorMessage('user', 'User credentials are incorrect')]),
        );
      }
    }
    return user;
  }

  async register(user: User): Promise<User> {
    const errors = [];
    if (isEmpty(user.username)) {
      errors.push(errorMessage('username', 'Username is invalid'));
    }
    if (isEmpty(user.first_Name)) {
      errors.push(errorMessage('first_Name', 'First name is required'));
    }
    if (isEmpty(user.last_Name)) {
      errors.push(errorMessage('last_Name', 'Last name is required'));
    }
    try {
      console.log(user.dob);
      if (!isDate(user.dob)) {
        errors.push(errorMessage('dob', 'Date of birth is invalid'));
      }
    } catch (error) {
      console.error(error);
    }
    if (errors.length > 0) {
      throw new UnauthorizedException(resErrors(errors));
    }
    const checkUsername = await this.repository.find({
      where: { username: user.username },
    });
    if (checkUsername.length > 0) {
      errors.push({
        property: 'username',
        message: 'Username already exists.',
      });
    }
    if (errors.length > 0) {
      throw new UnauthorizedException(resErrors(errors));
    }
    const hash = this._hashPassword(user.password);
    user.password = hash;
    const record = await this.repository.save(user);
    return await this.repository.save(record);
  }
}
