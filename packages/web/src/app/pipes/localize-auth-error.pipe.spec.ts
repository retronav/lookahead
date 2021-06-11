import {
  AuthErrorMessages,
  LocalizeAuthErrorPipe,
} from './localize-auth-error.pipe';
import { AuthError } from '@firebase/auth';
import { FirebaseError } from '@firebase/util';

describe('LocalizeAuthErrorPipe', () => {
  it('create an instance', () => {
    const pipe = new LocalizeAuthErrorPipe();
    expect(pipe).toBeTruthy();
  });
  it('translates known error codes', () => {
    const pipe = new LocalizeAuthErrorPipe();
    const errorCode = 'auth/cancelled-popup-request';
    // @ts-ignore: This is just an error to test the pipe so appName does not exist.
    const testError: AuthError = new FirebaseError(errorCode, '');
    const result = pipe.transform(testError);
    expect(result).toEqual(AuthErrorMessages[errorCode]);
  });
  it('returns error.message on unknown error codes', () => {
    const pipe = new LocalizeAuthErrorPipe();
    const errorCode = 'auth/some-nonexistent-error-that-i-dont-care-about';
    const message = "This is some nonexistent error that I don't care about.";
    // @ts-ignore: This is just an error to test the pipe so appName does not exist.
    const testError: AuthError = new FirebaseError(errorCode, message);
    const result = pipe.transform(testError);
    expect(result).toEqual(message);
  });
});
