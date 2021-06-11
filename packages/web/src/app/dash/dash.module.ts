import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashRoutingModule } from './dash-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MaterialModule } from '../material.module';
import { SigninComponent } from './signin/signin.component';
import { DashComponent } from './dash/dash.component';
import { LocalizeAuthErrorPipe } from '../pipes/localize-auth-error.pipe';

@NgModule({
  declarations: [LandingComponent, SigninComponent, DashComponent],
  imports: [
    CommonModule,
    DashRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [LocalizeAuthErrorPipe],
})
export class DashModule {}
