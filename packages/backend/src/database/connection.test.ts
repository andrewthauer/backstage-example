import { ConfigReader } from '@backstage/config';
import { createDatabase } from './connection';

describe('database connection', () => {
  const createConfig = (data: any = {}) =>
    ConfigReader.fromConfigs([{ context: '', data: { backend: data } }]);

  describe(createDatabase, () => {
    it('returns a knex instance', () => {
      // TODO: Find way to test if this is a postgres client
      expect(
        createDatabase(
          createConfig({
            POSTGRES_HOST: 'somehost',
            POSTGRES_USER: 'postgres',
            POSTGRES_PORT: '5432',
          }),
        ),
      ).toBeTruthy();
    });

    it('returns an sqlite config by default', () => {
      // TODO: Find way to test if this is a sqlite client
      expect(createDatabase(createConfig())).toBeTruthy();
    });
  });

  describe(createDatabase, () => {
    it('returns a knex instance', () => {
      // TODO: Find way to test if this is a postgres client
      expect(
        createDatabase(
          createConfig({
            POSTGRES_HOST: 'somehost',
            POSTGRES_USER: 'postgres',
            POSTGRES_PORT: '5432',
          }),
        ),
      ).toBeTruthy();
    });

    it('returns an sqlite config by default', () => {
      // TODO: Find way to test if this is a sqlite client
      expect(createDatabase(createConfig())).toBeTruthy();
    });
  });
});
