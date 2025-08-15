import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEmotionDto {
  @IsString()
  @IsNotEmpty()
  emoji: string;

  @IsOptional()
  @IsString()
  optionalMessage?: string;
}
