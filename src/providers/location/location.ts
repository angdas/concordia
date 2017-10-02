import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { AxServiceProvider } from '../ax-service/ax-service';
import { Storage } from '@ionic/storage';

@Injectable()
export class LocationProvider {

  public lat: number = 0;
  public lng: number = 0;

  constructor(public http: Http, public backgroundGeolocation: BackgroundGeolocation, public zone: NgZone,
  public axService: AxServiceProvider, public storage: Storage) {
    console.log('Hello LocationProvider Provider');

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => { 
      console.log(location);
      this.lat = location.latitude;
      this.lng = location.longitude;
      this.storage.get('trackerauthenticated').then(data => {
        if(data == true){
          this.storage.get('trackeruser').then(data => {
            this.axService.updateLoc(data,this.lat,this.lng).subscribe();
          });
        }                  
      });
      /*     
      this.zone.run(() => {
        console.log('Zone' + location);
      });*/
      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      this.backgroundGeolocation.finish().then((val) => {
        console.log(val);
      }); // FOR IOS ONLY

    },(error) => {
      console.log(error);
    });
  }

  startTracking(){
    

    // start recording location
    this.backgroundGeolocation.start();
  }

  stopTracking(){
    this.backgroundGeolocation.stop();
  }

}
