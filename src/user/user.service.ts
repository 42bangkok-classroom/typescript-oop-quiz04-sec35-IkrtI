import { Injectable } from '@nestjs/common';
import { IUser } from './user.entity';
import { readFile } from 'fs/promises';

@Injectable()
export class UserService {
  getTest(): [] {
    return [];
  }

  async findAll(): Promise<IUser[]> {
    return JSON.parse(await readFile('./data/users.json', 'utf-8')) as IUser[];
  }
}
