import { Injectable } from '@nestjs/common';
import { SaveUserSession } from './dto/create-user-session.dto';
import { UserSessionRepository } from './user-sessions.repository';

@Injectable()
export class UserSessionsService {
  constructor(private readonly userSessionRepository: UserSessionRepository) {}
  async saveUserSession(input: SaveUserSession) {
    try {
      const { user, jti, userModel, payload } = input;
      const response = await this.userSessionRepository.create({
        user,
        userModel,
        hash: jti,
        payload,
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkIfTokenJTIExistsInSessions(userId: string, jti: string) {
    return await this.userSessionRepository
      .findOne({ user: userId, hash: jti })
      .catch((error) => Promise.reject(error));
  }

  async deleteSession(sessionId: string) {
    try {
      await this.userSessionRepository.delete(sessionId);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(false);
    }
  }

  async deleteAllUserSession(userId: string) {
    await this.userSessionRepository
      .deleteMany({ user: userId })
      .then(() => Promise.resolve(true))
      .catch((error) => Promise.reject(error));
  }
}
