import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('fields') fields: string = '') {
    return this.userService.findOne(
      id,
      fields.split(',').map((f) => f.trim()),
    );
  }

  @Get('test')
  getTest(): [] {
    return this.userService.getTest();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
