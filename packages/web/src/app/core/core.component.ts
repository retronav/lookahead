import { Component } from '@angular/core';
import { Auth } from '@angular/fire';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent {
  constructor(public afAuth: Auth) {}
}
