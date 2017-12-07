import { Component, OnInit } from '@angular/core';
import { SensorService } from '../sensors/sensor.service';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { Sensor } from '../../models/sensor.model';
import { FetcherService } from '../../shared/fetcher.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  sensors: Sensor[];
  subscription: Subscription;
  loading = true;
  statsData = [];
  subLoading = false;
  page = 1;
  limit = 24;
  tab = 'correlations';


  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'Medición';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;

  constructor(private sensorService: SensorService, private fetcherService: FetcherService) {

  }

  setTab(tab: string) {
    this.tab = tab;
  }

  onSelect(sensorName) {
    const pos = this.statsData.findIndex(sn => sn.name = sensorName);
    if (pos >= 0) {
      this.statsData[pos] = [];
      this.statsData = [...this.statsData];
    } else {
      const sensor = this.sensors.find(sens => sens.name = sensorName);
      this.getData(sensor);
    }
  }

  ngOnInit() {
    this.sensors = this.fetcherService.getSensors();
    if (!this.sensors.length) {
      this.subscription = this.fetcherService.sensorsFetched.subscribe(
        () => {
          this.sensors = this.fetcherService.getSensors();
          this.subscription.unsubscribe();
          this.fetchStats();
        }
      );
    } else {
      this.fetchStats();
    }
  }

  fetchStats() {
    this.statsData = [];
    this.sensors.forEach(sensor => {
      this.getData(sensor);
    });
  }

  getData(sensor: Sensor) {
    this.sensorService.getHistory(sensor.id, this.page)
      .map(
        (data: any[]) => {
          data.map(
            (item) => {
              item.name = new Date(item.createdAt);
              return item;
            }
          );
          return data;
        }
      )
      .subscribe(
        (data) => {
          this.statsData.push({name: sensor.name, series: data});
          this.statsData = [...this.statsData];
          this.loading = false;
          this.subLoading = false;
        }
      );
  }

  getHistory(page: number) {
    this.subLoading = true;
    this.fetchStats();
  }

  getNext() {
    this.page++;
    this.getHistory(this.page);
  }

  getPrev() {
    this.page--;
    this.getHistory(this.page);
  }

}
