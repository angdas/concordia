import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { AxServiceProvider } from '../../providers/ax-service/ax-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController, public axService: AxServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.storage.ready().then(() => {
      this.storage.get('trackeruser').then(data => {
        this.username = data;
      });
      this.storage.get('trackerpassword').then(data => {
        this.password = data;
      });
    });
  }

  doLogin(){
    console.log(this.username+"+"+this.password);
    let loading = this.loadingCtrl.create({
      content: 'Authenticating'
    });
    loading.present();
    this.axService.auth(this.username,this.password).subscribe(res =>{ 
      loading.dismiss();
      this.storage.ready().then(() => {       
        this.storage.set('trackeruser', this.username);
        this.storage.set('trackerpassword',this.password);
        this.storage.set('trackerauthenticated', res.Authenticated); 
        this.storage.set('trackername', res.Worker.Name); 
        this.storage.set('trackerimage', res.Worker.ImageStr); 
      });         
      if(res.Authenticated == true) {
        this.navCtrl.setRoot(HomePage);
      } else {
        let alert = this.alertCtrl.create({
          title: 'Login',
          subTitle: 'Please check your credentials.',
          buttons: ['Dismiss']
        }); 
        alert.present();
      }               
    }, (error) => {
      console.log('ERROR'+error);
      loading.dismiss();
      this.alertCtrl.create( {title : 'Error', subTitle : 'Please check network connection.', buttons : ['Dismiss']}).present();
    });
  }
}
