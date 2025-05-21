import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  journal: string;

  @Prop()
  year: number;

  @Prop()
  volume: string;

  @Prop()
  number: string;

  @Prop()
  pages: string;

  @Prop({ required: true })
  doi: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  sePractice: string;

  @Prop()
  claim: string;

  @Prop()
  result: string;

  @Prop()
  researchType: string;

  @Prop()
  participantType: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
