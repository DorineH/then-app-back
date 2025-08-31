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

export class CategoryResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({
    required: false,
    example: "🎵",
    description: "Icône de la catégorie (emoji ou url)",
  })
  readonly icon?: string;

  @ApiProperty({ type: [CategoryFieldDefinitionDto] })
  readonly fields: CategoryFieldDefinitionDto[];
}

export class CreateFavoriteDto {
  @ApiProperty({ example: "musique", description: "Catégorie du favori" })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: "Peaches",
    description:
      "Titre du favori (optionnel, fallback sur un autre champ si absent)",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: "Description du favori",
    description: "Description (obligatoire pour les catégories génériques)",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "Justin Bieber",
    description: "Artiste (musique), Réalisateur (film), Auteur (livre)",
  })
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
  @ApiProperty({ example: "music" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    example: "🎵",
    description: "Icône de la catégorie (optionnel, emoji ou url d'image)",
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    type: [CategoryFieldDefinitionDto],
    description: "Définition des champs de la catégorie (autant que souhaité)",
  })
  @ValidateNested({ each: true })
  @Type(() => CategoryFieldDefinitionDto)
  fields: CategoryFieldDefinitionDto[];
}
