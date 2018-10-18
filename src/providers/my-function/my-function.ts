import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Events, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { IziToastSettings, default as iziToast } from 'izitoast';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import moment from 'moment';
import * as _ from 'lodash';
import { NativeStorage } from '@ionic-native/native-storage';
/* import { IziToastSettings, default as iziToast } from 'izitoast'; */


/*
  Generated class for the MyFunctionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var window;
declare var cordova;

@Injectable()
export class MyFunctionProvider {
  db: any
  ngrok: string = "http://ba822dbf.ngrok.io/baristachoi-server2/public/" // "https://markloreto.xyz/"
  settings: any
  idLimit: number = 13
  local: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MTZmMGI4MGRiOWVmODRhN2JjMDcyMTBkYjZkM2UzYTI4YWUwZjdjOGUyNTU4MTIwYmQyZDQzYjYxMjI1N2UxN2IyNGRkNTFiMTY0MDk3In0.eyJhdWQiOiIzIiwianRpIjoiZjcxNmYwYjgwZGI5ZWY4NGE3YmMwNzIxMGRiNmQzZTNhMjhhZTBmN2M4ZTI1NTgxMjBiZDJkNDNiNjEyMjU3ZTE3YjI0ZGQ1MWIxNjQwOTciLCJpYXQiOjE1MjgzODIyNjEsIm5iZiI6MTUyODM4MjI2MSwiZXhwIjoxNTU5OTE4MjYxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RVcRU3SmGjpoK7Nh5QfDqFkowl23KgdQHZJFLM77biRgslyhjIpBOeqohBuFzWnnrNWY_F0FhwCfQj8G0SWRRoNeltnXpMq-AB3VTwMuCPMQlIml1ggwEM2aWdhRO_n_vpljdtaZkMvQw2lYnUSkeUgbqAp4vX4UlTe9UR0KH0cXHv_qzQbRGlRI7Yka7py9FU-xZGCM19NosLExGcNtPzRO9DK3cA7XUEfml7yVUbmHCXwpcRng8JDnfGXfp1zBiOBjM_7PCfqtnQ6eFT7gR3gyJQ_hTwx3YyAaeeipeemRPe7ao3OA2VsmzlR724yQPBThwU6WXXZEIZG3R5hAI3CmdpcmGMdSXVI2aSFba4R4AsSRtGkZrM8xFh4xXP6PsZQiNjWiG7GmghndGByJs_qLOmRkT14uGwdngrg5HX973WAdgp-ptb_H-IHtyF0k5f6X3vnMbZMNgvAMbFlUg67jYdpQU1zQvNwkeo9rgeaf8KddE-ymhKSOrRDRCp6yTZSrzBg8RBDdlA6CK-UW3xq09vWu038YCYSplT38SkMCrC_DAZOQ7OwqOdwMvvl0-1J-9K8V-cNkTCtSvTZfXhCQczxS1i1H7tqNj0Q3BoIAaAdng0h_ctwGXsVGD4YT8zdpobpFXwfb2zLX6tD0-C6A95-kTSs0LODgZYYEUWo"
  production: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjlmMjc5NzI1MGI1MWEyMDhlNTc2ZDlhNTJiNGRkOGI4MjhlZWI1NGNjYzYxNjA2NDE0MjU4NDYzMDhhNGQ1NWRhZjY1N2Y1ZTIxODVhZWQ2In0.eyJhdWQiOiI0IiwianRpIjoiOWYyNzk3MjUwYjUxYTIwOGU1NzZkOWE1MmI0ZGQ4YjgyOGVlYjU0Y2NjNjE2MDY0MTQyNTg0NjMwOGE0ZDU1ZGFmNjU3ZjVlMjE4NWFlZDYiLCJpYXQiOjE1MzkyNDE1NDQsIm5iZiI6MTUzOTI0MTU0NCwiZXhwIjoxNTcwNzc3NTQ0LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.jJGZOOJHv-CBax51s8lQFOUIKNXA8H_TSzCYdzr6zSyA9Jm_n_2dDd1dVGk6P-jV4YjtNeUNHlyniUHnMRx2SJfPwyOFvjR6gbh-eakn9XLOtvYzuMsQ8zoxCPCoqJNcGzcH6MrdrYeQIzwNQVj-USjUbR3o1LsRw9zOYjwzNglr8XMt4JwND85Dzx8MQmG7oQEtDa4gd0xiJ9iolo8V-Z7ynbnjjS025o1tNa3v5hgRhHzdUtiJ5aY35gmONlAVBSwNuJC9oeUkHaYYO8xstCjtyHORPTkXIZn2rqoaGfZ7cQv8PzcDW99Wl9FbvCwdzTPB2PY2vl_Y6FkyQX98AGxP9XZNVvq3fFr-jbN0MSDWVhbj3GMqWRaHI6zgT1QuvEXh36MEU7YyLEp_2LmtEJ1V6rJ4C_41MLjA1mhyt8mNkfoPbQfs_pOI3gj4O4-A_U5hHj37eZwLvNiXw_psbwsh2aiXo7lrdqGqMZ_gBXltohuZMtQbamq7vnFD7iD8c0jUI9EdmzTphsAoo_Lfdo4TbJfsgEjP4IkwgUDjXJtMKDAdEDL4y4EhbzgGX776SNpF89VMAIke6gN7OQlIwxlFy6-bPnV4PGo6nT8lWzIGqbmxbKq3u57DzcjYp8S-Pqei06s7wRe8hgaJQF9EaDnR1xegvCsNb-0jgXc1vXY"

  nav: any
  menuCtrl: any

  synching: boolean = false
  env: string = ""
  ssid: string = "barista choi"

  wrongDate: boolean = false;
  wrongDateAlertOpen: boolean = false;

  firstTime: boolean = false

  backButton: boolean = true

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
    private photoViewer: PhotoViewer,
    public alertCtrl: AlertController,
    public openNativeSettings: OpenNativeSettings,
    public nativeStorage: NativeStorage
  ) {
    console.log('Hello MyFunctionProvider Provider');
    this.env = this.local
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
        //this.dbQuery("DROP TABLE IF EXISTS endorsements", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, name TEXT, data TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT, display_name TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS product_categories (id INTEGER PRIMARY KEY, name TEXT, sequence INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS measurement_units (id INTEGER PRIMARY KEY, name TEXT, abbr TEXT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS modules (id INTEGER PRIMARY KEY, name TEXT)", [])

        this.dbQuery("CREATE TABLE IF NOT EXISTS staffs (id INTEGER PRIMARY KEY, depot_id INT, name TEXT, photo TEXT, thumbnail TEXT, role_id INT, contact TEXT, address TEXT, sss TEXT, philhealth TEXT, pagibig TEXT, birthday TEXT, fb TEXT, marital_status TEXT, email TEXT, fcm_token TEXT, passcode TEXT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, photo TEXT, thumbnail TEXT, category INT, cost REAL, price REAL, author INT, measurement_unit INT, shareable INT, sku TEXT, sequence INT, pack INT DEFAULT 1, star INT DEFAULT 0, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS attachments (id INTEGER PRIMARY KEY, staff_id INT, module_id INT, reference_id INT, b64 TEXT, b64_preview TEXT, depot_id INT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS delivery_receipts (id INTEGER PRIMARY KEY, staff_id INT, dr INT, created_date TEXT, notes TEXT, depot_id INT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS inventories (id INTEGER PRIMARY KEY, staff_id INT, product_id INT, qty INT, price REAL, cost REAL, module_id INT, reference_id INT, type INT, depot_id INT, remaining INT, sold INT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS disrs (id INTEGER PRIMARY KEY, staff_id INT, dealer_id INT, depot_id INT, created_date TEXT, sequence INT, notes TEXT, km_start INT, km_end INT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS endorsements (id INTEGER PRIMARY KEY, staff_id INT, created_date TEXT, notes TEXT, depot_id INT, sync INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS endorsement_items (id INTEGER PRIMARY KEY, staff_id INT, reference_id INT, product_id INT, qty INT, depot_id INT, sync INT)", [])

        this.dbQuery("CREATE TABLE IF NOT EXISTS remove_sync (id INTEGER PRIMARY KEY, table_name TEXT, reference_id INT)", [])
        this.dbQuery("CREATE TABLE IF NOT EXISTS update_sync (id INTEGER PRIMARY KEY, table_name TEXT, reference_id INT)", [])

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
            last_push_sync: parseInt(settings[5].data),
            timestamp: parseInt(settings[6].data)
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

  scanUpdatesNow(tables, i){
    if(i < tables.length){
      this.dbQuery("SELECT id FROM " + tables[i] + " WHERE sync IS NULL", []).then((data:any) => {
        console.log(data.length + " Entries needs to update on " + tables[i] + " table")
        if(data.length){
          let inArray = []
          let ar = []
          let fx = 0
          for(let x in data){
            inArray.push(data[x].id)
            ar.push(["INSERT INTO update_sync VALUES (?, ?, ?)", [this.getTimestamp() + fx, tables[i], data[x].id]])
            ar.push(["UPDATE " +tables[i]+ " SET sync = ? WHERE id = ?", [this.getTimestamp() + fx, data[x].id]])
            fx++
          }
          this.dbQuery("DELETE FROM update_sync WHERE table_name = ? AND reference_id IN ("+inArray.toString()+")", [tables[i]]).then(() => {
            this.dbQueryBatch(ar).then(()=>{
              this.scanUpdatesNow(tables, i+1)
            })
          })
        }else{
          this.scanUpdatesNow(tables, i+1)
        }
      })
    }else{
      console.log("Scan Updates Done...")
    }
  }

  scanUpdates(tables){
    console.log("Tables to scan for updates", tables)
    this.scanUpdatesNow(tables, 0)
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
      headers.append('Authorization', 'Bearer ' + this.env);
      let options = new RequestOptions({ headers: headers });

      this.http.get(this.ngrok + "api/" + api, options)
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
      headers.append('Authorization', 'Bearer ' + this.env);
      let options = new RequestOptions({ headers: headers });

      this.http.post(this.ngrok + "api/" + api, params, options)
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

  getSSID() {
    return new Promise((resolve) => {
      window.WifiWizard2.isConnectedToInternet().then((internet: any) => {
        window.WifiWizard2.getConnectedSSID().then((ssid: any) => {
          console.log("SSID", ssid)
          if (ssid.toLowerCase().search(this.ssid) != -1) {
            console.log("Correct SSID")
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch(e => {

        })
      }).catch(e => {

      })
    })
  }

  //Time Check
  public chkTime() {
    let myTS = this.getSettings("timestamp")
    if (myTS > parseInt(this.getTimestamp()) && this.settings) {
      //wrong date
      console.log("Wrong date");
      this.wrongDate = true
      if (!this.wrongDateAlertOpen) {
        this.backButton = false
        this.wrongDateAlertOpen = true;
        let alert = this.alertCtrl.create({
          title: 'Incorrect Date/time!!!',
          subTitle: 'You will be redirected to date settings to adjust it correctly',
          buttons: [
            {
              text: 'Ok, ayusin ko na lang ang date/time',
              handler: () => {
                this.wrongDateAlertOpen = false;
                setTimeout(() => {
                  this.openNativeSettings.open("date").then(() => {
                    console.log("Date Settings is now open")
                    alert.dismiss();
                  }).catch(() => {
                    console.log("failed to open date settings")
                  })
                }, 1000)
                return true
              }
            }
          ],
          enableBackdropDismiss: false
        });
        alert.present();
      }else{
        this.backButton = true
        this.wrongDateAlertOpen = false;
      }
    }
    else {
      if (this.wrongDate) {
        this.alertCtrl.create({
          title: 'Hey Buddy!',
          message: "I'm so proud of you! Thank you for fixing your date/time",
          buttons: ['OK']
        }).present();
        this.wrongDate = false;
        this.backButton = true
        this.setTimeInSettings();
      }
    }
  }

  setTimeInSettings() {
    if (!this.wrongDate && this.settings) {
      this.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [this.getTimestamp(), 7]).then(() => {
        this.setSettings()
        console.log("Timestamped")
      })
    }

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

  addS(num, name) {
    return (num > 1) ? num + " " + name + "s" : num + " " + name
  }

  getQtyHuman(qty, pack, name) {
    let m = Math.floor(qty / pack)
    return (qty % pack) ? m + " " + ((m > 1) ? "boxes" : "box") + " + " + this.addS(qty - (m * pack), name) : m + " " + ((m > 1) ? "boxes" : "box")
  }

  getProducts(cat = null, id = null, withPhoto = false, starred = null) {
    return new Promise((resolve) => {
      let photo = (withPhoto) ? "p.photo AS product_photo," : ""
      let catAndId = (cat != null && id != null) ? "p.category = " + cat + " AND p.id = " + id : (cat == null && id != null) ? "p.id = " + id : (cat != null && id == null) ? "p.category = " + cat : ""
      let star = (starred) ? (catAndId) ? "AND" : "" + "star = 1" : ""
      let where = (catAndId || star) ? "WHERE " : ""
      this.dbQuery("SELECT p.id AS product_id, p.name AS product_name, p.thumbnail AS product_thumbnail, " + photo + " p.cost AS product_cost, p.price AS product_price, p.shareable AS product_shareable, p.sku AS product_sku, p.sequence AS sequence, p.pack AS product_pack, p.star AS product_star, pc.id AS category_id, pc.name AS category_name, mu.id AS unit_id, mu.name AS unit_name, mu.abbr AS abbr, (ifnull((SELECT SUM(qty) FROM inventories WHERE type = 1 AND product_id = p.id), 0) - ifnull((SELECT SUM(qty) FROM inventories WHERE type = 2 AND product_id = p.id), 0)) AS stocks FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id " + where + " " + catAndId + " " + star + " ORDER BY p.sequence ASC", []).then((products: any) => {
        resolve(products)
      })
    })
  }

  getPercentageChange(oldNumber: number, newNumber: number) {
    var decreaseValue = oldNumber - newNumber;
    let r: any = 0
    r = ((decreaseValue / oldNumber) * 100).toFixed(2);
    return r
  }

  operators(o) {
    return (o == "equalTo") ? "=" : (o == "greaterThan") ? ">" : (o == "greaterThanOrEqualTo") ? ">=" : (o == "lessThan") ? "<" : "<="
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

  /**
  * Convert a base64 string in a Blob according to the data and contentType.
  *
  * @param b64Data {String} Pure base64 string without contentType
  * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
  * @param sliceSize {Int} SliceSize to process the byteCharacters
  * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  * @return Blob
  */

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**
  * Create a Image file according to its database64 content only.
  *
  * @param folderpath {String} The folder where the file will be created
  * @param filename {String} The name of the file that will be created
  * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
  */
  savebase64AsImageFile(filename, content, contentType, folderpath = "") {
    return new Promise((resolve, reject) => {
      // Convert the base64 string in a Blob
      var DataBlob = this.b64toBlob(content, contentType);

      console.log("Starting to write the file :3");

      window.resolveLocalFileSystemURL(this.file.externalDataDirectory + "/" + folderpath, function (dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, { create: true }, function (file) {
          console.log("File created succesfully.", dir, file);
          file.createWriter(function (fileWriter) {
            console.log("Writing content to file");
            fileWriter.write(DataBlob);
            resolve(file)
          }, function () {
            alert('Unable to save file in path ' + folderpath);
            reject()
          });
        });
      });
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

  //inits
  appDir(){
    this.file.checkDir(this.file.externalRootDirectory, 'baristachoi').then(() => {
      console.log("BC Directory Exist")
    }).catch(err => {
      console.log("BC Directory Not Exist")
      this.file.createDir(this.file.externalRootDirectory, "baristachoi", true)
    });
  }

}
