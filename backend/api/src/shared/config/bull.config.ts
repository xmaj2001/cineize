import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions } from '@nestjs/bullmq';

export const bullBaseConfig = (): BullRootModuleOptions => ({
  connection: {
    host: 'redis',
    port: 6379,
  },
});

export const bullRedisConfig = (
  config: ConfigService,
): BullRootModuleOptions => ({
  connection: {
    host: config.get<string>('redis.host'),
    port: config.get<number>('redis.port'),
    password: config.get<string>('redis.password'),
  },
});
