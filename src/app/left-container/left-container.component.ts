import { Component } from '@angular/core';
import {
  faMagnifyingGlass,
  faLocation,
  faCloudSun,
  faCloudRain,
} from '@fortawesome/free-solid-svg-icons';

import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css',
})
export class LeftContainerComponent {
  // Variables for Font Awesome Icons
  faMagnifyingGlass: any = faMagnifyingGlass;
  faLocation: any = faLocation;
  faCloudSun: any = faCloudSun;
  faCloudRain: any = faCloudRain;

  constructor(public weatherService: WeatherService) {}

  onSearch(location: string) {
    this.weatherService.cityName = location;
    this.weatherService.getData();
  }
}
