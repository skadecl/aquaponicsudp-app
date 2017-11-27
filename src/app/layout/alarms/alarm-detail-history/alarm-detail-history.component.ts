import { Component, Input, OnInit } from '@angular/core';
import { AlarmService } from '../alarm.service';

@Component({
  selector: 'app-alarm-detail-history',
  templateUrl: './alarm-detail-history.component.html',
  styleUrls: ['./alarm-detail-history.component.scss']
})
export class AlarmDetailHistoryComponent implements OnInit {
  @Input() id: number;
  @Input() unit: string;
  triggers: any[];
  loading = true;
  subLoading = true;
  page = 1;
  limit = 10;

  constructor(private alarmService: AlarmService) { }

  ngOnInit() {
    this.getHistory(this.page);
  }

  getHistory(page: number) {
    this.subLoading = true;
    this.alarmService.getHistory(this.id, page)
      .subscribe(
        (triggers: any[]) => {
          this.triggers = triggers;
          this.loading = false;
          this.subLoading = false;
        },
        (err) => console.log(err)
      );
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
