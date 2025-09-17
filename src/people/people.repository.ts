import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AbstractRepository } from 'src/shared/common/abstract.repository';
import { People } from './schema/people.schema';

@Injectable()
export class PeopleRepository extends AbstractRepository<People> {
  constructor(@InjectModel(People.name) private peopleModel: Model<People>) {
    super(peopleModel);
  }
  async getUserWithPassword(schemaFilterQuery: FilterQuery<People>) {
    return this.peopleModel
      .findOne(schemaFilterQuery, {}, {})
      .select('+password')
      .lean<People>();
  }
}
