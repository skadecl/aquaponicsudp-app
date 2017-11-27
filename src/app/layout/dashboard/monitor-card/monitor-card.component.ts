import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sensor } from '../../../models/sensor.model';
import { SensorService } from '../../sensors/sensor.service';
import { Subscription } from "rxjs/Subscription";
import { FetcherService } from '../../../shared/fetcher.service';

@Component({
  selector: 'app-monitor-card',
  templateUrl: './monitor-card.component.html',
  styleUrls: ['./monitor-card.component.scss']
})
export class MonitorCardComponent implements OnInit, OnDestroy {
  sensors: Sensor[];
  subscription: Subscription;

  constructor(private fetcherService: FetcherService) {
  }

  ngOnInit() {
    this.sensors = this.fetcherService.getSensors();
    this.subscription = this.fetcherService.sensorsFetched.subscribe(
      () => {
        this.sensors = this.fetcherService.getSensors();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
