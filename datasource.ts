// datasource.ts
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Favorite } from './src/modules/favorites/entities/favorite.entity';
import { FavoriteCategory } from './src/modules/favorites/entities/category.entity';

export default new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  entities: [Favorite, FavoriteCategory],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true
});
