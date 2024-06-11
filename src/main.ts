import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', true);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors();
    app.use(helmet());
    
    console.log(`Listening on port ${process.env.SERVER_PORT || 3000}`);

    await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
