import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const db_url = process.env.DATABASE_URL;
    if (!db_url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const adapter = new PrismaPg({
      connectionString: db_url,
    });

    super({ adapter });
  }
}
