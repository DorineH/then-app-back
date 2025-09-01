import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { ObjectId } from "mongodb";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    name: string,
    email: string,
    age: number,
    coupleId?: string,
  ): Promise<User> {
    // Génère un coupleId si non fourni, et s'assure que c'est un ObjectId
    let finalCoupleId: ObjectId;
    if (coupleId && ObjectId.isValid(coupleId)) {
      finalCoupleId = new ObjectId(coupleId);
    } else {
      finalCoupleId = new ObjectId(); // génère un nouvel ObjectId
    }
    const createdUser = this.userRepository.create({
      name,
      email,
      age,
      coupleId: finalCoupleId,
    });
    return this.userRepository.save(createdUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByCoupleId(coupleId: string) {
    const objectId = new ObjectId(coupleId);
    return this.userRepository.find({ where: { coupleId: objectId } });
  }
}
