import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Events } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import moment from 'moment';
import * as _ from 'lodash';
/*
  Generated class for the MyFunctionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var window;

@Injectable()
export class MyFunctionProvider {
  db: any
  ngrok: string = "http://9211cde6.ngrok.io"
  settings: any
  syncPullStep: number = 0
  syncPullTotalRecord: number = 0
  syncPullTables: any = []
  nav: any
  menuCtrl: any
  constructor(
    public http: Http,
    public sqlite: SQLite,
    public events: Events,
    private camera: Camera,
    public sanitizer: DomSanitizer,
    private imageResizer: ImageResizer,
    private toastCtrl: ToastController,
    public fileChooser: FileChooser,
    public file: File,
    private photoViewer: PhotoViewer
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

        //this.dbQuery("DROP TABLE IF EXISTS products", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, name TEXT, data TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS staffs (id INTEGER PRIMARY KEY, depot_id INT, name TEXT, photo TEXT, thumbnail TEXT, role_id INT, created_at TEXT, updated_at TEXT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS product_categories (id INTEGER PRIMARY KEY, name TEXT, sequence INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS measurement_units (id INTEGER PRIMARY KEY, name TEXT, abbr TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, photo TEXT, thumbnail TEXT, category INT, cost REAL, price REAL, author INT, measurement_unit INT, shareable INT, sku TEXT, sequence INT, pack INT DEFAULT 1, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS modules (id INTEGER PRIMARY KEY, name TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS attachments (id INTEGER PRIMARY KEY, module_id INT, item_id INT, b64 TEXT, b64_preview TEXT, sync INT)", [])
        //this.dbQuery("CREATE TABLE IF NOT EXISTS sync_tables (id INTEGER PRIMARY KEY, name TEXT, last_sync TEXT)", [])

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

  getSettings(name){
    return _.get(this.settings, name)
  }

  //DB

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
        }
      );
    })
  }

  APIPost(api, params){
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MTZmMGI4MGRiOWVmODRhN2JjMDcyMTBkYjZkM2UzYTI4YWUwZjdjOGUyNTU4MTIwYmQyZDQzYjYxMjI1N2UxN2IyNGRkNTFiMTY0MDk3In0.eyJhdWQiOiIzIiwianRpIjoiZjcxNmYwYjgwZGI5ZWY4NGE3YmMwNzIxMGRiNmQzZTNhMjhhZTBmN2M4ZTI1NTgxMjBiZDJkNDNiNjEyMjU3ZTE3YjI0ZGQ1MWIxNjQwOTciLCJpYXQiOjE1MjgzODIyNjEsIm5iZiI6MTUyODM4MjI2MSwiZXhwIjoxNTU5OTE4MjYxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RVcRU3SmGjpoK7Nh5QfDqFkowl23KgdQHZJFLM77biRgslyhjIpBOeqohBuFzWnnrNWY_F0FhwCfQj8G0SWRRoNeltnXpMq-AB3VTwMuCPMQlIml1ggwEM2aWdhRO_n_vpljdtaZkMvQw2lYnUSkeUgbqAp4vX4UlTe9UR0KH0cXHv_qzQbRGlRI7Yka7py9FU-xZGCM19NosLExGcNtPzRO9DK3cA7XUEfml7yVUbmHCXwpcRng8JDnfGXfp1zBiOBjM_7PCfqtnQ6eFT7gR3gyJQ_hTwx3YyAaeeipeemRPe7ao3OA2VsmzlR724yQPBThwU6WXXZEIZG3R5hAI3CmdpcmGMdSXVI2aSFba4R4AsSRtGkZrM8xFh4xXP6PsZQiNjWiG7GmghndGByJs_qLOmRkT14uGwdngrg5HX973WAdgp-ptb_H-IHtyF0k5f6X3vnMbZMNgvAMbFlUg67jYdpQU1zQvNwkeo9rgeaf8KddE-ymhKSOrRDRCp6yTZSrzBg8RBDdlA6CK-UW3xq09vWu038YCYSplT38SkMCrC_DAZOQ7OwqOdwMvvl0-1J-9K8V-cNkTCtSvTZfXhCQczxS1i1H7tqNj0Q3BoIAaAdng0h_ctwGXsVGD4YT8zdpobpFXwfb2zLX6tD0-C6A95-kTSs0LODgZYYEUWo' );
      let options = new RequestOptions({ headers: headers });

      this.http.post(this.ngrok + "/baristachoi-server2/public/api/" + api, params, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log("Data from server", data);
          resolve(data)

        }, error => {
          console.log(error);// Error getting the data
          reject(error)
        }
      );
    })
  }

  checkInternetConnection(){
    return new Promise((resolve) => {
      window.WifiWizard2.isConnectedToInternet().then((internet: any) => {
        resolve(true)
      }).catch(e => {
        resolve(false)
      })
    })
  }

  //Sync
  cloudInsert(table, data){
    return new Promise((resolve) => {
      console.log("Inserting Data", table, data)
      var obj = ""
      var qm = ""
      var values = []
      var columns //= _.omit(data, ['created_at', 'updated_at', 'deleted_at'])
      var v
      var batch = []

      for(var n in data){
        obj = ""
        qm = ""
        values = []
        columns = _.omit(data[n], ['created_at', 'updated_at', 'deleted_at'])

        for(var x in columns){
          obj += x + ","
          qm += "?,"
          v = (columns[x] == "null") ? null : columns[x]
          values.push(v)
        }

        obj = obj.slice(0, -1);
        qm = qm.slice(0, -1);

        batch.push(["INSERT OR REPLACE INTO " + table + " ("+obj+") VALUES ("+qm+")", values])
      }

      this.dbQueryBatch(batch).then(() => {
        resolve()
      })
    })
  }

  syncPullPost(table, all, skip){
    this.APIPost("syncPull", {table: table, all: all, skip: skip, staff_id: this.settings.logged_staff}).then((data: any) => {
      if(data.data.length){
        this.cloudInsert(table, data.data).then(() => {
          this.syncPullPost(table, all, skip + 10)
          this.dbQuery("SELECT * FROM " + table + " ORDER BY id DESC LIMIT " + data.data.length, []).then((latestRecord: any) => {
            console.log("Latest Inserted Record", latestRecord)
          })
        })
      }else{
        this.syncPullStep++
        this.syncPull(this.syncPullTables, all)
      }
    })
  }

  syncPullCount(table, all){
    return new Promise((resolve) => {
      this.APIPost("syncPullCount", {table: table, all: all, staff_id: this.settings.logged_staff}).then((data: any) => {
        //Percent Loader
        console.log("total records", data)
        this.syncPullTotalRecord = data.data
        resolve()
      })
    })
  }

  syncPull(tables, all = false){
    this.syncPullTables = tables
    if(this.syncPullStep < tables.length){
      this.syncPullCount(tables[this.syncPullStep], all).then(() => {
        this.syncPullPost(tables[this.syncPullStep], all, 0)
      })
    }else{
      //sync done
      console.log("Done Synching")
      this.syncPullStep = 0
      this.syncPullTotalRecord = 0

    }
  }

  //Misc
  spinner(spinner, message){
    this.events.publish("spinner:load", spinner, message)
  }

  getTimestamp(){
    return moment().format("x")
  }

  getLaravelDate(){
    return moment().format("YYYY-MM-DD HH:mm:ss")
  }

  //Files
  fileInfo(path){
    return new Promise((resolve) => {
      window.resolveLocalFileSystemURL(path, gotFile, fail);

      function fail(e) {
          console.log(e);
      }

      function gotFile(fileEntry) {
        fileEntry.file(function(file) {
            resolve(file)
        });
      }
    })
  }

  getFileContentAsBase64(f){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {console.log("onload")}
        reader.onerror = error => reject(error);
        reader.onloadstart = () => {console.log("started")}
        reader.onloadend = () => {resolve(reader.result); console.log("weee")}
        reader.readAsDataURL(f);
    })
  }

  //Images
  takePicture(){
    return new Promise((resolve, reject) => {
      var self = this

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 1024,
        targetHeight: 768
      }

      this.camera.getPicture(options).then((uri) => {
        self.spinner(true, "Processing Photo...")
        console.log("Photo Process 1", uri)
        this.imageProcess(uri).then((images: any) => {
          self.spinner(false, "")
          resolve(images)
        })
      }, (err) => {
       // Handle error
       self.spinner(false, "")
      });
    })
  }

  imageProperty(uri) {
    return new Promise((resolve) => {
      var img = new Image();
      img.onload = function () {
        resolve(img)
      }
      img.src = uri
    })
  }

  imageProcess(uri) {
    return new Promise((resolve) => {
      let self = this

      this.imageProperty(uri).then((img: any) => {
        self.fileInfo(uri).then((fileData: any) => {
          console.log("Photo Process 2", fileData)
          self.getFileContentAsBase64(fileData).then((b64: any) => {
            console.log("Photo Process 3", b64)
            self.resizeImage(uri, img.width * 0.25, img.height * 0.25).then((thumbnailUri) => {
              console.log("Photo Process 4", thumbnailUri)
              self.fileInfo(thumbnailUri).then((thumbnailFileData) => {
                console.log("Photo Process 5", thumbnailFileData)
                self.getFileContentAsBase64(thumbnailFileData).then((thumbnailB64) => {
                  console.log("Photo Process 6", thumbnailB64)
                  resolve({ photo: b64, thumbnail: thumbnailB64 })

                })
              })
            })
          })
        })
      })
    })
  }

  resizeImage(uri, width, height){
    return new Promise((resolve, reject) => {
      let options = {
        uri: uri,
        folderName: 'Protonet',
        quality: 100,
        width: width,
        height: height
       } as ImageResizerOptions;

       this.imageResizer
         .resize(options)
         .then((filePath: string) => {
          console.log('FilePath', filePath)
          resolve(filePath)
         })
         .catch(e => console.log(e));
    })
  }

  sanitize(base64){
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  viewPhoto(photo){
    this.photoViewer.show(photo)
  }

  //Notifications
  presentToast(message, cssClass, duration = 3000, position = "bottom", showCloseButton = true) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: showCloseButton,
      cssClass: cssClass
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
