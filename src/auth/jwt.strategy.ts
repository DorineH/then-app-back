import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Le payload correspond au contenu du token, exemple : { userId: '...', coupleId: '...' }
    return {
      userId: payload.userId,
      coupleId: payload.coupleId,
      email: payload.email,
      // Ajoute ce dont tu as besoin
    };
  }
}
