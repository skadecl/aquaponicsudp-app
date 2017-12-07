import { Component, Input, OnInit } from '@angular/core';
import { Sensor } from '../../../models/sensor.model';
import { SensorService } from '../sensor.service';

@Component({
  selector: 'app-detail-sensor-history',
  templateUrl: './detail-sensor-history.component.html',
  styleUrls: ['./detail-sensor-history.component.scss']
})
export class DetailSensorHistoryComponent implements OnInit {

  // options
  @Input() sensor: Sensor;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'Medición';
  history = [];
  page = 1;
  loading = true;
  subLoading = false;

  constructor(private sensorService: SensorService) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.sensorService.getHistory(this.sensor.id, this.page)
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
          this.history = [{name: this.sensor.name, series: data}];
          this.history = [...this.history];
          this.loading = false;
          this.subLoading = false;
        }
      );
  }

  getHistory() {
    this.subLoading = true;
    this.getData();
  }

  getNext() {
    this.page++;
    this.getHistory();
  }

  getPrev() {
    this.page--;
    this.getHistory();
  }

}
