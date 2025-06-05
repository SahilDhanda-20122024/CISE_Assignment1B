// src/options/options.controller.ts
import { Controller, Get, Put, Body } from '@nestjs/common';
import { OptionsService } from './options.service';
import { Options } from './options.schema';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  async getOptions(): Promise<Options> {
    return this.optionsService.getOptions();
  }

  @Put()
  async updateOptions(@Body() data: Partial<Options>): Promise<Options> {
    return this.optionsService.updateOptions(data);
  }
}
