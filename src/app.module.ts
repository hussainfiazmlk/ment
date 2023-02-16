import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrudModule } from './crud/crud.module';


@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), CrudModule],
})
export class AppModule { }
