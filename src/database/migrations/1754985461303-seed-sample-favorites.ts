// src/database/migrations/1754985461303-seed-sample-favorites.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Favorite } from '../../modules/favorites/entities/favorite.entity';
import { FavoriteCategory } from '../../modules/favorites/entities/category.entity';

export class SeedSampleFavorites1754985461303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const catRepo = queryRunner.manager.getMongoRepository(FavoriteCategory);
    const favRepo = queryRunner.manager.getMongoRepository(Favorite);

    const coupleId = new ObjectId('66a000000000000000000001');
    const userA    = new ObjectId('66a0000000000000000000aa');
    const userB    = new ObjectId('66a0000000000000000000bb');

    const restoCat = await catRepo.findOne({ where: { name: 'restaurants' } });
    const filmCat  = await catRepo.findOne({ where: { name: 'films' } });

    await favRepo.insertMany([
      {
        coupleId, userId: userA, categoryId: restoCat!._id,
        itemName: 'Bistro Hugo', addedByUserId: userA, addedAt: new Date(),
      },
      {
        coupleId, userId: userB, categoryId: filmCat!._id,
        itemName: 'Inception', addedByUserId: userB, addedAt: new Date(),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const favRepo = queryRunner.manager.getMongoRepository(Favorite);
    await favRepo.deleteMany({ itemName: { $in: ['Bistro Hugo', 'Inception'] } });
  }
}
