import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PeopleDocument = HydratedDocument<People>;
export const allowedLanguages = ['en'] as const;

export const allowedGenders = ['male', 'female'] as const;
export type Gender = (typeof allowedGenders)[number];

export const PeopleSchemaName = 'People';
@Schema({ timestamps: true, autoIndex: true, collection: PeopleSchemaName })
export class People {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ unique: true, required: true })
  fullname: string;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: false })
  country: string;

  // @Prop({ required: false })
  // state: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ type: Boolean, required: false, default: false })
  isActive: boolean;

  @Prop({
    type: String,
    required: false,
    enum: allowedLanguages,
    default: 'en',
  })
  language: (typeof allowedLanguages)[number];

  @Prop({
    type: String,
    required: false,
    enum: allowedGenders,
  })
  gender: Gender;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false, type: Date })
  lastLoginDate: Date;
}
export const PeopleSchema = SchemaFactory.createForClass(People);
