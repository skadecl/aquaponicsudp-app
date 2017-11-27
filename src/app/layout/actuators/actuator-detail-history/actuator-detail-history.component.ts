import { Component, Input, OnInit } from '@angular/core';
import { ActuatorService } from '../actuator.service';
import { Action } from '../../../models/action.model';

@Component({
  selector: 'app-actuator-detail-history',
  templateUrl: './actuator-detail-history.component.html',
  styleUrls: ['./actuator-detail-history.component.scss']
})
export class ActuatorDetailHistoryComponent implements OnInit {
  @Input() id: number;
  actions: Action[];
  loading = true;
  subLoading = true;
  page = 1;
  limit = 10;

  constructor(private actuatorService: ActuatorService) { }

  ngOnInit() {
    this.getHistory(this.page);
  }

  getHistory(page: number) {
    this.subLoading = true;
    this.actuatorService.getHistory(this.id, page)
      .subscribe(
        (actions: Action[]) => {
          this.actions = actions;
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
