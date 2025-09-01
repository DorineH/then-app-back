import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository, Repository } from "typeorm";
import { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { ObjectId } from "mongodb";
import { TaskEntity } from "./entities/task.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: MongoRepository<TaskEntity>,
  ) {}

  async findByDay(coupleId: string, date: string): Promise<TaskEntity[]> {
    return this.repo.find({
      where: { coupleId, date },
      order: { time: "ASC", createdAt: "ASC" },
    });
  }

  async findRange(
    coupleId: string,
    from?: string,
    to?: string,
  ): Promise<TaskEntity[]> {
    const where: any = { coupleId };
    if (from || to) {
      where.date = {} as any;
      if (from) where.date.$gte = from;
      if (to) where.date.$lte = to;
    }
    return this.repo.find({ where, order: { date: "ASC", time: "ASC" } });
  }

  // async findByMonth(userId: string, coupleId: string, year: string, month: string): Promise<TaskEntity[]> {
  //   // Format attendu: year = '2025', month = '08' ou '8'
  //   // On construit les bornes du mois
  //   const m = month.padStart(2, '0');
  //   const from = `${year}-${m}-01`;
  //   // Calcul du dernier jour du mois
  //   const lastDay = new Date(Number(year), Number(month), 0).getDate();
  //   const to = `${year}-${m}-${lastDay}`;
  //   // Ajout du filtre userId
  //   return this.repo.find({
  //     where: {
  //       coupleId,
  //       userId,
  //       date: { $gte: from, $lte: to },
  //     },
  //     order: { date: "ASC", time: "ASC" },
  //   });
  // }

  async findByMonth(
    coupleId: string,
    year: string,
    month: string,
  ): Promise<TaskEntity[]> {
    const m = month.padStart(2, "0");
    const from = `${year}-${m}-01`;
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const to = `${year}-${m}-${lastDay}`;
    return this.repo.find({
      where: {
        coupleId,
        date: { $gte: from, $lte: to },
      },
      order: { date: "ASC", time: "ASC" },
    });
  }

  async create(
    userId: string,
    coupleId: string,
    dto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const entity = this.repo.create({
      ...dto,
      userId,
      coupleId,
      done: dto.done ?? false,
    });

    return this.repo.save(entity);
  }

  async update(
    id: string,
    userId: string,
    coupleId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.repo.findOne({
      where: { _id: new ObjectId(id), coupleId },
    });

    if (!task) throw new NotFoundException("Task not found");
    if (task.userId !== userId)
      throw new ForbiddenException("You can only update your own tasks");
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string, userId: string, coupleId: string): Promise<void> {
    const task = await this.repo.findOne({
      where: { _id: new ObjectId(id), coupleId },
    });
    if (!task) throw new NotFoundException("Task not found");
    if (task.userId !== userId)
      throw new ForbiddenException("You can only delete your own tasks");
    await this.repo.delete({ _id: new ObjectId(id) } as any);
  }
}
