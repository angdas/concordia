import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationProvider } from '../../providers/location/location';
import { Storage } from '@ionic/storage';
import { AxServiceProvider } from '../../providers/ax-service/ax-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  locationEnabled: any;
  public server: any;
  public port: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, 
    public location: LocationProvider, public axService: AxServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.setServerPort();
  }
  
  locationEnabledChange(){
    console.log(this.locationEnabled);
    this.storage.set('trackerlocationEnabled',this.locationEnabled);
    if(this.locationEnabled == true)
      this.location.startTracking();
    else
      this.location.stopTracking();
  }

  serverChange(){
    this.storage.ready().then(() => {
      this.storage.set("trackerserver",this.server);
      this.axService.server = this.server;
      this.axService.setURL();
    });    
  }

  portChange(){
    this.storage.ready().then(() => {
      this.storage.set("trackerport",this.port);
      this.axService.port = this.port;
      this.axService.setURL();
    });    
  }

  setServerPort(){ 
    this.storage.ready().then(() => {
      this.storage.get("trackerserver").then((data) => {
        this.server = data;       
      });
      this.storage.get("trackerport").then((data) => {
        this.port = data;
      });
    });
  }
}
