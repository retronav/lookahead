import './components/app-navbar';
import { Router } from '@vaadin/router';
import { setDarkTheme } from './services/theme';

setDarkTheme();

const appRoot = document.querySelector('app-root') as HTMLElement;
export const router = new Router(appRoot);

router.setRoutes([
  {
    path: '/',
    action: async () => (await import('./views/app-home')) as any,
    component: 'app-home',
  },
  {
    path: '/signin',
    action: async () => (await import('./views/app-signin')) as any,
    component: 'app-signin',
  },
  {
    path: '/app',
    action: async () => (await import('./views/app-dash')) as any,
    component: 'app-dash',
  },
  // Not Found Fallback
  {
    path: '/(.*)',
    action: async () => (await import('./views/app-404')) as any,
    component: 'app-404',
  },
]);
