import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_Name: string;

  @Column()
  last_Name: string;

  @Column()
  dob: Date;

  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;
}
