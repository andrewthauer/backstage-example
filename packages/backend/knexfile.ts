import path from 'path';
import { loadBackendConfig } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { getDatabaseConfig } from './src/database/connection';

module.exports = async () => {
  const configs = await loadBackendConfig();
  const config = ConfigReader.fromConfigs(configs);
  const dbConfig = getDatabaseConfig(config);

  return {
    ...dbConfig,
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
    },
  };
};
