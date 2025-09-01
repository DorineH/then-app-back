import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  age: number;

  @ApiPropertyOptional({ description: "ID du couple auquel appartient l'utilisateur (optionnel, généré si absent). Doit être un ObjectId MongoDB (24 caractères hexadécimaux)" })
  coupleId?: string;
}
