import { ConfigReader } from '@backstage/config';
import {
  getPgConnectionConfig,
  hasPostgresConnection,
  parsePgDatabaseUrl,
} from './postgres';

describe('database connection', () => {
  const createConfig = (data: any = {}) =>
    ConfigReader.fromConfigs([{ context: '', data: { backend: data } }]);

  describe(hasPostgresConnection, () => {
    it('returns false when no postgres variables are present', () => {
      expect(hasPostgresConnection(createConfig())).toBeFalsy();
    });

    it('returns true when all postgres variables are present', () => {
      expect(
        hasPostgresConnection(
          createConfig({
            POSTGRES_HOST: 'somehost',
            POSTGRES_USER: 'postgres',
            POSTGRES_PASSWORD: 'pass',
          }),
        ),
      ).toBeTruthy();
    });

    it('returns false when not all postgres variables are present', () => {
      expect(
        hasPostgresConnection(
          createConfig({
            POSTGRES_HOST: 'somehost',
          }),
        ),
      ).toBeFalsy();
    });

    it('returns true when postgres database url is present', () => {
      expect(
        hasPostgresConnection(
          createConfig({
            POSTGRES_URL: 'postgresql://postgres@localhost:5432/dbname',
          }),
        ),
      ).toBeTruthy();
    });
  });

  describe(getPgConnectionConfig, () => {
    it('returns a knex connectin config for postgres variables', () => {
      expect(
        getPgConnectionConfig(
          createConfig({
            POSTGRES_HOST: 'somehost',
            POSTGRES_USER: 'postgres',
            POSTGRES_PASSWORD: 'pass',
          }),
        ),
      ).toEqual({
        host: 'somehost',
        user: 'postgres',
        password: 'pass',
        port: 5432,
        database: undefined,
      });
    });

    it('returns a knex connection config for postgres database url', () => {
      expect(
        getPgConnectionConfig(
          createConfig({
            POSTGRES_URL: 'postgresql://postgres:pass@localhost:5432/dbname',
          }),
        ),
      ).toEqual({
        host: 'localhost',
        user: 'postgres',
        password: 'pass',
        port: 5432,
        database: 'dbname',
      });
    });
  });

  describe(parsePgDatabaseUrl, () => {
    it('parses a connection string uri ', () => {
      expect(
        parsePgDatabaseUrl('postgresql://postgres:pass@foobar:5432/dbname'),
      ).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: 5432,
        database: 'dbname',
      });
    });

    it('does not require password', () => {
      expect(
        parsePgDatabaseUrl('postgresql://postgres@localhost:5432/dbname'),
      ).toEqual({
        host: 'localhost',
        user: 'postgres',
        password: '',
        port: 5432,
        database: 'dbname',
      });
    });

    it('accepts empty password', () => {
      expect(
        parsePgDatabaseUrl('postgresql://postgres:@localhost:5432/dbname'),
      ).toEqual({
        host: 'localhost',
        user: 'postgres',
        password: '',
        port: 5432,
        database: 'dbname',
      });
    });

    it('defaults port number', () => {
      expect(
        parsePgDatabaseUrl('postgresql://postgres:pass@foobar/dbname'),
      ).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: 5432,
        database: 'dbname',
      });
    });

    it('does not require a database', () => {
      expect(parsePgDatabaseUrl('postgresql://postgres:pass@foobar')).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: 5432,
        database: '',
      });
    });

    it('ignores extra query parameters', () => {
      expect(
        parsePgDatabaseUrl(
          'postgresql://postgres:pass@foobar:5432/dbname?sslmode=require',
        ),
      ).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: 5432,
        database: 'dbname',
      });
    });

    it('fails for invalid connection uri', () => {
      expect(() => parsePgDatabaseUrl('foo')).toThrow('Invalid URL: foo');
    });

    it('fails for invalid protocol', () => {
      expect(() =>
        parsePgDatabaseUrl('foo://postgres:@localhost:5432/dbname'),
      ).toThrow('Invalid database protocol: foo');
    });
  });
});
