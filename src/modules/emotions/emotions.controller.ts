import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Delete,
  InternalServerErrorException,
  Query,
} from "@nestjs/common";
import { EmotionsService } from "./emotions.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateEmotionDto } from "./dto/emotions.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { EmotionEntity } from "./entities/emotions.entity";

@ApiTags("Emotions")
@Controller("/emotion")
// @UseGuards(JwtAuthGuard)
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Créer une émotion" })
  @Post("addEmotion")
  @UseGuards(JwtAuthGuard)
  async createEmotion(
    @Req() req: any,
    @Body() dto: CreateEmotionDto,
  ): Promise<EmotionEntity> {
    try {
      const { userId, coupleId } = req.user;
      const emotion = await this.emotionsService.createOrUpdateEmotion(userId, coupleId, dto);
      return emotion;
    } catch (error) {
      console.error("Erreur createEmotion:", error);
      throw new InternalServerErrorException(
        "Erreur lors de l'ajout de l’émotion",
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Récuperer les émotions" })
  @Get("getEmotions")
  @UseGuards(JwtAuthGuard)
  // @Req() req: any,
  async getCurrent(@Query("coupleId") coupleId: string) {
    try {
      console.log(await this.emotionsService.getCurrentEmotions(coupleId));
      return await this.emotionsService.getCurrentEmotions(coupleId);
    } catch (error) {
      console.error("Erreur getCurrentEmotions:", error);
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des émotions",
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Récuperer la dernière émotions" })
  @Get("lastEmotionByUser")
  @UseGuards(JwtAuthGuard)
  async getLastEmotionPerUser(@Query("coupleId") coupleId: string) {
    try {
      //   const coupleId = req.user.coupleId;
      return await this.emotionsService.getLastEmotionsByUser(coupleId);
    } catch (error) {
      console.error("Erreur getLastEmotionPerUser:", error);
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des dernières émotions par utilisateur",
      );
    }
  }

  @ApiBearerAuth()
  @Delete()
  async deleteMyEmotion(@Req() req: any) {
    const userId = req.user["sub"];
    const coupleId = req.user["coupleId"];
    return this.emotionsService.deleteEmotion(userId, coupleId);
  }
}
