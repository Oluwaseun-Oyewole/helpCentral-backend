import { AccessJWTPayload } from 'src/auth/auth.interface';
import { USER_MODELS } from 'src/shared/enums/index.enum';

export class SaveUserSession {
  user: string;
  jti: string;
  userModel: USER_MODELS;
  payload: AccessJWTPayload;
}
