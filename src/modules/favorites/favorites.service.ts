import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, CreateFavoriteDto } from "./dto/favorites.dto";
import { DeepPartial, MongoRepository } from "typeorm";
import { ObjectId } from 'mongodb';

import { Favorite } from "./entities/favorite.entity";
import { FavoriteCategory } from "./entities/category.entity";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) 
    private readonly favRepo: MongoRepository<Favorite>,
    @InjectRepository(FavoriteCategory) 
    private readonly catRepo: MongoRepository<FavoriteCategory>
  ) {}

    // Helpers
  private oid(id: string | ObjectId) {
    if (typeof id === 'string') {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: "${id}"`);
      }
      return new ObjectId(id);
    }
    return id;  
  }

  // ---------- CATEGORIES ----------
  async createCategory(dto: CreateCategoryDto) {
    const name = dto.name.trim().toLowerCase();
    const exists = await this.catRepo.findOne({ where: { name } });
    if (exists) throw new ConflictException('Cette catégorie existe déjà.');
    const cat = this.catRepo.create({ name });
    return this.catRepo.save(cat);
  }

  async getCategories() {
    return this.catRepo.find({ order: { name: 'ASC' } as any });
  }

  // ---------- FAVORITES ----------
  async createFavorite(
    userId: string,
    coupleId: string,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    const categoryName = createFavoriteDto.category.trim().toLowerCase();
    const category = await this.catRepo.findOne({ where: { name: categoryName } });
    if (!category) throw new NotFoundException('Catégorie inconnue');

    let fields: Record<string, string> = {};
    let itemName = createFavoriteDto.title;

    if (categoryName === 'musique') {
      if (!createFavoriteDto.title || !createFavoriteDto.authorOrArtistOrDirector) {
        throw new ConflictException('Pour la catégorie Musique, le titre et l\'artiste sont obligatoires.');
      }
      fields = {
        titre: createFavoriteDto.title,
        artiste: createFavoriteDto.authorOrArtistOrDirector,
      };
    } else if (categoryName === 'films') {
      if (!createFavoriteDto.title || !createFavoriteDto.authorOrArtistOrDirector) {
        throw new ConflictException('Pour la catégorie Film, le titre et le réalisateur sont obligatoires.');
      }
      fields = {
        titre: createFavoriteDto.title,
        realisateur: createFavoriteDto.authorOrArtistOrDirector,
      };
    } else if (categoryName === 'livres') {
      if (!createFavoriteDto.title || !createFavoriteDto.authorOrArtistOrDirector) {
        throw new ConflictException('Pour la catégorie Livre, le titre et l\'auteur sont obligatoires.');
      }
      fields = {
        titre: createFavoriteDto.title,
        auteur: createFavoriteDto.authorOrArtistOrDirector,
      };
    } else {
      if (!createFavoriteDto.title || !createFavoriteDto.description) {
        throw new ConflictException('Pour cette catégorie, le titre et la description sont obligatoires.');
      }
      fields = {
        titre: createFavoriteDto.title,
        description: createFavoriteDto.description,
      };
      if (createFavoriteDto.photo) {
        fields.photo = createFavoriteDto.photo;
      }
    }

    const entity: DeepPartial<Favorite> = {
      coupleId: this.oid(coupleId),
      userId: this.oid(userId),
      categoryId: category._id,
      itemName,
      fields,
      link: createFavoriteDto.link,
      addedByUserId: this.oid(userId),
      addedAt: new Date(),
    };

    const favorite = this.favRepo.create(entity);
    return this.favRepo.save(favorite);
  }

  // Récupération des favoris d'une catégorie donnée
  async getFavoritesByCategory(
    coupleId: string,
    categoryName: string,
  ): Promise<Favorite[]> {
    const category = await this.catRepo.findOne({ where: { name: (categoryName ?? '').trim().toLowerCase() } });
    if (!category) return [];
    return this.favRepo.find({
      where: { coupleId: this.oid(coupleId), categoryId: category._id },
      order: { addedAt: 'DESC' } as any,
    });
  }

  // Récupération de tout l'historique (toutes catégories)
  //   async getAllFavoritesHistory(coupleId: string): Promise<IFavorite[]> {
  //     return this.favoriteModel.find({ coupleId }).sort({ createdAt: -1 }).exec();
  //   }

  // Suppression (l'utilisateur ne peut supprimer que ses favoris)
  async deleteFavorite(id: string, userId: string) {
    const fav = await this.favRepo.findOne({ where: { _id: this.oid(id) } });
    if (!fav) throw new NotFoundException('Favori introuvable');
    if (String(fav.userId) !== String(this.oid(userId))) {
      throw new ForbiddenException('Suppression non autorisée');
    }
    await this.favRepo.delete({ _id: fav._id });
    return { deleted: true };
  }
}
