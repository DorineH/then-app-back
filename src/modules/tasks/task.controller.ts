import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
import {
  CreateTaskDto,
  UpdateTaskDto,
  DayQueryDto,
  RangeQueryDto,
} from "./dto/task.dto";
import { mapTask, Task } from "./task.mapper";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { TasksService } from "./task.service";
import { AuthUser } from "src/interfaces/auth-user.interface";
import { TaskEntity } from "./entities/task.entity";

@ApiTags("Tasks")
@Controller("/tasks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("bearerAuth")
export class TasksController {
  constructor(private readonly service: TasksService) {}

  /**
   * GET /tasks?date=YYYY-MM-DD – day view for axios
   */
  @Get()
  @ApiOkResponse({ type: [Object], description: "Tasks for a given day" })
  async getByDay(
    @Req() req: any,
    @Query() query: DayQueryDto,
  ): Promise<Task[]> {
    console.log("MMMMMMMMMMMMMMMMMMM");
    const user = req.user as AuthUser;
    const list = await this.service.findByDay(user.coupleId, query.date);
    return list.map(mapTask);
  }

  /**
   * GET /tasks/range?from=YYYY-MM-DD&to=YYYY-MM-DD – for list views / planning
   */
  @Get("range")
  @ApiOkResponse({ type: [Object], description: "Tasks in a date range" })
  async getRange(
    @Req() req: any,
    @Query() query: RangeQueryDto,
  ): Promise<Task[]> {
    const user = req.user as AuthUser;
    const list = await this.service.findRange(
      user.coupleId,
      query.from,
      query.to,
    );
    return list.map(mapTask);
  }

  /**
   * POST /tasks – create task
   */
  @Post()
  @ApiCreatedResponse({ type: Object })
  async create(@Req() req: any, @Body() dto: CreateTaskDto): Promise<Task> {
    // const user = req.user as AuthUser;
    try {
      const { userId, coupleId } = req.user;

      const created = await this.service.create(userId, coupleId, dto);
      return mapTask(created);

      //   return created;
    } catch (error) {
      console.error("Erreur create task:", error);
      throw error;
    }
  }

  /**
   * PUT /tasks/:id – update only own tasks
   */
  @Put(":id")
  @ApiOkResponse({ type: Object })
  async update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    // const user = req.user as AuthUser;
    const { userId, coupleId } = req.user;

    const updated = await this.service.update(id, userId, coupleId, dto);
    console.log("Updated task:", updated);
    return mapTask(updated);
  }

  /**
   * DELETE /tasks/:id – delete only own tasks
   */
  @Delete(":id")
  @HttpCode(204)
  @ApiNoContentResponse({ description: "Task deleted" })
  async delete(@Req() req: any, @Param("id") id: string): Promise<void> {
    const { userId, coupleId } = req.user;

    // const user = req.user as AuthUser;
    await this.service.remove(id, userId, coupleId);
  }
}
