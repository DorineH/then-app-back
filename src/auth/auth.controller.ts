import { Body, Controller, ForbiddenException, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "./public.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Public()
  @Post("demo")
  @ApiOperation({ summary: "DEV ONLY - issue a demo JWT" })
  issueDemo(
    @Body() body: { userId?: string; coupleId?: string; email?: string },
  ) {
    if (process.env.NODE_ENV === "production") {
      throw new ForbiddenException("Demo token disabled in production");
    }
    const payload = {
      userId: body?.userId ?? "66a0000000000000000000bb",
      coupleId: body?.coupleId ?? "66a000000000000000000001",
      email: body?.email ?? "demo@then.app",
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: "12h" });
    return { access_token, ...payload };
  }
}
