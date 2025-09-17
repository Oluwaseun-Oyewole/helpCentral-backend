import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/shared/common/abstract.repository';
import { UserSession } from './schemas/user-session.schema';

@Injectable()
export class UserSessionRepository extends AbstractRepository<UserSession> {
  constructor(
    @InjectModel(UserSession.name)
    private userSessionModel: Model<UserSession>,
  ) {
    super(userSessionModel);
  }
}
