import { Body, Controller, Get, Post, Query, UseGuards, Req, Delete, Res, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { EmojimindService } from './emojimind.service';
import { EmojimindAttemptService } from './emojimind-attempt.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('emojimind')
export class EmojimindController {
  constructor(
    private readonly emojimindService: EmojimindService,
    private readonly emojimindAttemptService: EmojimindAttemptService,
  ) {}
  @Delete('combination')
  async deleteCombination(@Query('coupleId') coupleId: string, @Res() res) {
    if (!coupleId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'coupleId is required' });
    }
    try {
      const result = await this.emojimindService.deleteCombinationByCoupleId(coupleId);
      if (result.deletedCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Combination not found' });
      }
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting combination' });
    }
  }

  @Delete('attempts')
  async deleteAttempts(@Query('coupleId') coupleId: string, @Res() res) {
    if (!coupleId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'coupleId is required' });
    }
    try {
      const result = await this.emojimindAttemptService.deleteAttemptsByCoupleId(coupleId);
      if (result.deletedCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'No attempts found' });
      }
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting attempts' });
    }
  }

  @Post('combination')
  async setCombination(
    @Body('coupleId') coupleId: string,
    @Body('combination') combination: string[],
    @Body('creatorUserId') creatorUserIdFromBody: string,
  @Req() req: Request & { user?: any },
  ) {
    // Prend creatorUserId du body si fourni, sinon du JWT
    let creatorUserId = creatorUserIdFromBody;
    if (!creatorUserId && req.user && typeof req.user === 'object' && 'userId' in req.user) {
      creatorUserId = req.user.userId;
    }
    await this.emojimindService.upsertCombination(coupleId, combination, creatorUserId);
    return { success: true };
  }

  @Get('combination')
  async getCombination(@Query('coupleId') coupleId: string) {
    const result = await this.emojimindService.getCombination(coupleId);
    return {
      combination: result.combination || [],
      creatorUserId: result.creatorUserId,
    };
  }
}
