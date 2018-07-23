import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { IziToastSettings, default as iziToast } from 'izitoast';
import moment from 'moment';
import * as _ from 'lodash';
/* import { IziToastSettings, default as iziToast } from 'izitoast'; */


/*
  Generated class for the MyFunctionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var window;

@Injectable()
export class MyFunctionProvider {
  db: any
  ngrok: string = "http://056e003f.ngrok.io"
  settings: any
  idLimit: number = 13

  nav: any
  menuCtrl: any

  synching: boolean = false

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
  startDatabase() {
    return new Promise((resolve) => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        console.log("DB Initialized")
        this.db = db
        //this.dbQuery("INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [6, "last_push_sync", 0])
        //this.dbQuery("DROP TABLE IF EXISTS delivery_receipts", [])
        //this.dbQuery("DROP TABLE IF EXISTS inventories", [])
        //this.dbQuery("DROP TABLE IF EXISTS attachments", [])
        //this.dbQuery("DROP TABLE IF EXISTS products", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, name TEXT, data TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, display_name TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS product_categories (id INTEGER PRIMARY KEY, name TEXT, sequence INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS measurement_units (id INTEGER PRIMARY KEY, name TEXT, abbr TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS modules (id INTEGER PRIMARY KEY, name TEXT)", [])

        this.dbQuery("CREATE TABLE IF NOT EXISTS staffs (id INTEGER PRIMARY KEY, depot_id INT, name TEXT, photo TEXT, thumbnail TEXT, role_id INT, sync INT DEFAULT 2)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, photo TEXT, thumbnail TEXT, category INT, cost REAL, price REAL, author INT, measurement_unit INT, shareable INT, sku TEXT, sequence INT, pack INT DEFAULT 1, star INT DEFAULT 0, sync INT DEFAULT 2)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS attachments (id INTEGER PRIMARY KEY, staff_id INT, module_id INT, reference_id INT, b64 TEXT, b64_preview TEXT, depot_id INT, sync INT DEFAULT 2)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS delivery_receipts (id INTEGER PRIMARY KEY, staff_id INT, dr INT, created_date TEXT, notes TEXT, depot_id INT, sync INT DEFAULT 2)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS inventories (id INTEGER PRIMARY KEY, staff_id INT, product_id INT, qty INT, price REAL, cost REAL, module_id INT, reference_id INT, type INT, depot_id INT, remaining INT, sold INT, sync INT DEFAULT 2)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS disrs (id INTEGER PRIMARY KEY, staff_id INT, dealer_id INT, depot_id INT, created_date TEXT, sequence INT, notes TEXT, km_start INT, km_end INT, sync INT DEFAULT 2)", [])

        this.dbQuery("CREATE TABLE IF NOT EXISTS remove_sync (id INTEGER PRIMARY KEY, table_name TEXT, reference_id INT)", [])

        this.setSettings()

        resolve()
      }).catch(e => console.log(e));
    })
  }

  setSettings() {
    return new Promise((resolve) => {
      this.dbQuery("SELECT * FROM settings", []).then((settings: any) => {
        if (settings.length) {
          this.settings = {
            time_in: parseInt(settings[0].data),
            depot: JSON.parse(settings[1].data),
            passcode: settings[2].data,
            logged_staff: settings[3].data,
            accountable_staff: settings[4].data,
            last_push_sync: parseInt(settings[5].data)
          }
          resolve(this.settings)
        } else {
          resolve()
        }
      })
    })
  }

  getSettings(name) {
    return _.get(this.settings, name)
  }

  //DB

  dbQuery(q, v) {
    return new Promise((resolve, reject) => {
      this.db.executeSql(q, v).then((data: any) => {
        let ar = []
        for (let x = 0; x < data.rows.length; x++) {
          ar.push(data.rows.item(x))
        }
        if (data.rowsAffected)
          resolve(data.insertId)
        else
          resolve(ar);
      }, (error) => {
        console.log(error)
        reject(error);
      });
    });
  }

  dbQueryBatch(q) {
    return new Promise((resolve, reject) => {
      this.db.sqlBatch(q).then((data: any) => {
        resolve(data)
      }, (error) => {
        console.log(error)
        reject(error);
      })
    })
  }

  dbColValExist(table, col, val) {
    return new Promise((resolve) => {
      this.dbQuery("SELECT " + col + " FROM " + table + " WHERE " + col + " = ?", [val]).then((q: any) => {
        if (q.length)
          resolve(true)
        else
          resolve(false)
      })
    })
  }

  deleteSync(items) {
    return new Promise((resolve) => {
      let array = []
      for (let x in items) {
        array.push(["DELETE FROM " + items[x].table + " WHERE id = ?", [items[x].id]])
        if (items[x].sync)
          array.push(["INSERT OR REPLACE INTO remove_sync (table_name, reference_id) VALUES (?, ?)", [items[x].table, items[x].id]])
      }

      this.dbQueryBatch(array).then(() => {
        resolve()
      })
    })
  }

  //Networks

  APIGet(api) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MTZmMGI4MGRiOWVmODRhN2JjMDcyMTBkYjZkM2UzYTI4YWUwZjdjOGUyNTU4MTIwYmQyZDQzYjYxMjI1N2UxN2IyNGRkNTFiMTY0MDk3In0.eyJhdWQiOiIzIiwianRpIjoiZjcxNmYwYjgwZGI5ZWY4NGE3YmMwNzIxMGRiNmQzZTNhMjhhZTBmN2M4ZTI1NTgxMjBiZDJkNDNiNjEyMjU3ZTE3YjI0ZGQ1MWIxNjQwOTciLCJpYXQiOjE1MjgzODIyNjEsIm5iZiI6MTUyODM4MjI2MSwiZXhwIjoxNTU5OTE4MjYxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RVcRU3SmGjpoK7Nh5QfDqFkowl23KgdQHZJFLM77biRgslyhjIpBOeqohBuFzWnnrNWY_F0FhwCfQj8G0SWRRoNeltnXpMq-AB3VTwMuCPMQlIml1ggwEM2aWdhRO_n_vpljdtaZkMvQw2lYnUSkeUgbqAp4vX4UlTe9UR0KH0cXHv_qzQbRGlRI7Yka7py9FU-xZGCM19NosLExGcNtPzRO9DK3cA7XUEfml7yVUbmHCXwpcRng8JDnfGXfp1zBiOBjM_7PCfqtnQ6eFT7gR3gyJQ_hTwx3YyAaeeipeemRPe7ao3OA2VsmzlR724yQPBThwU6WXXZEIZG3R5hAI3CmdpcmGMdSXVI2aSFba4R4AsSRtGkZrM8xFh4xXP6PsZQiNjWiG7GmghndGByJs_qLOmRkT14uGwdngrg5HX973WAdgp-ptb_H-IHtyF0k5f6X3vnMbZMNgvAMbFlUg67jYdpQU1zQvNwkeo9rgeaf8KddE-ymhKSOrRDRCp6yTZSrzBg8RBDdlA6CK-UW3xq09vWu038YCYSplT38SkMCrC_DAZOQ7OwqOdwMvvl0-1J-9K8V-cNkTCtSvTZfXhCQczxS1i1H7tqNj0Q3BoIAaAdng0h_ctwGXsVGD4YT8zdpobpFXwfb2zLX6tD0-C6A95-kTSs0LODgZYYEUWo');
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

  APIPost(api, params) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MTZmMGI4MGRiOWVmODRhN2JjMDcyMTBkYjZkM2UzYTI4YWUwZjdjOGUyNTU4MTIwYmQyZDQzYjYxMjI1N2UxN2IyNGRkNTFiMTY0MDk3In0.eyJhdWQiOiIzIiwianRpIjoiZjcxNmYwYjgwZGI5ZWY4NGE3YmMwNzIxMGRiNmQzZTNhMjhhZTBmN2M4ZTI1NTgxMjBiZDJkNDNiNjEyMjU3ZTE3YjI0ZGQ1MWIxNjQwOTciLCJpYXQiOjE1MjgzODIyNjEsIm5iZiI6MTUyODM4MjI2MSwiZXhwIjoxNTU5OTE4MjYxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RVcRU3SmGjpoK7Nh5QfDqFkowl23KgdQHZJFLM77biRgslyhjIpBOeqohBuFzWnnrNWY_F0FhwCfQj8G0SWRRoNeltnXpMq-AB3VTwMuCPMQlIml1ggwEM2aWdhRO_n_vpljdtaZkMvQw2lYnUSkeUgbqAp4vX4UlTe9UR0KH0cXHv_qzQbRGlRI7Yka7py9FU-xZGCM19NosLExGcNtPzRO9DK3cA7XUEfml7yVUbmHCXwpcRng8JDnfGXfp1zBiOBjM_7PCfqtnQ6eFT7gR3gyJQ_hTwx3YyAaeeipeemRPe7ao3OA2VsmzlR724yQPBThwU6WXXZEIZG3R5hAI3CmdpcmGMdSXVI2aSFba4R4AsSRtGkZrM8xFh4xXP6PsZQiNjWiG7GmghndGByJs_qLOmRkT14uGwdngrg5HX973WAdgp-ptb_H-IHtyF0k5f6X3vnMbZMNgvAMbFlUg67jYdpQU1zQvNwkeo9rgeaf8KddE-ymhKSOrRDRCp6yTZSrzBg8RBDdlA6CK-UW3xq09vWu038YCYSplT38SkMCrC_DAZOQ7OwqOdwMvvl0-1J-9K8V-cNkTCtSvTZfXhCQczxS1i1H7tqNj0Q3BoIAaAdng0h_ctwGXsVGD4YT8zdpobpFXwfb2zLX6tD0-C6A95-kTSs0LODgZYYEUWo');
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

  checkInternetConnection() {
    return new Promise((resolve) => {
      window.WifiWizard2.isConnectedToInternet().then((internet: any) => {
        resolve(true)
      }).catch(e => {
        resolve(false)
      })
    })
  }

  //Misc
  spinner(spinner, message) {
    this.events.publish("spinner:load", spinner, message)
  }

  getTimestamp() {
    return moment().format("x")
  }

  getLaravelDate() {
    return moment().format("YYYY-MM-DD HH:mm:ss")
  }

  addS(num, name){
    return (num > 1) ? num + " " + name + "s" : num + " " + name
  }

  getQtyHuman(qty, pack, name){
    let m = Math.floor(qty / pack)
    return (qty % pack) ? m + " " + ((m > 1) ? "boxes" : "box") + " + " + this.addS(qty - (m * pack), name) : m + " " + ((m > 1) ? "boxes" : "box")
  }

  //Files
  fileInfo(path) {
    return new Promise((resolve) => {
      window.resolveLocalFileSystemURL(path, gotFile, fail);

      function fail(e) {
        console.log(e);
      }

      function gotFile(fileEntry) {
        fileEntry.file(function (file) {
          resolve(file)
        });
      }
    })
  }

  getFileContentAsBase64(f) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => { console.log("onload") }
      reader.onerror = error => reject(error);
      reader.onloadstart = () => { console.log("started") }
      reader.onloadend = () => { resolve(reader.result); console.log("weee") }
      reader.readAsDataURL(f);
    })
  }

  //Images
  takePicture() {
    return new Promise((resolve, reject) => {
      let self = this

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
      let img = new Image();
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

  resizeImage(uri, width, height) {
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

  sanitize(base64) {
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  viewPhoto(photo) {
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

  toastConfirm(title, message, icon = "", iconText = "", iconColor = "", timeout = 10000, image = "", imageWidth = null) {
    return new Promise((resolve, reject) => {
      let hide: IziToastSettings = {
        message: "",
        transitionOut: 'fadeOutUp',
        onClosing: (instance, toast, closedBy) => {

        }
      }

      let options: IziToastSettings = {
        icon: icon,
        iconText: iconText,
        iconColor: iconColor,
        image: image,
        imageWidth: imageWidth,
        timeout: timeout,
        close: false,
        overlay: true,
        toastOnce: true,
        id: 'confirm',
        title: title,
        message: message,
        position: 'center',
        buttons: [
          ['<button>No</button>', function (instance, toast) {
            resolve(false)
            instance.hide(hide, toast, "buttonName")
          }, false],
          ['<button>Yes</button>', function (instance, toast) {
            resolve(true)
            instance.hide(hide, toast, "buttonName")
          }, false]
        ]
      }

      iziToast.question(options);
    })
  }

}
