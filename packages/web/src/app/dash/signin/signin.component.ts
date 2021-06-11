import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { isSignInWithEmailLink, signInWithEmailLink } from '@firebase/auth';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalizeAuthErrorPipe } from 'src/app/pipes/localize-auth-error.pipe';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  public emailSent = false;
  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(
    private auth: AuthService,
    private afAuth: Auth,
    private snackBar: MatSnackBar,
    private localizeAuthError: LocalizeAuthErrorPipe,
    // private logger: LogService,
    private router: Router
  ) {}

  public async signInWithGoogle() {
    try {
      await this.auth.signInWithGoogle();
      this.router.navigateByUrl('/app');
    } catch (error) {
      this.snackBar.open(
        $localize`:@@auth.errors.googleSignInFailed:Failed to sign in using Google: ${this.localizeAuthError.transform(
          error
        )}`,
        'OK'
      );
    }
  }

  public async sendEmailLink() {
    const email = this.emailFormControl.value;
    try {
      // this.logger.debug(`Sending sign in link to ${email}`);
      await this.auth.sendSignInLinkToEmail(email, window.location.href);
      // Store email in local storage so that when this page is accessed via
      // the sign in link, we can sign the user in accordingly.
      localStorage.setItem('signInEmail', email);
      this.emailSent = true;
    } catch (error) {
      this.snackBar.open(`Failed to send email link: ${error.message}`, 'OK');
    }
  }

  async ngOnInit(): Promise<void> {
    if (isSignInWithEmailLink(this.afAuth, window.location.href)) {
      let email = localStorage.getItem('signInEmail');
      if (!email) {
        email = prompt('Please re-enter your email address');
      }
      try {
        await signInWithEmailLink(
          this.afAuth,
          email as string,
          window.location.href
        );
        localStorage.removeItem('signInEmail');
        this.router.navigateByUrl('/app');
      } catch (error) {
        this.snackBar.open(
          `Failed to sign in with email link: ${error.message}`,
          'OK'
        );
      }
    }
  }
}
