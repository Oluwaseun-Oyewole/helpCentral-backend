import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from 'src/shared/constants/index.constant';

export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
