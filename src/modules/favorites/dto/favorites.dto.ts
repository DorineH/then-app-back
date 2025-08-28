import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsObject,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateFavoriteDto {
  @ApiProperty({ example: "musique", description: "Catégorie du favori" })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: "Peaches",
    description: "Titre du favori (obligatoire pour toutes les catégories)",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  // @ApiProperty({
  //   example: "Description du favori",
  //   description: "Description (obligatoire pour les catégories génériques)",
  // })
  // @IsOptional()
  // @IsString()
  // description?: string;

  // @ApiProperty({ example: "Justin Bieber", description: "Artiste (musique), Réalisateur (film), Auteur (livre)" })
  // @IsOptional()
  // @IsString()
  // authorOrArtistOrDirector?: string;
  @ApiProperty({
    required: false,
    example: { titre: 'Mercredi', description: 'Top', realisateur: 'Burton' },
    description: "Champs dynamiques de la catégorie (clé = name du champ)",
  })
  @IsOptional()
  @IsObject()
  fields?: Record<string, string>;

  @ApiProperty({
    required: false,
    example: "https://open.spotify.com/...",
    description: "Lien externe (optionnel)",
  })
  @IsOptional()
  @IsString()
  @IsUrl(
    { require_tld: false },
    { message: "Le lien doit être une URL valide" },
  )
  link?: string;

  @ApiProperty({
    required: false,
    example: "https://image.com/photo.jpg",
    description: "Photo (optionnel, pour catégories génériques)",
  })
  @IsOptional()
  @IsString()
  photo?: string;
}

export class FavoriteResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly coupleId: string;

  @ApiProperty()
  readonly category: string;

  @ApiProperty({ type: Object })
  readonly fields: Record<string, string>;

  @ApiProperty({ required: false })
  readonly link?: string;

  @ApiProperty()
  readonly createdAt: Date;
}

export class CategoryFieldDefinitionDto {
  @ApiProperty({ example: "titre" })
  @IsString()
  name: string;

  @ApiProperty({ example: "Titre" })
  @IsString()
  label: string;

  @ApiProperty({ example: true })
  required: boolean;

  @ApiProperty({ example: "text", enum: ["text", "url", "number", "date"] })
  @IsString()
  type: "text" | "url" | "number" | "date";
}

export class CreateCategoryDto {
  @ApiProperty({ example: "music" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: "test titre",
    type: [CategoryFieldDefinitionDto],
    description: "Définition des champs de la catégorie (autant que souhaité)",
  })
  @ValidateNested({ each: true })
  @Type(() => CategoryFieldDefinitionDto)
  fields: CategoryFieldDefinitionDto[];
}
