import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { hashPassword } from 'src/shared/utils/index.utils';
import { ChildrenRepository } from './children.repository';
import { ChildrenResponse } from './dto/Children-response.dto';
import { CreateChildrenDto } from './dto/create-children.dto';
import { Children } from './schema/Children.schema';

@Injectable()
export class ChildrenService {
  constructor(readonly ChildrenRepository: ChildrenRepository) {}
  async createUser(input: CreateChildrenDto) {
    try {
      const { email, password } = input;
      const userExists = await this.ChildrenRepository.findOne({ email });
      if (userExists)
        return Promise.reject(`User with ${userExists.email} already exists.`);
      const hashedPassword = await hashPassword(password);
      const savedUser = await this.ChildrenRepository.create({
        ...input,
        password: hashedPassword,
      });
      return new ChildrenResponse(savedUser);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkIfUserExist(input: Partial<Record<'id' | 'email', string>>) {
    const { id, email } = input;
    const query: FilterQuery<Children>[] = [];
    if (id) query.push({ _id: id });
    if (email) query.push({ email });
    if (query.length <= 0) return null;
    const formatQuery = {
      ...(query.length > 0 && { $or: query }),
    };
    const userExists = await this.ChildrenRepository.findOne({
      ...formatQuery,
    });
    return userExists && new ChildrenResponse(userExists);
  }
}
