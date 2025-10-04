import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ChildrenAccessJWTPayload } from 'src/children/children.interface';
import { USER_MODELS } from 'src/shared/enums/index.enum';
import { AccessJWTPayload } from '../../../auth/auth.interface';

export const AuthenticatedPeople = createParamDecorator(
  (
    data: keyof (ChildrenAccessJWTPayload & { token: string }),
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AccessJWTPayload;
    const token = request.token as string;
    if (!user || !token) throw new UnauthorizedException();

    console.log(
      'is',
      user,
      'token',
      token,
      'requests - ',
      request,
      'context',
      ctx,
    );

    if (user.type !== USER_MODELS.SPONSOR) throw new UnauthorizedException();
    const userAndToken = { ...user, token };
    return data ? userAndToken[data] : userAndToken;
  },
);

export const AuthenticatedSponsor = createParamDecorator(
  (
    data: keyof (ChildrenAccessJWTPayload & { token: string }),
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AccessJWTPayload;
    const token = request.token as string;
    if (!user || !token) throw new UnauthorizedException();

    console.log(
      'is',
      user,
      'token',
      token,
      'requests - ',
      request,
      'context',
      ctx,
    );

    if (user.type !== USER_MODELS.SPONSOR) throw new UnauthorizedException();
    const userAndToken = { ...user, token };
    return data ? userAndToken[data] : userAndToken;
  },
);
