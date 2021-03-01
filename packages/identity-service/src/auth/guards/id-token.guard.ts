import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService, JWKS_ENDPOINT } from '../../config/config.service';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class IdTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req: Request & { idToken: unknown } = httpContext.getRequest();
    const idToken = this.getIdToken(req);
    return new Promise<boolean>(resolve => {
      jwt.verify(idToken, this.getKey.bind(this), (err, decoded) => {
        if (err) {
          return resolve(false);
        }
        req.idToken = decoded;
        return resolve(true);
      });
    });
  }

  getIdToken(request: Request) {
    if (!request.headers.authorization) {
      return null;
    }
    return request.headers.authorization.split(' ')[1] || null;
  }

  getKey(header, callback) {
    const client = jwksClient({
      jwksUri: this.config.get(JWKS_ENDPOINT),
    });

    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      if (signingKey) {
        return callback(null, signingKey);
      }
    });
  }
}
