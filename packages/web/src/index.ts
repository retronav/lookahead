import './components/app-navbar';
import './components/app-snackbar';
import { Router } from '@vaadin/router';
import type { AppHome } from './views/app-home';
import type { AppSignIn } from './views/app-signin';
import type { AppDash } from './views/app-dash';
import type { App404 } from './views/app-404';

// Import meta declarations
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      PROD: boolean;
      [x: string]: any;
    };
  }
}

const appRoot = document.querySelector('app-root') as HTMLElement;
export const router = new Router(appRoot);

router.setRoutes([
  {
    path: '/',
    action: async () =>
      ((await import('./views/app-home')) as unknown) as AppHome,
    component: 'app-home',
  },
  {
    path: '/signin',
    action: async () =>
      ((await import('./views/app-signin')) as unknown) as AppSignIn,
    component: 'app-signin',
  },
  {
    path: '/app',
    action: async () =>
      ((await import('./views/app-dash')) as unknown) as AppDash,
    component: 'app-dash',
  },
  // Not Found Fallback
  {
    path: '/(.*)',
    action: async () =>
      ((await import('./views/app-404')) as unknown) as App404,
    component: 'app-404',
  },
]);
