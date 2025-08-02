import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/user.dto";

@ApiTags("users")
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Créer un utilisateur" })
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body.name, body.email, body.age);
  }

  @Get()
  @ApiOperation({ summary: "Lister tous les utilisateurs" })
  async findAll() {
    return this.userService.findAll();
  }
}
