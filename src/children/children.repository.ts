import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AbstractRepository } from 'src/shared/common/abstract.repository';
import { Children } from './schema/children.schema';

@Injectable()
export class ChildrenRepository extends AbstractRepository<Children> {
  constructor(
    @InjectModel(Children.name) private ChildrenModel: Model<Children>,
  ) {
    super(ChildrenModel);
  }
  async getUserWithPassword(schemaFilterQuery: FilterQuery<Children>) {
    return this.ChildrenModel.findOne(schemaFilterQuery, {}, {})
      .select('+password')
      .lean<Children>();
  }
}
