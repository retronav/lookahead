import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { initializeApp } from '@firebase/app';
import { getAuth, useAuthEmulator } from '@firebase/auth';
import { provideAuth, provideFirebaseApp } from '@angular/fire';
import { CoreModule } from './core/core.module';

const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth();

if (!environment.production) {
  // Initialize Firebase emulators if the app is running in development mode.
  useAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    MaterialModule,
    provideFirebaseApp(() => firebaseApp),
    provideAuth(() => auth),
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
