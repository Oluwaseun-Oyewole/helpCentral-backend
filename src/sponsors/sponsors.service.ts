import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { hashPassword } from 'src/shared/utils/index.utils';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { SponsorResponse } from './dto/sponsor-response.dto';
import { Sponsor } from './schema/sponsor.schema';
import { SponsorsRepository } from './sponsor.repository';

@Injectable()
export class SponsorsService {
  constructor(readonly sponsorRepository: SponsorsRepository) {}
  async createUser(input: CreateSponsorDto) {
    try {
      const { email, password } = input;
      const userExists = await this.sponsorRepository.findOne({ email });
      if (userExists)
        return Promise.reject(`User with ${userExists.email} already exists.`);
      const hashedPassword = await hashPassword(password);
      const savedUser = await this.sponsorRepository.create({
        ...input,
        password: hashedPassword,
      });
      return new SponsorResponse(savedUser);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkIfUserExist(input: Partial<Record<'id' | 'email', string>>) {
    const { id, email } = input;
    const query: FilterQuery<Sponsor>[] = [];
    if (id) query.push({ _id: id });
    if (email) query.push({ email });
    if (query.length <= 0) return null;
    const formatQuery = {
      ...(query.length > 0 && { $or: query }),
    };
    const userExists = await this.sponsorRepository.findOne({ ...formatQuery });
    return userExists && new SponsorResponse(userExists);
  }
}
