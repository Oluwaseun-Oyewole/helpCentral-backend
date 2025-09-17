import { Injectable } from '@nestjs/common';
import { hashPassword } from 'src/shared/utils/index.utils';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleResponse } from './dto/people-response.dto';
import { PeopleRepository } from './people.repository';

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
}
