import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { hashPassword } from 'src/shared/utils/index.utils';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleResponse } from './dto/people-response.dto';
import { PeopleRepository } from './people.repository';
import { People } from './schema/people.schema';

@Injectable()
export class PeopleService {
  constructor(readonly peopleRepository: PeopleRepository) {}
  async createUser(input: CreatePersonDto) {
    try {
      const { email, password } = input;
      const userExists = await this.peopleRepository.findOne({ email });
      if (userExists)
        return Promise.reject(`User with ${userExists.email} already exists.`);
      const hashedPassword = await hashPassword(password);
      const savedUser = await this.peopleRepository.create({
        ...input,
        password: hashedPassword,
      });
      return new PeopleResponse(savedUser);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkIfUserExist(input: Partial<Record<'id' | 'email', string>>) {
    const { id, email } = input;
    const query: FilterQuery<People>[] = [];
    if (id) query.push({ _id: id });
    if (email) query.push({ email });
    if (query.length <= 0) return null;
    const formatQuery = {
      ...(query.length > 0 && { $or: query }),
    };
    const userExists = await this.peopleRepository.findOne({ ...formatQuery });
    return userExists && new PeopleResponse(userExists);
  }
}
