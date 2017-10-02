import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public name: String;
  public imagestr: string;
  constructor(public navCtrl: NavController, public storage: Storage, private sanitizer: DomSanitizer) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.storage.ready().then(() => {
      this.storage.get('trackerauthenticated').then(data => {
        if(data == false || data == null){
          this.navCtrl.push(LoginPage);
        } else {
          this.storage.get('trackername').then(data => {
            this.name = data;
          });
          this.storage.get('trackerimage').then(data => {
            if(data == "" || data == null){
              this.imagestr = "";
            } else {
              var img = "data:image/jpeg;base64," + data;      
              this.imagestr = img;
            }
            console.log(this.imagestr);
          });
        }          
      });
    });
  }

  public getImageStr()
  {
    return this.sanitizer.bypassSecurityTrustUrl(this.imagestr);    
  }

}
