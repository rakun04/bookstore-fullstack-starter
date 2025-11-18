import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('flash_sale_books')
export class FlashSaleBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  bookId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'int', default: 0 })
  discountPercentage: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'int', nullable: true })
  stockLimit: number;

  @Column({ type: 'int', default: 0 })
  soldCount: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Book, (book) => book.flashSaleBooks)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
