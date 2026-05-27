import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.env.ADMIN_EMAIL ?? 'admin@bolao.com';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';

  try {
    await usersService.create('Admin', email, password, 'admin');
    console.log(`Admin created: ${email}`);
  } catch (e) {
    if (e.message?.includes('já cadastrado')) {
      console.log('Admin already exists');
    } else {
      throw e;
    }
  }

  await app.close();
}

seed().catch(console.error);
