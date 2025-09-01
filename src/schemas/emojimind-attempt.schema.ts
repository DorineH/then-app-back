import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmojimindAttemptDocument = EmojimindAttempt & Document;

@Schema({ collection: 'emojimind_attempts', timestamps: true })
export class EmojimindAttempt {
  @Prop({ required: true })
  coupleId: string;

  @Prop({ type: [String], required: true })
  attempt: string[];

  @Prop({ type: Object, required: true })
  feedback: any;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EmojimindAttemptSchema = SchemaFactory.createForClass(EmojimindAttempt);
