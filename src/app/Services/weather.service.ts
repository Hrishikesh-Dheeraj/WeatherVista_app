import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodaysHighlight } from '../Models/TodaysHighlight';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  public isLoading = new BehaviorSubject<boolean>(false);

  // Variables which will be filled by API Endpoints
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  // Variables that have the extracted data from the API Endpoint Variables
  temperatureData: TemperatureData;
  todayData: TodayData[] = [];
  weekData: WeekData[] = [];
  todaysHighlight: TodaysHighlight;

  // Variables to be used for API calls
  cityName: string = 'Pune';
  language: string = 'en-US';
  date: string = '20200622';
  units: string = 'm';

  // Variable holding current time
  currentTime: Date;

  // Variables to control tabs
  today: boolean = false;
  week: boolean = true;

  // Variables to control metric value
  celsius: boolean = true;
  fahrenheit: boolean = false;

  constructor(private httpClient: HttpClient) {
    this.getData();
  }

  getSummaryImage(summary: string): string {
    // Base folder address containing the images
    var baseAddress = 'assets/';

    // Respective images names
    var cloudySunny = 'cloudyandsunny.png';
    var rainSunny = 'rainyandsunny.png';
    var windy = 'windy.png';
    var sunny = 'sun.png';
    var rainy = 'rainy.png';

    if (
      String(summary).includes('Partly Cloudy') ||
      String(summary).includes('P Cloudy')
    )
      return baseAddress + cloudySunny;
    else if (
      String(summary).includes('Partly Rainy') ||
      String(summary).includes('P Rainy')
    )
      return baseAddress + rainSunny;
    else if (String(summary).includes('wind')) return baseAddress + windy;
    else if (String(summary).includes('Haze')) return baseAddress + windy;
    else if (String(summary).includes('Rain')) return baseAddress + rainy;
    else if (String(summary).includes('Showers')) return baseAddress + rainy;
    else if (String(summary).includes('Storms')) return baseAddress + rainy;
    else if (String(summary).includes('Sunny')) return baseAddress + sunny;
    else if (String(summary).includes('Clear')) return baseAddress + sunny;

    return baseAddress + cloudySunny;
  }

  // Method to create a chunk for left container using TemperatureData Model
  fillTemperatureDataModel() {
    this.currentTime = new Date();

    this.temperatureData.day =
      this.weatherDetails['v3-wx-observations-current'].dayOfWeek;

    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(
      2,
      '0'
    )}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;

    this.temperatureData.temperature =
      this.weatherDetails['v3-wx-observations-current'].temperature;

    this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;

    this.temperatureData.rainPercent =
      this.weatherDetails['v3-wx-observations-current'].precip24Hour;

    this.temperatureData.summaryPhrase =
      this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;

    this.temperatureData.summaryImage = this.getSummaryImage(
      this.temperatureData.summaryPhrase
    );
  }

  // Method to create a chunk for right container using WeekData Model
  fillWeekData() {
    var weekCount = 0;

    while (weekCount < 7) {
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherDetails[
        'v3-wx-forecast-daily-15day'
      ].dayOfWeek[weekCount].slice(0, 3);
      this.weekData[weekCount].tempMax =
        this.weatherDetails[
          'v3-wx-forecast-daily-15day'
        ].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin =
        this.weatherDetails[
          'v3-wx-forecast-daily-15day'
        ].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summaryImage = this.getSummaryImage(
        this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]
      );

      weekCount++;
    }
  }

  // Method to create a chunk for right container using TodayData Model
  fillTodayData() {
    var todayCount = 0;

    while (todayCount < 7) {
      this.todayData.push(new TodayData());

      this.todayData[todayCount].time = this.weatherDetails[
        'v3-wx-forecast-hourly-10day'
      ].validTimeLocal[todayCount].slice(11, 16);
      this.todayData[todayCount].temperature =
        this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[
          todayCount
        ];
      this.todayData[todayCount].summaryImage = this.getSummaryImage(
        this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[
          todayCount
        ]
      );

      todayCount++;
    }
  }

  // Method to create a chunk for right container using TodaysHighlight Model
  fillTodaysHighlight() {
    this.todaysHighlight.airQuality =
      this.weatherDetails[
        'v3-wx-globalAirQuality'
      ].globalairquality.airQualityIndex;
    this.todaysHighlight.humidity =
      this.weatherDetails['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlight.sunrise = this.weatherDetails[
      'v3-wx-observations-current'
    ].sunriseTimeLocal.slice(11, 16);
    this.todaysHighlight.sunset = this.weatherDetails[
      'v3-wx-observations-current'
    ].sunsetTimeLocal.slice(11, 16);
    this.todaysHighlight.uvIndex =
      this.weatherDetails['v3-wx-observations-current'].uvIndex;
    this.todaysHighlight.visibility =
      this.weatherDetails['v3-wx-observations-current'].visibility;
    this.todaysHighlight.windStatus =
      this.weatherDetails['v3-wx-observations-current'].windSpeed;
  }

  // Method to create useful data chunks for UI using the data received from the API
  prepareData(): void {
    // Setting Left Container Temperature Data Model Properties
    this.fillTemperatureDataModel();

    // Setting Right Container Week Data Model Properties
    this.fillWeekData();

    // Setting Right Container Today Data Model Properties
    this.fillTodayData();

    // Setting Right Container TodaysHighlight Data Model Properties
    this.fillTodaysHighlight();
  }

  // Method to convert Temperature Celsius to Fahrenheit
  celsiusToFahrenheit(celsius: number): number {
    return +(celsius * 1.8 + 32).toFixed(2);
  }

  // Method to convert Temperature Fahrenheit to Celsius
  fahrenheitToCelsius(fahrenheit: number): number {
    return +((fahrenheit - 32) / 0.556).toFixed(2);
  }

  // Method to get Location Details
  getLocationDetails(
    cityName: string,
    language: string
  ): Observable<LocationDetails> {
    return this.httpClient.get<LocationDetails>(
      EnvironmentalVariables.weatherAPILocationBaseUrl,
      {
        headers: new HttpHeaders()
          .set(
            EnvironmentalVariables.xRapidApiKeyName,
            EnvironmentalVariables.xRapidApiKeyValue
          )
          .set(
            EnvironmentalVariables.xRapidHostKeyName,
            EnvironmentalVariables.xRapidHostKeyValue
          ),
        params: new HttpParams()
          .set('query', cityName)
          .set('language', language),
      }
    );
  }

  // Method to get Weather Report
  getWeatherReport(
    date: string,
    latitude: number,
    longitude: number,
    language: string,
    units: string
  ): Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(
      EnvironmentalVariables.weatherAPIForecastBaseUrl,
      {
        headers: new HttpHeaders()
          .set(
            EnvironmentalVariables.xRapidApiKeyName,
            EnvironmentalVariables.xRapidApiKeyValue
          )
          .set(
            EnvironmentalVariables.xRapidHostKeyName,
            EnvironmentalVariables.xRapidHostKeyValue
          ),
        params: new HttpParams()
          .set('date', date)
          .set('latitude', latitude)
          .set('longitude', longitude)
          .set('language', language)
          .set('units', units),
      }
    );
  }

  getData() {
    // Start loading spinner
    this.isLoading.next(true);

    this.temperatureData = new TemperatureData();
    this.todayData = [];
    this.weekData = [];
    this.todaysHighlight = new TodaysHighlight();

    var latitude = 0;
    var longitude = 0;

    this.getLocationDetails(this.cityName, this.language).subscribe({
      next: (response) => {
        this.locationDetails = response;
        latitude = this.locationDetails?.location.latitude[0];
        longitude = this.locationDetails?.location.longitude[0];

        // Once we get the values for Latitude and Longitude we can call for the getWeatherReport method
        this.getWeatherReport(
          this.date,
          latitude,
          longitude,
          this.language,
          this.units
        ).subscribe({
          next: (response) => {
            this.weatherDetails = response;

            this.prepareData();

            // Stop loading spinner
            this.isLoading.next(false);
          },
          error: () => {
            // Stop loading spinner if there’s an error
            this.isLoading.next(false);
          },
        });
      },
      error: () => {
        // Stop loading spinner if there’s an error
        this.isLoading.next(false);
      },
    });
  }
}
