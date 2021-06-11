import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

// MatModules contains all modules imported from @angular/material
const MatModules = [
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatMenuModule,
];

/**
 * Material Module imports packages from `@angular/material` library
 * which can be then imported as one module in AppModule.
 */
@NgModule({
  declarations: [],
  imports: [CommonModule, ...MatModules],
  exports: [...MatModules],
})
export class MaterialModule {}
