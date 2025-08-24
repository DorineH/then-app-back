import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ObjectId,
} from "typeorm";

@Entity("tasks")
export class TaskEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column()
  userId: string; // creator/owner

  @Index()
  @Column()
  coupleId: string; // shared scope

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  /**
   * ISO date (YYYY-MM-DD) for day-based grouping
   */
  @Index()
  @Column()
  date: string;

  /** Optional time HH:mm (24h) */
  @Column({ nullable: true })
  time?: string;

  @Column()
  category: "work" | "personal" | "appointment" | "other";

  @Column({ default: false })
  done: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
