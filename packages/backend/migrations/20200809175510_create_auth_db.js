const knexUtils = require('../src/database/knexMigrationUtils');

const DATABASE_NAME = 'backstage_plugin_auth';

/**
 * @param {import('knex')} knex
 */
exports.up = async function up(knex) {
  return knexUtils.createPostgresDatabase(knex, DATABASE_NAME);
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function down(knex) {
  return knexUtils.dropPostgresDatabase(knex, DATABASE_NAME);
};

/**
 * Database creation is not allowed in a transaction
 */
exports.config = { transaction: false };
