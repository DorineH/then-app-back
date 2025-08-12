import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedFavoriteCategories1754985054763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const categories = [
            {
                name: 'films',
                fields: [
                    { name: 'titre', label: 'Titre', required: true, type: 'text' },
                    { name: 'realisateur', label: 'Réalisateur', required: true, type: 'text' },
                ]
            },
            {
                name: 'restaurants',
                fields: [
                    { name: 'nom', label: 'Nom', required: true, type: 'text' },
                    { name: 'adresse', label: 'Adresse', required: false, type: 'text' },
                ]
            },
            {
                name: 'voyages',
                fields: [
                    { name: 'destination', label: 'Destination', required: true, type: 'text' },
                    { name: 'date', label: 'Date', required: false, type: 'date' },
                ]
            },
            {
                name: 'livres',
                fields: [
                    { name: 'titre', label: 'Titre', required: true, type: 'text' },
                    { name: 'auteur', label: 'Auteur', required: true, type: 'text' },
                ]
            },
            {
                name: 'musique',
                fields: [
                    { name: 'titre', label: 'Titre', required: true, type: 'text' },
                    { name: 'artiste', label: 'Artiste', required: true, type: 'text' },
                ]
            },
        ];
        const collection = queryRunner.connection.mongoManager.getMongoRepository('favorite_categories');

        for (const cat of categories) {
            await collection.updateOne(
                { name: cat.name },
                { $setOnInsert: { ...cat, createdAt: new Date(), updatedAt: new Date() } },
                { upsert: true }
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const names = ['films', 'restaurants', 'voyages', 'livres', 'musique'];
        const collection = queryRunner.connection.mongoManager.getMongoRepository('favorite_categories');

        for (const name of names) {
            await collection.deleteOne({ name });
        }
    }

}
