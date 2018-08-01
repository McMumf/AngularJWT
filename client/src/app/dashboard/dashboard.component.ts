import { Component, OnInit } from '@angular/core';
import { user } from '../user';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user = new user;
  info;
  token;

  constructor(private jwt: JwtHelperService, private auth: AuthService) {
    this.token = jwt.decodeToken(localStorage.getItem('token'));
    this.user.email = this.token.email;
   }

  ngOnInit() {
    this.info = this.auth.getInfo();
    console.log('INFO ' + JSON.stringify(this.info));
  }

}
