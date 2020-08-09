import knex from 'knex';
import { Config } from '@backstage/config';
import { getPgConnectionConfig, hasPostgresConnection } from './postgres';

export function createDatabase(config: Config, dbName?: string) {
  const knexConfig = getDatabaseConfig(config, dbName);
  const database = knex(knexConfig);

  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });

  return database;
}

export function getDatabaseConfig(
  config: Config,
  dbName?: string,
): knex.Config {
  if (hasPostgresConnection(config)) {
    return {
      client: 'pg',
      connection: getPgConnectionConfig(config, dbName),
    };
  }

  return getSqliteConnectionConfig();
}

function getSqliteConnectionConfig() {
  return {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  };
}
