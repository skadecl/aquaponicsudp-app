import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../shared/subscription.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    public router: Router,
    public subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard/card']);
    }
  }

}
