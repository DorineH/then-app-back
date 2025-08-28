import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateCategoryDto, CreateFavoriteDto, FavoriteResponseDto } from "./dto/favorites.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FavoritesService } from "./favorites.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Favorite } from "./entities/favorite.entity";

@ApiTags("favorites")
@Controller("/favorites")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("bearerAuth")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // ----- CATEGRIES -----
  @ApiOperation({ summary: 'Créer une catégorie' })
  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.favoritesService.createCategory(dto);
  }

  @ApiOperation({ summary: 'Lister les catégories' })
  @Get('categories')
  async listCategories() {
    return this.favoritesService.getCategories();
  }

  // ----- FAVORITES -----
  @Post('addFavorite')
  @ApiOperation({ summary: "Créer un favori" })
  async create(
    @Body() createFavoritesDto: CreateFavoriteDto,
    @Req() req: any,
  ): Promise<Favorite> {
    const { userId, coupleId } = req.user;

    return this.favoritesService.createFavorite(userId, coupleId, createFavoritesDto);
  }

  @Get('getFavorites')
  @ApiOperation({ summary: "Lister tous les favoris" })
  async findAll(
    @Req() req: any,
    @Query("category") category: string,
  ): Promise<Favorite[]> {
    const { coupleId } = req.user;
  
    return this.favoritesService.getFavoritesByCategory(coupleId, category);
  }

  //   @Get("history")
  //   @ApiOperation({ summary: "Historique des favoris" })
  //   async getHistory(@Req() req): Promise<IFavorite[]> {
  //     const { coupleId } = req.user;
  //     return this.favoritesService.getAllFavoritesHistory(coupleId);
  //   }

  // @Delete(":id")
  // @ApiOperation({ summary: "Supprimer un favori" })
  // async deleteFavorite(
  //   @Req() req,
  //   @Param("id") id: string,
  // ): Promise<{ deleted: boolean }> {
  //   const { userId } = req.user;
  //   const result = await this.favoritesService.deleteFavorite(id, userId);
  //   if (!result) {
  //     throw new ForbiddenException(
  //       "Suppression non autorisée ou favori introuvable",
  //     );
  //   }
  //   return { deleted: true };
  // }
}
