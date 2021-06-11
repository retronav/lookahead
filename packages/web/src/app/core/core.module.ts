import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MaterialModule } from '../material.module';
import { CoreComponent } from './core.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AppRoutingModule } from '../app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { LocalizeAuthErrorPipe } from '../pipes/localize-auth-error.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, CoreComponent, ToolbarComponent, LocalizeAuthErrorPipe],
  imports: [CommonModule, MaterialModule, AppRoutingModule],
  exports: [CoreComponent, PageNotFoundComponent, ToolbarComponent],
  providers: [AuthGuard],
})
export class CoreModule {}
