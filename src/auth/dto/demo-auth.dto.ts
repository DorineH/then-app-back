import { ApiProperty } from '@nestjs/swagger';

export class DemoAuthDto {
  @ApiProperty({ example: 'a1b2c3d4-uuid', description: 'ID de l’utilisateur' })
  userId: string;

  @ApiProperty({ example: 'abc123', description: 'ID du couple' })
  coupleId: string;

  @ApiProperty({ example: 'user@email.com', description: 'Email de l’utilisateur' })
  email: string;
}
