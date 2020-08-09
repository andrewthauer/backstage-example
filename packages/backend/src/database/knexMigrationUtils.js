/**
 * @param {import('knex')} knex
 * @param string dbName
 */
async function createPostgresDatabase(knex, dbName) {
  if (knex.client.config.client !== 'pg') {
    return knex;
  }

  const exists = await knex
    .raw(
      `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${dbName}'));`,
    )
    .then(result => result.rows[0].exists);

  if (!exists) {
    return knex.raw(`
      CREATE DATABASE ${dbName};
    `);
  }

  return knex;
}

/**
 * @param {import('knex')} knex
 * @param string dbName
 */
async function dropPostgresDatabase(knex, dbName) {
  return knex.raw(`
    DROP DATABASE IF EXISTS ${dbName};
  `);
}

module.exports = {
  createPostgresDatabase,
  dropPostgresDatabase,
};
