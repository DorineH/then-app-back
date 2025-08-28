import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/user.schema";

@Injectable()
export class UserService {
  constructor(
    private userModel: Model<UserDocument>
  ) {}

  async create(name: string, email: string, age: number): Promise<User> {
    const createdUser = new this.userModel({ name, email, age });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
