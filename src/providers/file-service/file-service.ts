import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Platform } from 'ionic-angular';
import * as FileSaver from 'file-saver';
import { File } from '@ionic-native/file';
declare var cordova: any

/*
  Generated class for the FileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileServiceProvider {

  constructor(public platform: Platform, private file: File) {
    console.log('Hello FileServiceProvider Provider');
  }

  b64toBlob(b64Data, contentType, sliceSize = 512) {
    contentType = contentType || '';

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

  init() {
    console.log("File service Init")
    this.file.checkDir(this.file.externalRootDirectory, "Barista Choi-Finance").then(isIt => {

    }).catch(_ => {
      console.log("No Finance Folder")
      this.file.createDir(this.file.externalRootDirectory, "Barista Choi - Finance", true).then(_ => {
        this.file.createDir(this.file.externalRootDirectory + "/Barista Choi - Finance", "databases", true).then(_ => {

        })
      })
    })
  }

  public s2ab(s) {
    var buf
    if (typeof ArrayBuffer !== 'undefined') {
      buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    } else {
      buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  }

  readAsText(path, file) {
    return new Promise((resolve, reject) => {
      this.file.readAsText(path, file).then(text => {
        resolve(text)
      })
    })
  }


  public save(fileDestiny, fileName, fileMimeType, fileData, b64 = false) {
    return new Promise((resolve, reject) => {
      let blob
      if (b64)
        blob = this.b64toBlob(fileData, fileMimeType)
      else
        blob = new Blob([fileData], { type: fileMimeType });

      if (!this.platform.is('android')) {
        FileSaver.saveAs(blob, fileName);
        resolve()
      } else {
        this.file.writeFile(fileDestiny, fileName, blob, { replace: true }).then(() => {
          console.log("file created at: " + fileDestiny);
          resolve()
        }).catch(() => {
          console.log("error creating file at :" + fileDestiny);
          reject()
        })
      }
    })

  }

  copyFile(path, fileName, newPath, newFileName) {
    return new Promise((resolve, reject) => {
      this.file.copyFile(path, fileName, newPath, newFileName).then(_ => {
        resolve()
      })
    })
  }

  getDirectories() {
    return { externalRootDirectory: this.file.externalRootDirectory }
  }

  public getStorageDirectory(): string {
    let src: string = "";

    if (this.platform.is('android')) {
      src = cordova.file.externalRootDirectory;
    }

    return src + "baristachoi/";
  }

}
