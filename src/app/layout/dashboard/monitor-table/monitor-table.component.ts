import { Component, OnDestroy, OnInit } from '@angular/core';
import { FetcherService } from '../../../shared/fetcher.service';
import { Subscription } from 'rxjs/Subscription';
import { Sensor } from '../../../models/sensor.model';

@Component({
  selector: 'app-monitor-table',
  templateUrl: './monitor-table.component.html',
  styleUrls: ['./monitor-table.component.scss']
})
export class MonitorTableComponent implements OnInit, OnDestroy {
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
