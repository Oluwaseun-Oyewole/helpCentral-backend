import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AbstractRepository } from 'src/shared/common/abstract.repository';
import { Sponsor } from './schema/sponsor.schema';

@Injectable()
export class SponsorsRepository extends AbstractRepository<Sponsor> {
  constructor(@InjectModel(Sponsor.name) private sponsorModel: Model<Sponsor>) {
    super(sponsorModel);
  }
  async getUserWithPassword(schemaFilterQuery: FilterQuery<Sponsor>) {
    return this.sponsorModel
      .findOne(schemaFilterQuery, {}, {})
      .select('+password')
      .lean<Sponsor>();
  }
}
