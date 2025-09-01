import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emojimind, EmojimindDocument } from "src/schemas/emojimind.schema";


@Injectable()
export class EmojimindService {
  constructor(
    @InjectModel(Emojimind.name) private emojimindModel: Model<EmojimindDocument>,
  ) {}


  async upsertCombination(coupleId: string, combination: string[], creatorUserId: string): Promise<Emojimind> {
    return this.emojimindModel.findOneAndUpdate(
      { coupleId },
      { coupleId, combination, creatorUserId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  async getCombination(coupleId: string): Promise<{ combination: string[]; creatorUserId: string | null }> {
    const doc = await this.emojimindModel.findOne({ coupleId });
    return doc ? { combination: doc.combination, creatorUserId: doc.creatorUserId } : { combination: [], creatorUserId: null };
  }

  async deleteCombinationByCoupleId(coupleId: string): Promise<{ deletedCount: number }> {
    const result = await this.emojimindModel.deleteOne({ coupleId });
    return { deletedCount: result.deletedCount || 0 };
  }
}
