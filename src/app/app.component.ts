import { Component } from '@angular/core';
import { FetcherService } from './shared/fetcher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private fetcherService: FetcherService){}
}
