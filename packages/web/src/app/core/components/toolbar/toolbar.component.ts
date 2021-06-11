import { Component, Input } from '@angular/core';
import { Auth } from '@angular/fire';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() title: string = '';
  @Input() afAuth: Auth;
  constructor(afAuth: Auth) {
    this.afAuth = afAuth;
  }
}
