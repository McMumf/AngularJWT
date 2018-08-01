import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  url = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string) {
    return this.http.post<{token: string}>(this.url + '/register', {email: email, password: password})
      .pipe(
        map(result => {
          localStorage.setItem('token', result.token);
          this.router.navigate(['dashboard']);
        })
      );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{token: string}>(this.url + '/login', {
      email: email,
      password: password
    }).pipe(
        map(result => {
          localStorage.setItem('token', result.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  getInfo() {
    return this.http.get(this.url + '/info');
  }

  public get loggedIn(): boolean {
    if (localStorage.getItem('token') !== null) {
      return true;
    }
    return false;
  }

}