import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ServerSettingsService } from '../../system-settings/entities/server-settings/server-settings.service';
import { AUTHORIZATION } from '../../constants/app-strings';

@Injectable()
export class AuthServerVerificationGuard implements CanActivate {
  constructor(private readonly settings: ServerSettingsService) {}

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
      const settings = await this.settings.find();
      const basicAuthHeader = authorizationHeader.split(' ')[1];
      const [clientId, clientSecret] = Buffer.from(basicAuthHeader, 'base64')
        .toString()
        .split(':');

      if (
        settings?.clientId === clientId &&
        settings?.clientSecret === clientSecret
      ) {
        return true;
      }
    } catch (error) {
      new ForbiddenException();
    }
    return false;
  }
}
