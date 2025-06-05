// src/options/options.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Options, OptionsSchema } from './options.schema';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Options.name, schema: OptionsSchema }])],
  providers: [OptionsService],
  controllers: [OptionsController],
  exports: [OptionsService],
})
export class OptionsModule {}
