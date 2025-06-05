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

  async getOptions(): Promise<OptionsDocument> {
    let options = await this.optionsModel.findOne().exec();
    if (!options) {
      options = new this.optionsModel({ sePractices: [], claims: [] });
      await options.save();
    }
    return options;
  }

  async renameOption(
    type: string,
    oldValue: string,
    newValue: string,
  ): Promise<Options> {
    const options = await this.optionsModel.findOne();

    if (!options) throw new Error('Options not found');

    if (type === 'sePractice') {
      const index = options.sePractices.indexOf(oldValue);
      if (index !== -1) {
        options.sePractices[index] = newValue;
      }
    } else if (type === 'claim') {
      const index = options.claims.indexOf(oldValue);
      if (index !== -1) {
        options.claims[index] = newValue;
      }
    }

    return options.save();
  }

  async updateOption(
    type: string,
    oldValue: string,
    newValue: string,
  ): Promise<Options> {
    const options = await this.optionsModel.findOne().exec();
    if (!options) throw new NotFoundException('Options not found');

    const field = type === 'sePractice' ? 'sePractices' : 'claims';
    const values = options[field];

    const index = values.indexOf(oldValue);
    if (index === -1)
      throw new NotFoundException(`${type} "${oldValue}" not found`);

    values[index] = newValue;
    return options.save();
  }

  async addOption(type: string, value: string): Promise<OptionsDocument> {
    const options = await this.getOptions();
    if (type === 'sePractice' && !options.sePractices.includes(value)) {
      options.sePractices.push(value);
    } else if (type === 'claim' && !options.claims.includes(value)) {
      options.claims.push(value);
    }
    return options.save();
  }

  async deleteOption(type: string, value: string): Promise<OptionsDocument> {
    const options = await this.getOptions();
    if (type === 'sePractice') {
      options.sePractices = options.sePractices.filter((v) => v !== value);
    } else if (type === 'claim') {
      options.claims = options.claims.filter((v) => v !== value);
    }
    return options.save();
  }
}
