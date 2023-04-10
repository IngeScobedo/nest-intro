import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketServerOptions } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: 3000,
    options?: WebSocketServerOptions & {
      namespace?: 'pdf2img';
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
      },
    });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whitelist = ['http://localhost:5174', '*'];
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(null, true);
      }
    },
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
