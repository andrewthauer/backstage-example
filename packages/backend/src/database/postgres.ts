import knex, { PgConnectionConfig } from 'knex';
import { Config } from '@backstage/config';

export function hasPostgresConnection(config: Config): boolean {
  return (
    ['POSTGRES_USER', 'POSTGRES_HOST', 'POSTGRES_PASSWORD'].every(key =>
      config.getOptional(`backend.${key}`),
    ) || !!config.getOptional(`backend.POSTGRES_URL`)
  );
}

export function getPgConnectionConfig(
  config: Config,
  dbName?: string,
): knex.PgConnectionConfig {
  const databaseUrl = config.getOptionalString('backend.POSTGRES_URL');

  if (databaseUrl) {
    const pgConfig = parsePgDatabaseUrl(databaseUrl);
    const { database, ...dbConfig } = pgConfig;

    return {
      ...dbConfig,
      ...(dbName !== undefined ? { database: dbName } : { database: database }),
    };
  }

  return {
    host: config.getString('backend.POSTGRES_HOST'),
    user: config.getString('backend.POSTGRES_USER'),
    password: config.getString('backend.POSTGRES_PASSWORD'),
    port: config.getOptionalNumber('backend.POSTGRES_PORT') || 5432,
    database: dbName,
  };
}

export function parsePgDatabaseUrl(databaseUrl: string): PgConnectionConfig {
  const dbUrl = new URL(databaseUrl);

  const scheme = dbUrl.protocol?.substr(0, dbUrl.protocol?.length - 1);
  if (scheme !== 'postgresql') {
    throw new Error(`Invalid database protocol: ${scheme}`);
  }

  return {
    host: dbUrl.hostname,
    port: Number(dbUrl.port || 5432),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
  };
}
