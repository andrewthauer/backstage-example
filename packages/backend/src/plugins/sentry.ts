import { createRouter } from '@backstage/plugin-sentry-backend';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  return await createRouter(logger);
}
