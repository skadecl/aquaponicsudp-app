import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Globals } from "../shared/globals";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {

  user: object; // TODO: Use User model

  constructor(private http: HttpClient, private globals: Globals) {
    if (this.isLoggedIn()) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  signIn(loginData: {email: string, password: string}): Observable<boolean> {
    return this.http.post(this.globals.api + '/sign_in', loginData)
      .map(
        (data: {user: object, token: string}) => {
          const token = data.token;
          const user = data.user;

          if (user && token) {
            this.setSession(user, token);
            return true;
          } else {
            return false;
          }
        }
      );
  }

  private setSession(user, token) {
    const exp = JSON.parse(atob(token.split('.')[1])).exp;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('exp', exp);
    this.user = user;
  }

  signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
  }

  isLoggedIn() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const exp = Number(localStorage.getItem('exp'));

    if (user && token && exp) {
      const now = Number(Date.now() / 1000);

      if (now > exp) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  getUser() {
    return this.user;
  }

}
