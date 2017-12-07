import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from "../auth/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

  @ViewChild('f') loginForm: NgForm;
  loading = false;
  loginError = false;

  constructor(public router: Router, private authService: AuthService) {
  }

  ngOnInit() {
  }

  onSignIn() {
    this.loading = true;
    this.loginError = false;
    this.authService.signIn(this.loginForm.value)
      .subscribe(
        (valid) => {
          this.loading = false;

          if (valid) {
            this.router.navigate(['/dashboard/card']);
          } else {
            this.loginError = true;
          }
        },
        () => {
          this.loading = false;
          this.loginError = true;
        }
      );
  }

  onGuestSignIn() {
    this.loading = true;
    this.loginError = false;
    this.authService.signIn({email: 'guest', password: '1234'})
      .subscribe(
        (valid) => {
          this.loading = false;

          if (valid) {
            this.router.navigate(['/dashboard/card']);
          } else {
            this.loginError = true;
          }
        },
        () => {
          this.loading = false;
          this.loginError = true;
        }
      );
  }

}
