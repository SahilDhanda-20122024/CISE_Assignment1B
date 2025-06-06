import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException,} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './schemas/article.schema';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() article: Partial<Article>): Promise<Article> {
    return this.articleService.create(article);
  }

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    const article = await this.articleService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  @Put(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<Article>): Promise<Article | null> {
  return this.articleService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Article> {
    const deleted = await this.articleService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return deleted;
  }
}