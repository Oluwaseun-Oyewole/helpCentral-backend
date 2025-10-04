import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  SchemaTypes,
} from 'mongoose';
import { USER_MODELS } from 'src/shared/enums/index.enum';

export type UserTokenDocument = HydratedDocument<UserToken>;

export enum TOKEN_TYPES {
  FORGOT_PASSWORD = 'forgotPassword',
  RESET_PASSWORD = 'resetpassword',
  EMAIL_VERIFICATION = 'emailVerification',
}

@Schema({ timestamps: true, collection: 'userTokens' })
export class UserToken {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, refPath: 'userModel' })
  user: MongooseSchema.Types.ObjectId | string;

  @Exclude()
  @Prop({
    type: String,
    required: true,
    enum: USER_MODELS,
    default: USER_MODELS.CHILDREN,
  })
  userModel: USER_MODELS;

  @Prop({
    type: String,
    required: true,
    enum: TOKEN_TYPES,
  })
  type: TOKEN_TYPES;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Date, required: true })
  expires: Date;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
