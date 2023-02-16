import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrudModule } from './crud/crud.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), CrudModule, AuthModule],
})
export class AppModule { }
