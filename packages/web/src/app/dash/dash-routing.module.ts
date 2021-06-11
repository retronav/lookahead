import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '../core/guards/auth.guard';
import { DashComponent } from './dash/dash.component';

import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['signin']);
const redirectLoggedInToApp = () => redirectLoggedInTo(['app']);

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToApp },
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToApp },
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToSignIn },
    component: DashComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {}
