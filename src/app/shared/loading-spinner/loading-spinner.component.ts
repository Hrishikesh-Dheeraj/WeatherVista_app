import { Component } from '@angular/core';
import { WeatherService } from '../../Services/weather.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  constructor(public weatherService: WeatherService) {}
}
