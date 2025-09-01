import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmojimindAttempt, EmojimindAttemptDocument } from '../../schemas/emojimind-attempt.schema';

@Injectable()
export class EmojimindAttemptService {
  constructor(
    @InjectModel(EmojimindAttempt.name) private attemptModel: Model<EmojimindAttemptDocument>,
  ) {}

  async createAttempt(coupleId: string, attempt: string[], feedback: any): Promise<EmojimindAttempt> {
    return this.attemptModel.create({ coupleId, attempt, feedback });
  }

  async getAttempts(coupleId: string): Promise<EmojimindAttempt[]> {
    return this.attemptModel.find({ coupleId }).sort({ createdAt: 1 }).lean();
  }

  async deleteAttemptsByCoupleId(coupleId: string): Promise<{ deletedCount: number }> {
    const result = await this.attemptModel.deleteMany({ coupleId });
    return { deletedCount: result.deletedCount || 0 };
  }
}
