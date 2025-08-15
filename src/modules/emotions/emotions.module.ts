import { Module } from "@nestjs/common";
import { EmotionsController } from "./emotions.controller";
import { EmotionsService } from "./emotions.service";
// import { Emotion } from "src/schemas/emotions.schema";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmotionEntity } from "./entities/emotions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmotionEntity])],
  controllers: [EmotionsController],
  providers: [EmotionsService],
  exports: [EmotionsService],
})
export class EmotionsModule {}
