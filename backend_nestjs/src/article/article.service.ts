import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(article: Partial<Article>): Promise<Article> {
    return this.articleModel.create(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  async update(id: string, article: Partial<Article>): Promise<Article | null> {
    return this.articleModel.findByIdAndUpdate(id, article, { new: true });
  }

  async delete(id: string): Promise<Article | null> {
    return this.articleModel.findByIdAndDelete(id);
  }
}
