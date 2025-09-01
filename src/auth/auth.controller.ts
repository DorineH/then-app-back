import { Body, Controller, ForbiddenException, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { Public } from "./public.decorator";
import { DemoAuthDto } from "./dto/demo-auth.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Public()
  @Post("demo")
  @ApiOperation({ summary: "DEV ONLY - issue a demo JWT" })
  @ApiBody({ type: DemoAuthDto })
  issueDemo(
    @Body() body: DemoAuthDto,
  ) {
    if (process.env.NODE_ENV === "production") {
      throw new ForbiddenException("Demo token disabled in production");
    }
    if (!body?.userId || !body?.coupleId || !body?.email) {
      throw new ForbiddenException("Vous devez fournir userId, coupleId et email pour générer un token de démo.");
    }
    const payload = {
      userId: body.userId,
      coupleId: body.coupleId,
      email: body.email,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: "12h" });
    return { access_token, ...payload };
  }
}
