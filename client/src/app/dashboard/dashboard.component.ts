import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InfoService } from '../services/info.service';

import { User } from '../user';
import { Message } from '../message';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user = new User;
  token;
  apiInfo = new Message;

  constructor(private jwt: JwtHelperService, private info: InfoService) {
    this.token = jwt.decodeToken(localStorage.getItem('token'));
    this.user.email = this.token.email;
    info.getInfo().subscribe((message => {
      this.apiInfo.message = message.message;
    }));
   }

  ngOnInit() {

  }

}
