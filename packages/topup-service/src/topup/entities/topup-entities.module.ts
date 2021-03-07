import { Module } from '@nestjs/common';
import { TopupEntities, TopupEntityServices } from '.';

@Module({
  providers: [...TopupEntities, ...TopupEntityServices],
  exports: [...TopupEntityServices],
})
export class TopupEntitiesModule {}
