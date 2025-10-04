import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  SchemaTypes,
} from 'mongoose';
import { AccessJWTPayload } from 'src/auth/auth.interface';
import { USER_MODELS } from 'src/shared/enums/index.enum';

export type UserSessionDocument = HydratedDocument<UserSession>;

@Schema({ timestamps: true, autoIndex: true, collection: 'userSessions' })
export class UserSession {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
    refPath: 'userModel',
  })
  user: MongooseSchema.Types.ObjectId | string;

  @Exclude()
  @Prop({
    type: String,
    required: true,
    enum: USER_MODELS,
  })
  userModel: USER_MODELS;

  @Prop({ required: true })
  hash: string;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  payload: AccessJWTPayload;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);

UserSessionSchema.index({ user: 1, hash: 1 }, { unique: true });
UserSessionSchema.index(
  { user: 1, hash: -1, createdAt: -1 },
  { unique: false },
);
