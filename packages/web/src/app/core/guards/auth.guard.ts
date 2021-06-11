import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire';
import { authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { User } from '@firebase/auth';
import { Observable, of, pipe, UnaryFunction } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export type AuthPipeGenerator = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => AuthPipe;
export type AuthPipe = UnaryFunction<
  Observable<User | null>,
  Observable<boolean | string | any[]>
>;

export const loggedIn: AuthPipe = map((user) => !!user);

/**
 * Auth guard based on AngularFire v6 AngularFireAuthGuard.
 * Check out the v6 implementation here: https://git.io/JZOcy
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authPipeFactory =
      (route.data.authGuardPipe as AuthPipeGenerator) || (() => loggedIn);
    return authState(this.auth).pipe(
      take(1),
      authPipeFactory(route, state),
      map((can) => {
        if (typeof can === 'boolean') {
          return can;
        } else if (Array.isArray(can)) {
          return this.router.createUrlTree(can);
        } else {
          // TODO(obnoxiousnerd): Add tests
          return this.router.parseUrl(can);
        }
      })
    );
  }
}

export const canActivate = (pipe: AuthPipeGenerator) => ({
  canActivate: [AuthGuard],
  data: { authGuardPipe: pipe },
});

export const isNotAnonymous: AuthPipe = map(
  (user) => !!user && !user.isAnonymous
);
export const idTokenResult = switchMap((user: User | null) =>
  user ? user.getIdTokenResult() : of(null)
);
export const emailVerified: AuthPipe = map(
  (user) => !!user && user.emailVerified
);
export const customClaims = pipe(
  idTokenResult,
  map((idTokenResult) => (idTokenResult ? idTokenResult.claims : []))
);
export const hasCustomClaim: (claim: string) => AuthPipe = (claim) =>
  pipe(
    customClaims,
    map((claims) => claims.hasOwnProperty(claim))
  );
export const redirectUnauthorizedTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    loggedIn,
    map((loggedIn) => loggedIn || redirect)
  );
export const redirectLoggedInTo: (redirect: string | any[]) => AuthPipe = (
  redirect
) =>
  pipe(
    loggedIn,
    map((loggedIn) => (loggedIn && redirect) || true)
  );
