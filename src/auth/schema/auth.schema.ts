import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export const UserSchemaName = 'users';
@Schema({
  timestamps: true,
  autoIndex: true,
  collection: UserSchemaName,
})
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: Boolean, required: false, default: true })
  isActive: boolean;

  // @Prop({ type: Boolean, required: true })
  // termsAndConditions: boolean;

  @Prop({ required: false })
  image?: string;

  @Prop({ type: Date, required: false })
  lastLoginDate: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
