import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { Options } from './options.schema';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  async getOptions(): Promise<Options> {
    return this.optionsService.getOptions();
  }

  @Put(':type/:oldValue')
  async updateOption(
    @Param('type') type: string,
    @Param('oldValue') oldValue: string,
    @Body('newValue') newValue: string,
  ): Promise<Options> {
    if (!['sePractice', 'claim'].includes(type) || !newValue)
      throw new BadRequestException('Invalid type or new value');

    return this.optionsService.updateOption(
      type,
      decodeURIComponent(oldValue),
      newValue,
    );
  }

  @Post()
  async addOption(
    @Body() body: { type: string; value: string },
  ): Promise<Options> {
    const { type, value } = body;
    if (!['sePractice', 'claim'].includes(type) || !value)
      throw new BadRequestException('Invalid type or value');
    return this.optionsService.addOption(type, value);
  }

  @Delete(':type/:value')
  async deleteOption(
    @Param('type') type: string,
    @Param('value') value: string,
  ): Promise<Options> {
    if (!['sePractice', 'claim'].includes(type) || !value)
      throw new BadRequestException('Invalid type or value');
    return this.optionsService.deleteOption(type, decodeURIComponent(value));
  }
}
