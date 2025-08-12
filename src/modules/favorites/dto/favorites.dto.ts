import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsObject,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFavoriteDto {
  @ApiProperty({ example: "musique", description: "Catégorie du favori" })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: "Peaches", description: "Titre du favori (obligatoire pour toutes les catégories)" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Description du favori", description: "Description (obligatoire pour les catégories génériques)" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: "Justin Bieber", description: "Artiste (musique), Réalisateur (film), Auteur (livre)" })
  @IsOptional()
  @IsString()
  authorOrArtistOrDirector?: string;

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

export class CreateCategoryDto {
  @ApiProperty({ example: 'music' })
  @IsString()
  @IsNotEmpty()
  name: string;
}