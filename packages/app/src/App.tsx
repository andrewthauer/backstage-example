import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core';
import React, { FC } from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage {...props} providers={['guest', 'custom', ...providers]} />
      );
    },
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const AppRoutes = app.getRoutes();

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>
        <AppRoutes />
      </Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
