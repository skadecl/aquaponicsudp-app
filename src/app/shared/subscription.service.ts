import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './globals';
import { Alarm } from '../models/alarm.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SubscriptionService {
  subscriptions: Alarm[] = [];
  subscriptionsChanged: Subject<void> = new Subject<void>();

  constructor(private globals: Globals, private http: HttpClient) {
    this.fetchSubscriptions();
  }

  setSubscriptions(subscriptions: Alarm[]) {
    this.subscriptions = subscriptions;
    this.subscriptionsChanged.next();
  }

  isSubscribed(id: number) {
    const pos = this.subscriptions.findIndex((alarm) => alarm.id === id);
    return pos >= 0;
  }

  addSubscription(alarm: Alarm) {
    this.subscriptions.push(alarm);
    this.subscriptionsChanged.next();
  }

  removeSubscription(id: number) {
    const pos = this.subscriptions.findIndex((alarm) => alarm.id === id);
    if (pos >= 0) {
      this.subscriptions.splice(pos, 1);
      this.subscriptionsChanged.next();
    }
  }

  subscribeAlarm(id: number) {
    return this.http.post(this.globals.api + '/subscriptions', {alarm: id});
  }

  unsubscribeAlarm(id: number) {
    return this.http.delete(this.globals.api + '/subscriptions/' + id);
  }

  fetchSubscriptions() {
    this.http.get(this.globals.api + '/subscriptions')
      .subscribe(
        (subscriptions: Alarm[]) => this.setSubscriptions(subscriptions),
        (err) => console.log(err)
      );
  }
}
