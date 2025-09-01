import { ConflictException, ForbiddenException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
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
        throw new BadRequestException(`coupleId invalide : "${id}" (doit être un ObjectId MongoDB)`);
      }
      return new ObjectId(id);
    }
    return id;  
  }

  // ---------- CATEGORIES ----------
  async createCategory(dto: CreateCategoryDto, coupleId: string) {
    const name = dto.name.trim().toLowerCase();
    // Unicité par coupleId + name
    const exists = await this.catRepo.findOne({ where: { name, coupleId: this.oid(coupleId) } });
    if (exists) throw new ConflictException('Cette catégorie existe déjà pour ce couple.');
    if (!dto.fields || !Array.isArray(dto.fields) || dto.fields.length === 0) {
      throw new ConflictException('Il faut définir au moins un champ pour la catégorie.');
    }
    for (const field of dto.fields) {
      if (!field.name || !field.label) {
        throw new ConflictException('Chaque champ doit avoir un nom et un label.');
      }
    }
    const cat = this.catRepo.create({
      coupleId: this.oid(coupleId),
      name,
      icon: dto.icon,
      fields: dto.fields,
    });
    return this.catRepo.save(cat);
  }

  async getCategories(coupleId: string) {
    return this.catRepo.find({ where: { coupleId: this.oid(coupleId) }, order: { name: 'ASC' } as any });
  }

  // ---------- FAVORITES ----------

  async createFavorite(
    userId: string,
    coupleId: string,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    const categoryName = createFavoriteDto.category.trim().toLowerCase();
    // Recherche la catégorie du couple
    const category = await this.catRepo.findOne({ where: { name: categoryName, coupleId: this.oid(coupleId) } });
    if (!category) throw new NotFoundException('Catégorie inconnue');

    // Construction dynamique des fields à partir de la définition de la catégorie
    const fields: Record<string, string> = {};
    if (!category.fields || !Array.isArray(category.fields)) {
      throw new ConflictException("La catégorie n'a pas de définition de champs.");
    }

    for (const fieldDef of category.fields) {
      // On cherche la valeur dans le DTO (priorité : champ direct)
      let value: any = (createFavoriteDto as any)[fieldDef.name];
      // Vérification des champs requis
      if (fieldDef.required && (value === undefined || value === null || value === "")) {
        throw new ConflictException(`Le champ "${fieldDef.label}" est obligatoire.`);
      }
      // Vérification du type (simple)
      if (value !== undefined && value !== null && value !== "") {
        if (fieldDef.type === "url") {
          try {
            // eslint-disable-next-line no-new
            new URL(value);
          } catch {
            throw new ConflictException(`Le champ "${fieldDef.label}" doit être une URL valide.`);
          }
        }
        if (fieldDef.type === "number" && isNaN(Number(value))) {
          throw new ConflictException(`Le champ "${fieldDef.label}" doit être un nombre.`);
        }
        if (fieldDef.type === "date" && isNaN(Date.parse(value))) {
          throw new ConflictException(`Le champ "${fieldDef.label}" doit être une date valide.`);
        }
      }
      if (value !== undefined) {
        fields[fieldDef.name] = value;
      }
    }

    // Fallback pour itemName : title ou premier champ de fields
    let itemName: string | undefined = createFavoriteDto.title;
    if (!itemName) {
      const firstFieldKey = Object.keys(fields)[0];
      if (firstFieldKey) {
        itemName = fields[firstFieldKey];
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
    const category = await this.catRepo.findOne({ where: { name: (categoryName ?? '').trim().toLowerCase(), coupleId: this.oid(coupleId) } });
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
  }
  