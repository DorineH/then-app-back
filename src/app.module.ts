import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
// import { MongooseModule } from "@nestjs/mongoose";
// import { UserModule } from "./modules/user/user.module";
import { FavoriteModule } from "./modules/favorites/favorites.module";
import { AuthModule } from "./auth/auth.module";
import { Favorite } from './modules/favorites/entities/favorite.entity';
import { FavoriteCategory } from './modules/favorites/entities/category.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "./modules/tasks/task.module";
import { TaskEntity } from "./modules/tasks/entities/task.entity";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mongodb",
        url: configService.get<string>("MONGODB_URI"),
        useUnifiedTopology: true,
        entities: [Favorite, FavoriteCategory, TaskEntity],
        synchronize: true, // set to false in production
      }),
      inject: [ConfigService],
    }),
    // UserModule,
    FavoriteModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
