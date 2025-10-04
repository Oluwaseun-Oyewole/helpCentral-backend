import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SponsorDocument = HydratedDocument<Sponsor>;

export const SponsorSchemaName = 'sponsors';
@Schema({ timestamps: true, autoIndex: true, collection: SponsorSchemaName })
export class Sponsor {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ type: Date, required: false, default: null })
  activatedAt: Date;

  @Prop({ required: false, type: Date })
  lastLoginDate: Date;
}
export const SponsorSchema = SchemaFactory.createForClass(Sponsor);
