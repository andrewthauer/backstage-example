import path from 'path';
import Knex from 'knex';

export function resolveMigrationsDir(pkgName: string) {
  return path.resolve(
    require.resolve(`${pkgName}/package.json`),
    '../migrations',
  );
}

export async function runDatabaseMigrations(
  database: Knex,
  migrationsDir: string,
) {
  const result = await database.migrate.latest({
    directory: migrationsDir,
  });

  await database.destroy();

  return result;
}
