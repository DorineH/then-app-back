import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto, CreateFavoriteDto } from "./dto/favorites.dto";
import { DeepPartial, MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";

import { Favorite } from "./entities/favorite.entity";
import { FavoriteCategory } from "./entities/category.entity";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favRepo: MongoRepository<Favorite>,
    @InjectRepository(FavoriteCategory)
    private readonly catRepo: MongoRepository<FavoriteCategory>,
  ) {}

  // Helpers
  private oid(id: string | ObjectId) {
    if (typeof id === "string") {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: "${id}"`);
      }
      return new ObjectId(id);
    }
    return id;
  }

  normalize = (s: string) =>
    (s ?? "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  isTitleLike = (s: string) => {
    const n = this.normalize(s);
    return n === "title" || n === "titre";
  };

  // ---------- CATEGORIES ----------
  async createCategory(dto: CreateCategoryDto) {
    const name = dto.name.trim().toLowerCase();
    const exists = await this.catRepo.findOne({ where: { name } });
    if (exists) throw new ConflictException("Cette catégorie existe déjà.");
    if (!dto.fields || !Array.isArray(dto.fields) || dto.fields.length === 0) {
      throw new ConflictException(
        "Il faut définir au moins un champ pour la catégorie.",
      );
    }
    for (const field of dto.fields) {
      if (!field.name || !field.label) {
        throw new ConflictException(
          "Chaque champ doit avoir un nom et un label.",
        );
      }
    }
    const cat = this.catRepo.create({
      name,
      fields: dto.fields,
    });
    return this.catRepo.save(cat);
  }

  async getCategories() {
    return this.catRepo.find({ order: { name: "ASC" } as any });
  }

  // ---------- FAVORITES ----------
  async createFavorite(
    userId: string,
    coupleId: string,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    const categoryName = createFavoriteDto.category.trim().toLowerCase();
    const category = await this.catRepo.findOne({
      where: { name: categoryName },
    });
    if (!category) throw new NotFoundException("Catégorie inconnue");

    // Construction dynamique des fields à partir de la définition de la catégorie
    const fields: Record<string, string> = {};
    if (!category.fields || !Array.isArray(category.fields)) {
      throw new ConflictException(
        "La catégorie n'a pas de définition de champs.",
      );
    }

    for (const def of category.fields) {
      let value: any = (createFavoriteDto as any)[def.name];

      if (
        (value === undefined || value === null || value === "") &&
        createFavoriteDto.fields &&
        typeof createFavoriteDto.fields === "object"
      ) {
        value = (createFavoriteDto.fields as any)[def.name];
      }

      if (
        (value === undefined || value === null || value === "") &&
        this.isTitleLike(def.name)
      ) {
        value = createFavoriteDto.title;
      }

      if (
        def.required &&
        (value === undefined || value === null || String(value).trim() === "")
      ) {
        throw new ConflictException(`Le champ "${def.label}" est obligatoire.`);
      }

      // Vérification du type (simple)
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        const str = String(value);
        if (def.type === "url") {
          try {
            new URL(str);
          } catch {
            throw new ConflictException(
              `Le champ "${def.label}" doit être une URL valide.`,
            );
          }
        }
        if (def.type === "number" && isNaN(Number(str))) {
          throw new ConflictException(
            `Le champ "${def.label}" doit être un nombre.`,
          );
        }
        if (def.type === "date" && isNaN(Date.parse(str))) {
          throw new ConflictException(
            `Le champ "${def.label}" doit être une date valide.`,
          );
        }
        fields[def.name] = str;
      }
    }

    const entity: DeepPartial<Favorite> = {
      coupleId: this.oid(coupleId),
      userId: this.oid(userId),
      categoryId: category._id,
      itemName: createFavoriteDto.title,
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
    const category = await this.catRepo.findOne({
      where: { name: (categoryName ?? "").trim().toLowerCase() },
    });
    if (!category) return [];
    return this.favRepo.find({
      where: { coupleId: this.oid(coupleId), categoryId: category._id },
      order: { addedAt: "DESC" } as any,
    });
  }

  // Récupération de tout l'historique (toutes catégories)
  //   async getAllFavoritesHistory(coupleId: string): Promise<IFavorite[]> {
  //     return this.favoriteModel.find({ coupleId }).sort({ createdAt: -1 }).exec();
  //   }
}
