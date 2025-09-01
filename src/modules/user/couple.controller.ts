
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { randomBytes } from "crypto";

@ApiTags("couples")
@Controller("/couples")
export class CoupleController {
  @Get("/generate-id")
  @ApiOperation({ summary: "Générer un coupleId unique" })
  @ApiOkResponse({
    description: "Un coupleId unique généré.",
    schema: {
      type: "object",
      properties: {
        coupleId: { type: "string", example: "a1b2c3d4e5f6" }
      }
    }
  })
  generateCoupleId() {
    // Génère un id aléatoire de 12 caractères hexadécimaux
    const coupleId = randomBytes(6).toString("hex");
    return { coupleId };
  }
}
