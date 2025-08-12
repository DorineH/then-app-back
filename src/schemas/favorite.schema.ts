import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Favorite extends Document {
//   @Prop({ required: true }) userId: string;
//   @Prop({ required: true }) coupleId: string;
  @Prop({ required: true }) category: string;
  @Prop({ type: Object, required: true }) fields: Record<string, string>;
  @Prop() link?: string;
  @Prop({ default: Date.now }) createdAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
