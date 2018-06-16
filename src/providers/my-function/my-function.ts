import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Events } from 'ionic-angular';
import moment from 'moment';
/*
  Generated class for the MyFunctionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var window;

@Injectable()
export class MyFunctionProvider {
  db: any
  ngrok: string = "https://c8fcef65.ngrok.io"
  settings: any
  constructor(
    public http: Http,
    public sqlite: SQLite,
    public events: Events
  ) {
    console.log('Hello MyFunctionProvider Provider');

  }

  // Database
  startDatabase(){
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        console.log("DB Initialized")
        this.db = db

        //this.myFunctionProvider.dbQuery("DROP TABLE IF EXISTS staffs", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, name TEXT, data TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS staffs (id INTEGER PRIMARY KEY, depot_id INT, name TEXT, photo TEXT, thumbnail TEXT, role_id INT, created_at TEXT, updated_at TEXT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT)", [])

        this.setSettings()

        resolve()
      }).catch(e => console.log(e));
    })
  }

  setSettings(){
    return new Promise((resolve, reject) => {
      this.dbQuery("SELECT * FROM settings", []).then((settings:any) => {
        if(settings.length){
          this.settings = {
            time_in: parseInt(settings[0].data),
            depot: JSON.parse(settings[1].data),
            passcode: settings[2].data,
            logged_staff: settings[3].data,
            accountable_staff: settings[4].data
          }
          resolve(this.settings)
        }else{
          resolve()
        }
      })
    })
  }

  dbQuery(q, v){
    return new Promise((resolve, reject) => {
      this.db.executeSql(q, v).then((data:any) => {
        var ar = []
        for(var x = 0; x < data.rows.length; x++){
          ar.push(data.rows.item(x))
        }
        if(data.rowsAffected)
          resolve(data.insertId)
        else
          resolve(ar);
      }, (error) => {
        console.log(error)
        reject(error);
      });
    });
  }

  //DB

  dbQueryBatch(q){
    return new Promise((resolve, reject) => {
      this.db.sqlBatch(q).then((data:any) => {
        resolve(data)
      }, (error) => {
        console.log(error)
        reject(error);
      })
    })
  }

  //Networks

  APIGet(api){
    return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MTZmMGI4MGRiOWVmODRhN2JjMDcyMTBkYjZkM2UzYTI4YWUwZjdjOGUyNTU4MTIwYmQyZDQzYjYxMjI1N2UxN2IyNGRkNTFiMTY0MDk3In0.eyJhdWQiOiIzIiwianRpIjoiZjcxNmYwYjgwZGI5ZWY4NGE3YmMwNzIxMGRiNmQzZTNhMjhhZTBmN2M4ZTI1NTgxMjBiZDJkNDNiNjEyMjU3ZTE3YjI0ZGQ1MWIxNjQwOTciLCJpYXQiOjE1MjgzODIyNjEsIm5iZiI6MTUyODM4MjI2MSwiZXhwIjoxNTU5OTE4MjYxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RVcRU3SmGjpoK7Nh5QfDqFkowl23KgdQHZJFLM77biRgslyhjIpBOeqohBuFzWnnrNWY_F0FhwCfQj8G0SWRRoNeltnXpMq-AB3VTwMuCPMQlIml1ggwEM2aWdhRO_n_vpljdtaZkMvQw2lYnUSkeUgbqAp4vX4UlTe9UR0KH0cXHv_qzQbRGlRI7Yka7py9FU-xZGCM19NosLExGcNtPzRO9DK3cA7XUEfml7yVUbmHCXwpcRng8JDnfGXfp1zBiOBjM_7PCfqtnQ6eFT7gR3gyJQ_hTwx3YyAaeeipeemRPe7ao3OA2VsmzlR724yQPBThwU6WXXZEIZG3R5hAI3CmdpcmGMdSXVI2aSFba4R4AsSRtGkZrM8xFh4xXP6PsZQiNjWiG7GmghndGByJs_qLOmRkT14uGwdngrg5HX973WAdgp-ptb_H-IHtyF0k5f6X3vnMbZMNgvAMbFlUg67jYdpQU1zQvNwkeo9rgeaf8KddE-ymhKSOrRDRCp6yTZSrzBg8RBDdlA6CK-UW3xq09vWu038YCYSplT38SkMCrC_DAZOQ7OwqOdwMvvl0-1J-9K8V-cNkTCtSvTZfXhCQczxS1i1H7tqNj0Q3BoIAaAdng0h_ctwGXsVGD4YT8zdpobpFXwfb2zLX6tD0-C6A95-kTSs0LODgZYYEUWo' );
    let options = new RequestOptions({ headers: headers });

    this.http.get(this.ngrok + "/baristachoi-server2/public/api/" + api, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log("Data from server", data);
        resolve(data)

      }, error => {
        console.log(error);// Error getting the data
        reject(error)
      });
    })
  }

  checkInternetConnection(){
    return new Promise((resolve, reject) => {
      window.WifiWizard2.isConnectedToInternet().then((internet: any) => {
        resolve(true)
      }).catch(e => {
        resolve(false)
      })
    })
  }

  //Misc
  spinner(spinner, message){
    this.events.publish("spinner:load", spinner, message)
  }

  getTimestamp(){
    return moment().format("x")
  }


}
