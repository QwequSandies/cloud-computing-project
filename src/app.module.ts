import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from '../ormconfig';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig as TypeOrmModule),
    TypeOrmModule.forFeature([User]),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
