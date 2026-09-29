import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_PORT, CLIENT_ORIGINS } from './config/runtime.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: CLIENT_ORIGINS });
  await app.listen(API_PORT);
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
