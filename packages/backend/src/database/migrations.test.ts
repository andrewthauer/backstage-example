import Knex from 'knex';
import { runDatabaseMigrations, resolveMigrationsDir } from './migrations';

function createDb() {
  const knex = Knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  });
  knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });
  return knex;
}

describe('migrations', () => {
  describe(resolveMigrationsDir, () => {
    it('resolves the directory', () => {
      expect(resolveMigrationsDir('backend')).toEqual(
        expect.stringMatching(/\/backend\/migrations/),
      );
    });
  });

  describe(runDatabaseMigrations, () => {
    it('executes database migrations', async () => {
      const database = createDb();
      const migrationsDir = resolveMigrationsDir('backend');

      await expect(
        runDatabaseMigrations(database, migrationsDir),
      ).resolves.toBeInstanceOf(Array);
    });
  });
});
