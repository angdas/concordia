import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';

@Injectable()
export class AxServiceProvider {

  public server: any;
  public port: any;
  public url;
  public user;
  public axUser;
  private loginURL;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello AxServiceProvider Provider');
    this.setServerPort();
  }

  setServerPort(){ 
    this.storage.ready().then(() => {
      this.storage.get("trackerserver").then((data) => {
        this.server = data;
        this.setURL();            
      });
      this.storage.get("trackerport").then((data) => {
        this.port = data;
        this.setURL(); 
      });
    });

    this.setURL();
  }

  setURL(){
    this.url = 'http://'+this.server+':'+this.port+'/MattexWebAPI/';
    this.loginURL = this.url + 'checkuser';
  }

  auth(user:string, password: string): Observable<any>{
    let body = {UserId: user, Password: password};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.loginURL,JSON.stringify(body), options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  updateLoc(user: String, lat: number, lng: Number): Observable<any>{    
    let body = {user: user,lat: lat,lng: lng};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });    
    return this.http.post('http://94.206.51.26:6150/updateloc',JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) { 
    return res.json() || { };
  }
    
  private handleError (error: Response | any) { 
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  } 

}
