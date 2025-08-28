import { Module } from "@nestjs/common";
import { FavoritesController } from "./favorites.controller";
import { FavoritesService } from "./favorites.service";
import { Favorite } from './entities/favorite.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteCategory } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite , FavoriteCategory]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService]
})
export class FavoriteModule {}
