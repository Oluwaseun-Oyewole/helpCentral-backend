/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/shared/common/abstract.repository';
import { UserToken, UserTokenDocument } from './schema/user-token.schema';

@Injectable()
export class UserTokenRepository extends AbstractRepository<UserToken> {
  constructor(
    @InjectModel(UserToken.name)
    private userTokenModel: Model<UserTokenDocument>,
  ) {
    //@ts-ignore
    super(userTokenModel);
  }
}
