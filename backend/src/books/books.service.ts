import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Book } from '../database/entities/book.entity';

interface BookQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  onFlashSale?: boolean;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(params?: BookQueryParams): Promise<Book[]> {
    const {
      page = 1,
      limit = 10,
      query,
      category,
      author,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      onFlashSale,
    } = params || {};

    const where: FindOptionsWhere<Book> | FindOptionsWhere<Book>[] = {};

    // Search query
    if (query) {
      where['title'] = Like(`%${query}%`);
    }

    // Author filter
    if (author) {
      where['author'] = Like(`%${author}%`);
    }

    // Price range
    if (minPrice !== undefined && maxPrice !== undefined) {
      where['price'] = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where['price'] = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where['price'] = LessThanOrEqual(maxPrice);
    }

    // Featured filter
    if (featured !== undefined) {
      where['isFeatured'] = featured;
    }

    // Flash sale filter (simplified - checking if discountPrice exists)
    if (onFlashSale !== undefined && onFlashSale) {
      // This is simplified; you may want to join with flash_sale_books table
      where['isActive'] = true;
    }

    // Active books only
    if (!where['isActive']) {
      where['isActive'] = true;
    }

    const skip = (page - 1) * limit;

    return await this.bookRepository.find({
      where,
      relations: ['categories'],
      order: {
        [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      },
      take: limit,
      skip,
    });
  }

  async findOne(id: string): Promise<Book> {
    return await this.bookRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }

  async findBySlug(slug: string): Promise<Book> {
    return await this.bookRepository.findOne({
      where: { slug },
      relations: ['categories'],
    });
  }
}
