import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire';
import { User } from '@firebase/auth';
import { authState } from 'rxfire/auth';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser!: User | null;
  currentUser$: Observable<User | null>;
  constructor(private afAuth: Auth) {
    this.currentUser$ = authState(this.afAuth).pipe(takeUntil(this.destroy$));
  }

  ngOnInit(): void {
    authState(this.afAuth)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
