import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmojimindDocument = Emojimind & Document;

@Schema({ collection: 'emojimind' })
export class Emojimind {
  @Prop({ required: true, unique: true })
  coupleId: string;

  @Prop({ type: [String], required: true })
  combination: string[];

  @Prop({ required: true })
  creatorUserId: string;
}

export const EmojimindSchema = SchemaFactory.createForClass(Emojimind);
