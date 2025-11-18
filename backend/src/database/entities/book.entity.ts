import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

import { Category } from './category.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
import { FlashSaleBook } from './flash-sale-book.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  shortDescription: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ unique: true, nullable: true })
  isbn: string;

  @Column({ default: 'id' })
  language: string;

  @Column({ nullable: true })
  publicationYear: number;

  @Column({ nullable: true })
  pages: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  weight: number; // in kg

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  length: number; // in cm

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  width: number; // in cm

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  height: number; // in cm

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  soldCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  coverImage: string;

  @Column('jsonb', { nullable: true })
  galleryImages: string[];

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToMany(() => Category, (category) => category.books)
  @JoinTable({
    name: 'book_categories',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.book)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.book)
  wishlists: Wishlist[];

  @OneToMany(() => FlashSaleBook, (flashSaleBook) => flashSaleBook.book)
  flashSaleBooks: FlashSaleBook[];
}