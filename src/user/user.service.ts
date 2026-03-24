import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from './user.interface';
import { readFileSync, writeFileSync } from 'fs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  test(): [] {
    return [];
  }

  findAll(): IUser[] {
    return JSON.parse(readFileSync('./data/users.json', 'utf-8')) as IUser[];
  }

  findOne(id: string, fields?: string[]): IUser | Record<string, unknown> {
    const users = this.findAll();
    const user = users.find((U: IUser) => U.id == id);
    if (!user) {
      throw new NotFoundException('User not found');
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

  create(dto: CreateUserDto): IUser {
    const users = this.findAll();
    const newId = (
      users.reduce((maxId, user) => Math.max(maxId, Number(user.id)), 0) + 1
    ).toString();

    const newUser: IUser = {
      id: newId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
    };

    users.push(newUser);
    writeFileSync('./data/users.json', JSON.stringify(users, null, 2), 'utf-8');
    return newUser;
  }
}
