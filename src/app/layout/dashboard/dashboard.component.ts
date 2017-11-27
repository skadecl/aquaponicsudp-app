import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActuatorService } from '../actuators/actuator.service';
import { Actuator } from '../../models/actuator.model';
import { Subscription } from 'rxjs/Subscription';
import { FetcherService } from '../../shared/fetcher.service';
import { Alarm } from '../../models/alarm.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  actuators: Actuator[] = [];
  actuatorsSubscription: Subscription;

  alarms: Alarm[] = [];
  alarmsSubscription: Subscription;

  constructor(private fetcherService: FetcherService) {
    this.actuators = this.fetcherService.getActuators();
    this.actuatorsSubscription = this.fetcherService.actuatorsFetched.subscribe(
      () => {
        this.actuators = this.fetcherService.getActuators();
      }
    );

    this.alarms = this.fetcherService.getAlarms();
    this.alarmsSubscription = this.fetcherService.alarmsFetched.subscribe(
      () => {
        this.alarms = this.fetcherService.getAlarms();
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.actuatorsSubscription.unsubscribe();
    this.alarmsSubscription.unsubscribe();
  }

}
