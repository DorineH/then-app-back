import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { EmojimindAttemptService } from './emojimind-attempt.service';

@UseGuards(JwtAuthGuard)
@Controller('emojimind')
export class EmojimindAttemptController {
  constructor(private readonly attemptService: EmojimindAttemptService) {}

  @Post('attempt')
  async createAttempt(
    @Body('coupleId') coupleId: string,
    @Body('attempt') attempt: string[],
    @Body('feedback') feedback: any,
  ) {
    const created = await this.attemptService.createAttempt(coupleId, attempt, feedback);
    return { success: true, attempt: created };
  }

  @Get('attempts')
  async getAttempts(@Query('coupleId') coupleId: string) {
    const attempts = await this.attemptService.getAttempts(coupleId);
    return { attempts };
  }
}
