// src/options/options.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Options, OptionsDocument } from './options.schema';

@Injectable()
export class OptionsService {
  constructor(
    @InjectModel(Options.name) private optionsModel: Model<OptionsDocument>,
  ) {}

  async getOptions(): Promise<Options> {
    let options = await this.optionsModel.findOne().exec();
    if (!options) {
      // create default if none exists
      options = new this.optionsModel({ practices: [], claims: [] });
      await options.save();
    }
    return options;
  }

  async updateOptions(data: Partial<Options>): Promise<Options> {
    const options = await this.optionsModel.findOne().exec();
    if (!options) throw new NotFoundException('Options not found');

    if (data.practices) options.practices = data.practices;
    if (data.claims) options.claims = data.claims;

    return options.save();
  }
}
