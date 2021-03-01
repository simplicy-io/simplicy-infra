import { Module } from '@nestjs/common';
import { AuthEntities, AuthEntityServices } from '.';

@Module({
  providers: [...AuthEntities, ...AuthEntityServices],
  exports: [...AuthEntityServices],
})
export class AuthEntitiesModule {}
