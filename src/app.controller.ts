import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from '../src/user/user.dto';
import { resData, resErrors } from './utils/response';
import { User } from './user/user.entity';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  getHello(): string {
    return this.service.getHello();
  }

  @Post('/login')
  async login(@Body() req: UserDto) {
    const user = await this.service.login(req.username, req.password);
    if (user == null) {
      throw new UnauthorizedException(
        resErrors([{ property: 'user', message: 'User not found' }]),
      );
    } else {
      return resData(user);
    }
  }

  @Post('/register')
  async register(@Body() req: UserDto) {
    const form = new User();
    form.username = req.username;
    form.first_Name = req.first_Name;
    form.last_Name = req.last_Name;
    form.dob = new Date(req.dob);
    form.password = req.password;
    const user = await this.service.register(form);
    if (user == null) {
      throw new BadRequestException(
        resErrors([
          { property: 'user', message: 'The new account was not created.' },
        ]),
      );
    } else {
      return resData(user);
    }
  }
}
