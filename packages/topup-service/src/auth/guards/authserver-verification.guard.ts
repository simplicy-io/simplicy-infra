import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  ConfigService,
} from '../../config/config.service';
import { AUTHORIZATION } from '../../constants/app-strings';

@Injectable()
export class AuthServerVerificationGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    if (
      request.headers[AUTHORIZATION] &&
      (await this.verifyAuthorization(request.headers[AUTHORIZATION]))
    ) {
      return true;
    }
    return false;
  }

  async verifyAuthorization(authorizationHeader): Promise<boolean> {
    try {
      const basicAuthHeader = authorizationHeader.split(' ')[1];
      const [reqClientId, reqClientSecret] = Buffer.from(
        basicAuthHeader,
        'base64',
      )
        .toString()
        .split(':');

      const envClientId = this.config.get(CLIENT_ID);
      const envClientSecret = this.config.get(CLIENT_SECRET);

      if (envClientId === reqClientId && envClientSecret === reqClientSecret) {
        return true;
      }
    } catch (error) {
      new ForbiddenException();
    }
    return false;
  }
}
