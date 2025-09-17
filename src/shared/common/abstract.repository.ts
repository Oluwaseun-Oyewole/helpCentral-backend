import {
  CreateOptions,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Require_id,
  Schema,
  SortOrder,
} from 'mongoose';

type TSort<T> =
  | { [key in keyof T]?: SortOrder | Record<'$meta', any> }
  | [keyof T, SortOrder][];

export abstract class AbstractRepository<TSchema extends Record<string, any>> {
  constructor(readonly schemaModel: Model<TSchema>) {}

  async findOne(
    schemaFilterQuery: FilterQuery<TSchema>,
    options?: QueryOptions<TSchema> & { sort?: TSort<TSchema> },
    projection?: ProjectionType<TSchema>,
  ) {
    return this.schemaModel
      .findOne(schemaFilterQuery, projection, {
        projection: { __v: 0 },
        ...options,
      })
      .lean<TSchema>();
  }

  async find(
    schemaFilterQuery: FilterQuery<TSchema>,
    options?: QueryOptions<TSchema> & { sort?: TSort<TSchema> },
    projection?: ProjectionType<TSchema>,
  ) {
    return this.schemaModel
      .find(schemaFilterQuery, projection, {
        projection: { __v: 0 },
        ...options,
      })
      .lean<TSchema[]>();
  }

  async create(
    createSchemaData: Partial<Omit<Require_id<TSchema>, '_id'>>,
    options?: CreateOptions,
  ): Promise<TSchema> {
    return this.schemaModel
      .create([createSchemaData], options)
      .then((res) => res[0]);
  }
  async delete(id: Schema.Types.ObjectId | string): Promise<TSchema> {
    return this.schemaModel.findByIdAndDelete(id).lean<TSchema>();
  }

  async deleteMany(entityFilterQuery: FilterQuery<TSchema>): Promise<boolean> {
    const deleteResult = await this.schemaModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
