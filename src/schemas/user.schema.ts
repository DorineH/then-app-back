import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  coupleId: string; // Ajout du coupleId pour lier l'utilisateur à un couple
}

export const UserSchema = SchemaFactory.createForClass(User);
