import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from './common/common.module';
import redisConfig from './config/redis';
import dbConfig from './config/database';
import appConfig from './config/app';
import { CmsModule } from './apps/cms/cms.module';
import { PublicModule } from './apps/public/public.module';

let envFilePath = '.env';
if (process.env.NODE_ENV && process.env.NODE_ENV == 'testing') {
    envFilePath = '.env.testing';
}

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => (Object.assign(configService.get('database'), {
                autoLoadEntities: true,
                namingStrategy: new SnakeNamingStrategy()
            }))
        }),
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({ config: configService.get('redis') }),
            inject: [ConfigService],
            imports: [ConfigModule]
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath,
            load: [redisConfig, dbConfig, appConfig]
        }),
        PassportModule,
        CommonModule,
        CmsModule,
        RouterModule.register([
            {
                path: 'cms',
                module: CmsModule
            }
        ]),
        PublicModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
