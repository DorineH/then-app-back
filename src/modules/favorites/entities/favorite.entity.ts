// src/favorites/entities/favorite.entity.ts
import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity({ name: 'favorites' })
export class Favorite {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column()
  coupleId: ObjectId;

  @Index()
  @Column()
  userId: ObjectId;

  @Index()
  @Column()
  categoryId: ObjectId;

  // champ libre (optionnel)
  @Column({ nullable: true })
  itemName?: string;

  // champs dynamiques
  @Column()
  fields: Record<string, string>;

  @Column({ nullable: true })
  link?: string;

  @Index()
  @Column()
  addedByUserId: ObjectId;

  @CreateDateColumn({ type: 'timestamp' })
  addedAt: Date;
}
