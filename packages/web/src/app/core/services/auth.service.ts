import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire';
import { authState } from '@angular/fire/auth';
import {
  ActionCodeSettings,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
  User,
} from '@firebase/auth';
import { Observable } from 'rxjs';

/**
 * Service that interacts with Firebase Authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState: Observable<User | null>;
  user: User | null;

  constructor(private auth: Auth) {
    this.authState = authState(auth);
    this.user = auth.currentUser;

    this.authState.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  /**
   * Opens a popup for signing in via Google OAuth.
   */
  public async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  /**
   * Sends a sign in link to the user's email.
   * @param email The email to send the email.
   * @param url The URL to continue to after user clicks the link.
   */
  public async sendSignInLinkToEmail(email: string, url: string) {
    const actionCodeSettings: ActionCodeSettings = {
      url: url,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
      // this.logger.info(`[AuthService] Sent sign in email link`);
    } catch (error) {
      // this.logger.error(
      //   `[AuthService] Failed to send sign in email link : ${error.code}`
      // );
    }
  }
}
