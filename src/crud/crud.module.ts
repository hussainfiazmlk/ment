import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CrudController],
  providers: [CrudService],
  exports: [CrudService]
})
export class CrudModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'products(.*)', method: RequestMethod.GET })
      .forRoutes(CrudController);
  }
}
