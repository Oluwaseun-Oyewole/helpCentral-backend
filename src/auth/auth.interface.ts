import { USER_MODELS } from 'src/shared/enums/index.enum';

export interface AccessJWTPayload {
  id: string;
  name: string;
  email: string;
  type: USER_MODELS.PEOPLE;
}
