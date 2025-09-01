import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/user.dto";
import { Public } from "../../auth/public.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags("users")
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: "Créer un utilisateur (coupleId optionnel, généré si absent)",
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(
      body.name,
      body.email,
      body.age,
      body.coupleId,
    );
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Lister tous les utilisateurs" })
  async findAll() {
    return this.userService.findAll();
  }

  @Get("/by-couple")
  @UseGuards(JwtAuthGuard)
  async getByCouple(@Req() req: any) {
    const coupleId = req.user?.coupleId;
    return this.userService.findByCoupleId(coupleId);
  }
}
