import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '@config';
import { join } from 'path';
import { DataSource } from 'typeorm';

export const dbConnection = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: true,
  migrationsRun: true,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  // cli: {
  //   entitiesDir: 'src/entities',
  //   migrationsDir: 'src/migration',
  //   subscribersDir: 'src/subscriber',
  // },
});
