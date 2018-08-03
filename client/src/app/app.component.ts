import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import {MediaMatcher} from '@angular/cdk/layout';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  now;
  token;

  private _mobileQueryListener: () => void;

  constructor(private auth: AuthService, private router: Router,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private jwt: JwtHelperService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.token = this.jwt.decodeToken(localStorage.getItem('token'));
      this.now = new Date().getTime() / 1000;
      console.log('EXP ' + this.token.exp);
      console.log('NOW ' + this.now);
      if (this.now > this.token.exp) {
        this.auth.logout();
      }
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.auth.logout();
  }

}
