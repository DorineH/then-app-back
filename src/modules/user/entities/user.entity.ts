import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  age: number;

  @ObjectIdColumn()
  coupleId: ObjectId;
}
