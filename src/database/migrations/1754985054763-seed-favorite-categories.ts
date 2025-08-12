import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedFavoriteCategories1754985054763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const names = ['films', 'restaurants', 'voyages', 'livres', 'musique'];
        const collection = queryRunner.connection.mongoManager.getMongoRepository('favorite_categories');

        for (const name of names) {
            await collection.updateOne(
            { name },
            { $setOnInsert: { name, createdAt: new Date(), updatedAt: new Date() } },
            { upsert: true }
        );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const names = ['films', 'restaurants', 'voyages', 'livres', 'musique'];
        const collection = queryRunner.connection.mongoManager.getMongoRepository('favorite_categories');

        for (const name of names) {
        await collection.updateOne(
            { name },
            { $setOnInsert: { name, createdAt: new Date(), updatedAt: new Date() } },
            { upsert: true }
        );
        }
    }

}
