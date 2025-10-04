import { NestFactory } from '@nestjs/core';
import { appCreate } from './app.create';
import { AppModule } from './app.module';
import appConfig from './shared/config/index.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appCreate(app);
  await app.listen(appConfig().port, async () =>
    console.log(`Application is running on port: ${await app.getUrl()}`),
  );
}
bootstrap();
