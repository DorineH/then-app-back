import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FavoriteModule } from "./modules/favorites/favorites.module";
import { AuthModule } from "./auth/auth.module";
import { Favorite } from "./modules/favorites/entities/favorite.entity";
import { FavoriteCategory } from "./modules/favorites/entities/category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmotionEntity } from "./modules/emotions/entities/emotions.entity";
import { EmotionsModule } from "./modules/emotions/emotions.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        useUnifiedTopology: true,
        entities: [Favorite, FavoriteCategory, EmotionEntity],
        synchronize: true, // set to false in production
      }),
      inject: [ConfigService],
    }),
    // UserModule,
    FavoriteModule,
    EmotionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
