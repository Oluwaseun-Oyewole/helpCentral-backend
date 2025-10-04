import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChildrenDocument = HydratedDocument<Children>;

export const allowedGenders = ['male', 'female'] as const;

export const schoolNeeds = [
  'school_uniform',
  'school_bags',
  'school shoes',
  'school_fees',
];

export type SchoolNeeds = [typeof schoolNeeds][number];
export type Gender = (typeof allowedGenders)[number];

export const ChildrenSchemaName = 'children';
@Schema({ timestamps: true, autoIndex: true, collection: ChildrenSchemaName })
export class Children {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ type: Date, required: false, default: null })
  activatedAt: Date;

  @Prop({
    type: String,
    required: false,
    enum: allowedGenders,
  })
  gender: Gender;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true })
  schoolNeeds: SchoolNeeds;

  @Prop({ required: false, type: Date })
  lastLoginDate: Date;
}
export const ChildrenSchema = SchemaFactory.createForClass(Children);
