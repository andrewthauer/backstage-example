import { githubAuthApiRef } from '@backstage/core';

export const providers = [
  {
    id: 'github-auth-provider',
    title: 'Github',
    message: 'Sign In using Github',
    apiRef: githubAuthApiRef,
  },
];
