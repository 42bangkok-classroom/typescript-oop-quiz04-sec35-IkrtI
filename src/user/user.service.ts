import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import { readFile, writeFile } from 'fs/promises';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  getTest(): [] {
    return [];
  }

  async findAll(): Promise<IUser[]> {
    return JSON.parse(await readFile('./data/users.json', 'utf-8')) as IUser[];
  }

  async findOne(id: string, fields?: string[]): Promise<unknown> {
    const users = await this.findAll();
    const user = users.find((U: IUser) => U.id == id);
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
    }
    if (fields) {
      const filteredUser: Record<string, unknown> = {};
      fields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(user, field)) {
          filteredUser[field] = user[field];
        }
      });
      return filteredUser;
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<IUser> {
    const users = await this.findAll();
    const NewId = users.sort((a, b) => Number(a.id) - Number(b.id))[0].id + 1;
    const newUser: IUser = {
      id: NewId.toString(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
    };
    users.push(newUser);
    await writeFile('./data/users.json', JSON.stringify(users));
    return newUser;
  }
}
