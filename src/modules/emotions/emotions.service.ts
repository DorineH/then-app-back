import { Injectable, ForbiddenException } from "@nestjs/common";
// import { Emotion } from "./../../schemas/emotions.schema";
import { CreateEmotionDto } from "./dto/emotions.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { EmotionEntity } from "./entities/emotions.entity";

@Injectable()
export class EmotionsService {
  constructor(
    @InjectRepository(EmotionEntity)
    private readonly emotionRepo: MongoRepository<EmotionEntity>,
  ) {}

  async createOrUpdateEmotion(
    userId: string,
    coupleId: string,
    dto: CreateEmotionDto,
  ): Promise<EmotionEntity> {

    // const now = new Date();
    // const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // const recent = await this.emotionRepo.findOne({
    //   where: { userId, coupleId, createdAt: { $gte: oneHourAgo } },
    //   order: { createdAt: "DESC" },
    // });

    // if (recent) {
    //   throw new ForbiddenException(
    //     "Tu dois attendre une heure avant de changer ton humeur.",
    //   );
    // }

    const newEmotion = this.emotionRepo.create({
      userId,
      coupleId,
      emoji: dto.emoji,
      optionalMessage: dto.optionalMessage,
      createdAt: new Date(),
    });

    return await this.emotionRepo.save(newEmotion);
  }

  async getCurrentEmotions(coupleId: string) {

    return await this.emotionRepo.find({
      where: { coupleId },
      order: { date: "DESC" },
    });
  }

  async getLastEmotionsByUser(coupleId: string): Promise<any[]> {
    const emotions = await this.emotionRepo
      .aggregate([
        { $match: { coupleId: coupleId } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$userId",
            emoji: { $first: "$emoji" },
            optionalMessage: { $first: "$optionalMessage" },
            createdAt: { $first: "$createdAt" },
          },
        },
      ])
      .toArray();

    return emotions.map((e) => ({
      userId: e._id,
      emoji: e.emoji,
      optionalMessage: e.optionalMessage,
      createdAt: e.createdAt,
    }));
  }

  async deleteEmotion(userId: string, coupleId: string) {
    return this.emotionRepo.deleteMany({ userId, coupleId });
  }
}
