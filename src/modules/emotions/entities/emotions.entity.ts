import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('emotions')
export class EmotionEntity {
  // toObject() {
  //     throw new Error("Method not implemented.");
  // }

  @ObjectIdColumn()
  // @PrimaryGeneratedColumn('uuid')
  // @ApiProperty({ description: 'Identifiant unique de l\'émotion', example: 'b3d6a6ef-eaa2-4cd5-b204-1f0cf154ef0c' })
  id: ObjectId;

  @Column()
  // @ApiProperty({ description: 'Identifiant de l\'utilisateur', example: 'user-123' })
  userId: string;

  @Column()
  // @ApiProperty({ description: 'Identifiant du couple', example: 'couple-456' })
  coupleId: string;

  @Column()
  // @ApiProperty({ description: 'Emoji représentant l\'émotion', example: '😊' })
  emoji: string;

  @Column({ nullable: true })
  // @ApiProperty({ description: 'Message optionnel accompagnant l\'emoji', example: 'J\'ai passé une super journée !', required: false })
  optionalMessage?: string;

  @CreateDateColumn()
  // @ApiProperty({ description: 'Date et heure de création de l\'émotion', example: '2025-08-13T15:04:05.123Z' })
  createdAt: Date;
}
