import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';

interface CategoryQueryParams {
  limit?: number;
  page?: number;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(params?: CategoryQueryParams): Promise<Category[]> {
    const { limit = 10, page = 1 } = params || {};
    const skip = (page - 1) * limit;

    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
      take: limit,
      skip,
    });
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { slug } });
  }
}
