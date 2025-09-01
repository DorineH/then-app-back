import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmojimindController } from "./emojimind.controller";
import { EmojimindService } from "./emojimind.service";
import { Emojimind, EmojimindSchema } from "../../schemas/emojimind.schema";
import { EmojimindAttempt, EmojimindAttemptSchema } from '../../schemas/emojimind-attempt.schema';
import { EmojimindAttemptService } from './emojimind-attempt.service';
import { EmojimindAttemptController } from './emojimind-attempt.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Emojimind.name, schema: EmojimindSchema },
      { name: EmojimindAttempt.name, schema: EmojimindAttemptSchema },
    ]),
  ],
  controllers: [EmojimindController, EmojimindAttemptController],
  providers: [EmojimindService, EmojimindAttemptService],
  exports: [EmojimindService, EmojimindAttemptService],
})
export class EmojimindModule {}
