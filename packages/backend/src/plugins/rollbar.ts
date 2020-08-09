import { createRouter } from '@backstage/plugin-rollbar-backend';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  return await createRouter({ logger });
}
