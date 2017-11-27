import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from "../../auth/auth.service";
import { Alarm } from '../../models/alarm.model';
import { Subscription } from 'rxjs/Subscription';
import { FetcherService } from '../../shared/fetcher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  pushRightClass = 'push-right';
  activeAlarms: Alarm[] = [];
  subscription: Subscription;

  constructor(public router: Router, private auth: AuthService, private fetcherService: FetcherService) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });

    this.activeAlarms = this.fetcherService.getAlarms();
    this.subscription = this.fetcherService.alarmsFetched.subscribe(
      () => {
        this.activeAlarms = this.fetcherService.getAlarms();
      }
    );
  }

  ngOnInit() {}

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onSignOut() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
