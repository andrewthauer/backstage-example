import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  featureFlagsApiRef,
  FeatureFlags,
  GoogleAuth,
  GithubAuth,
  OAuth2,
  OktaAuth,
  GitlabAuth,
  oauthRequestApiRef,
  OAuthRequestManager,
  googleAuthApiRef,
  githubAuthApiRef,
  oauth2ApiRef,
  oktaAuthApiRef,
  gitlabAuthApiRef,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

import {
  lighthouseApiRef,
  LighthouseRestApi,
} from '@backstage/plugin-lighthouse';

import { techRadarApiRef, TechRadar } from '@backstage/plugin-tech-radar';

import { CircleCIApi, circleCIApiRef } from '@backstage/plugin-circleci';
import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { gitOpsApiRef, GitOpsRestApi } from '@backstage/plugin-gitops-profiles';
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';
import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';

import { rollbarApiRef, RollbarClient } from '@backstage/plugin-rollbar';
import {
  GithubActionsClient,
  githubActionsApiRef,
} from '@backstage/plugin-github-actions';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');

  const builder = ApiRegistry.builder();

  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(
    circleCIApiRef,
    new CircleCIApi(`${backendUrl}/proxy/circleci/api`),
  );

  builder.add(githubActionsApiRef, new GithubActionsClient());

  builder.add(featureFlagsApiRef, new FeatureFlags());

  builder.add(lighthouseApiRef, new LighthouseRestApi('http://localhost:3003'));

  const oauthRequestApi = builder.add(
    oauthRequestApiRef,
    new OAuthRequestManager(),
  );

  builder.add(
    googleAuthApiRef,
    GoogleAuth.create({
      apiOrigin: backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  const githubAuthApi = builder.add(
    githubAuthApiRef,
    GithubAuth.create({
      apiOrigin: backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    oktaAuthApiRef,
    OktaAuth.create({
      apiOrigin: backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    gitlabAuthApiRef,
    GitlabAuth.create({
      apiOrigin: backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    oauth2ApiRef,
    OAuth2.create({
      apiOrigin: backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    techRadarApiRef,
    new TechRadar({
      width: 1500,
      height: 800,
    }),
  );

  builder.add(
    catalogApiRef,
    new CatalogClient({
      apiOrigin: backendUrl,
      basePath: '/catalog',
    }),
  );

  builder.add(
    scaffolderApiRef,
    new ScaffolderApi({
      apiOrigin: backendUrl,
      basePath: '/scaffolder/v1',
    }),
  );

  builder.add(gitOpsApiRef, new GitOpsRestApi('http://localhost:3008'));

  builder.add(
    graphQlBrowseApiRef,
    GraphQLEndpoints.from([
      GraphQLEndpoints.create({
        id: 'gitlab',
        title: 'GitLab',
        url: 'https://gitlab.com/api/graphql',
      }),
      GraphQLEndpoints.github({
        id: 'github',
        title: 'GitHub',
        errorApi,
        githubAuthApi,
      }),
    ]),
  );

  builder.add(
    rollbarApiRef,
    new RollbarClient({
      apiOrigin: backendUrl,
      basePath: '/rollbar',
    }),
  );

  return builder.build();
};
