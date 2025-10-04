import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { verifyAccountDto } from 'src/auth/dto/auth.dto';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import { TOKEN_TYPES } from './schema/user-token.schema';
import { UserTokenRepository } from './user-token.repository';

@Injectable()
export class UserTokensService {
  constructor(readonly userTokenRepository: UserTokenRepository) {}

  async saveUserToken(input: {
    userId: string | ObjectId;
    token: string;
    tokenExpires: Date;
    type: TOKEN_TYPES;
    userType?: USER_MODELS;
  }) {
    try {
      const {
        userId,
        token,
        tokenExpires: expires,
        type,
        userType = USER_MODELS.CHILDREN,
      } = input;
      const atLeastOneUserTokenTypeExists =
        await this.userTokenRepository.findOne({
          user: userId,
          type,
          userModel: userType,
        });
      if (atLeastOneUserTokenTypeExists)
        await this.userTokenRepository.deleteMany({
          user: userId,
          type,
          userModel: userType,
        });
      const savedUserToken = await this.userTokenRepository.create({
        user: userId,
        token,
        expires,
        type,
        userModel: userType,
      });
      return savedUserToken;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async validateUserToken(input: {
    userId: string;
    token: string;
    type: TOKEN_TYPES;
    userModel?: USER_MODELS;
  }) {
    try {
      const { userId, token, type, userModel } = input;
      const userTokenExists = await this.userTokenRepository.findOne({
        user: userId,
        token,
        type,
        userModel: userModel || USER_MODELS.CHILDREN,
      });
      if (!userTokenExists) return Promise.reject('Invalid Token');
      if (new Date().getTime() > new Date(userTokenExists.expires).getTime())
        return Promise.reject('Token Expired');
      return userTokenExists;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkTokenIsValid(
    token: string,
    type: TOKEN_TYPES,
    userModel?: USER_MODELS,
  ) {
    try {
      const tokenExists = await this.userTokenRepository.findOne({
        token,
        type,
        ...(userModel && { userModel }),
      });
      if (!tokenExists) return Promise.reject('Invalid Token');
      if (new Date().getTime() > new Date(tokenExists.expires).getTime())
        return Promise.reject('Token Expired');
      return tokenExists;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkEmailTokenIsValid(input: verifyAccountDto) {
    const { token } = input;
    try {
      const tokenExists = await this.userTokenRepository.findOne({ token });
      if (!tokenExists) return Promise.reject('Invalid Token');
      if (new Date().getTime() > new Date(tokenExists.expires).getTime())
        return Promise.reject('Token Expired');
      return tokenExists;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteAllUserToken(userId: string) {
    await this.userTokenRepository
      .deleteMany({ user: userId })
      .then(() => Promise.resolve(true))
      .catch((error) => Promise.reject(error));
  }
}
