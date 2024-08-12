import { Component } from '@angular/core';
import {
  faThumbsUp,
  faThumbsDown,
  faFaceSmile,
  faFaceFrown,
} from '@fortawesome/free-solid-svg-icons';

import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css',
})
export class RightContainerComponent {
  // Variables for Font Awesome Icons
  faThumbsUp: any = faThumbsUp;
  faThumbsDown: any = faThumbsDown;
  faFaceSmile: any = faFaceSmile;
  faFaceFrown: any = faFaceFrown;

  constructor(public weatherService: WeatherService) {}

  // Functions to control tab values/states
  onTodayClick() {
    this.weatherService.today = true;
    this.weatherService.week = false;
  }

  onWeekClick() {
    this.weatherService.today = false;
    this.weatherService.week = true;
  }

  // Functions to control metric values
  onCelsiusClick() {
    this.weatherService.celsius = true;
    this.weatherService.fahrenheit = false;
  }

  onFahrenheitClick() {
    this.weatherService.celsius = false;
    this.weatherService.fahrenheit = true;
  }
}
