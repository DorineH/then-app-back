import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { Type } from 'class-transformer';

const DATE_REGEX = /^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/; // YYYY-MM-DD
const TIME_REGEX = /^(?:[01]\\d|2[0-3]):[0-5]\\d$/; // HH:mm

export class CreateTaskDto {
  @ApiProperty({ example: "Appel du soir" })
  @IsString()
  @Length(1, 120)
  title!: string;

  @ApiPropertyOptional({ example: "Appel vidéo quotidien" })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ example: "2025-01-14", description: "YYYY-MM-DD" })
  @Matches(DATE_REGEX, { message: "date must be YYYY-MM-DD" })
  date!: string;

  @ApiPropertyOptional({ example: "20:00", description: "HH:mm 24h" })
  @IsOptional()
  @Matches(TIME_REGEX, { message: "time must be HH:mm" })
  time?: string;

  @ApiProperty({
    enum: ["work", "personal", "appointment", "other"],
    example: "personal",
  })
  @IsIn(["work", "personal", "appointment", "other"])
  category!: "work" | "personal" | "appointment" | "other";

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 120)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ description: "YYYY-MM-DD" })
  @IsOptional()
  @Matches(DATE_REGEX, { message: "date must be YYYY-MM-DD" })
  date?: string;

  @ApiPropertyOptional({ description: "HH:mm" })
  @IsOptional()
  @Matches(TIME_REGEX, { message: "time must be HH:mm" })
  time?: string;

  @ApiPropertyOptional({ enum: ["work", "personal", "appointment", "other"] })
  @IsOptional()
  @IsIn(["work", "personal", "appointment", "other"])
  category?: "work" | "personal" | "appointment" | "other";

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

export class DayQueryDto {
  @ApiProperty({ example: "2025-01-14", description: "YYYY-MM-DD" })
  @Matches(DATE_REGEX, { message: "date must be YYYY-MM-DD" })
  date!: string;
}

export class RangeQueryDto {
  @ApiPropertyOptional({ example: "2025-01-14" })
  @IsOptional()
  @Matches(DATE_REGEX)
  from?: string;

  @ApiPropertyOptional({ example: "2025-01-20" })
  @IsOptional()
  @Matches(DATE_REGEX)
  to?: string;
}

// DTO pour la requête de mois
export class MonthQueryDto {
  @ApiProperty({ example: '2025', description: 'Année sur 4 chiffres' })
  @Type(() => String)
  @Matches(/^\d{4}$/, { message: 'year must be YYYY' })
  year!: string;

  @ApiProperty({ example: '08', description: 'Mois sur 2 chiffres (01-12)' })
  @Type(() => String)
  @Matches(/^(0[1-9]|1[0-2]|[1-9])$/, { message: 'month must be MM (01-12)' })
  month!: string;
}
