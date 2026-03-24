import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('fields') fields: string = '',
  ): Promise<unknown> {
    const users = await this.userService.findAll();
    const user = users.find((U: IUser) => U.id == id);
    if (!user) {
      return new NotFoundException({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }
    if (fields) {
      const fieldList = fields.split(',').map((f) => f.trim());
      const filteredUser: Record<string, unknown> = {};
      fieldList.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(user, field)) {
          filteredUser[field] = user[field];
        }
      });
      return filteredUser;
    }
    return user;
  }

  @Get('test')
  getTest(): [] {
    return this.userService.getTest();
  }
}
