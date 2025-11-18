import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../database/entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async findAll(isActive?: boolean): Promise<Banner[]> {
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    
    return await this.bannerRepository.find({
      where,
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Banner> {
    return await this.bannerRepository.findOne({ where: { id } });
  }
}
