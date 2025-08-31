// src/favorites/entities/favorite-category.entity.ts
import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'favorite_categories' })
export class FavoriteCategory {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index({ unique: true })
  @Column()
  name: string;


  @Column({ nullable: true })
  icon?: string;

  @Column({ type: 'array', nullable: true })
  fields: {
    name: string;
    label: string;
    required: boolean;
    type: "text" | "url" | "number" | "date";
  }[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
