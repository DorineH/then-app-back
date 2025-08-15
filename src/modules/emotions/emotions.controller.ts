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
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("bearerAuth")
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @ApiOperation({ summary: "Créer une émotion" })
  @Post("addEmotion")
  //   @UseGuards(JwtAuthGuard)
  async createEmotion(
    @Req() req: any,
    @Body() dto: CreateEmotionDto,
  ): Promise<EmotionEntity> {
    try {
      const { userId, coupleId } = req.user;
      const emotion = await this.emotionsService.createOrUpdateEmotion(
        userId,
        coupleId,
        dto,
      );
      return emotion;
    } catch (error) {
      console.error("Erreur createEmotion:", error);
      throw new InternalServerErrorException(
        "Erreur lors de l'ajout de l’émotion",
      );
    }
  }

  //   @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "Récuperer les émotions" })
  @Get("getEmotions")
  //   @UseGuards(JwtAuthGuard)
  // @Req() req: any,
  //  @Query("coupleId") coupleId?: string
  async getCurrent(@Req() req: any) {
    try {
      const cid = req.user?.coupleId;

      return await this.emotionsService.getCurrentEmotions(cid);
    } catch (error) {
      console.error("Erreur getCurrentEmotions:", error);
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des émotions",
      );
    }
  }

  //   @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "Récuperer la dernière émotions" })
  @Get("lastEmotionByUser")
  //   @UseGuards(JwtAuthGuard)
  async getLastEmotionPerUser(
    @Req() req: any,
    // @Query("coupleId") coupleId?: string,
  ) {
    try {
      const cid = req.user?.coupleId;

      return await this.emotionsService.getLastEmotionsByUser(cid);
    } catch (error) {
      console.error("Erreur getLastEmotionPerUser:", error);
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des dernières émotions par utilisateur",
      );
    }
  }

  //   @ApiBearerAuth("bearerAuth")
  @Delete()
  async deleteMyEmotion(@Req() req: any) {
    const { userId, coupleId } = req.user;

    return this.emotionsService.deleteEmotion(userId, coupleId);
  }
}
