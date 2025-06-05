// src/options/options.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OptionsDocument = Options & Document;

@Schema()
export class Options {
  @Prop({ type: [String], default: [] })
  practices: string[];

  @Prop({ type: [String], default: [] })
  claims: string[];
}

export const OptionsSchema = SchemaFactory.createForClass(Options);
