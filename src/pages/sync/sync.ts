import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { IziToastSettings, default as iziToast } from 'izitoast';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment'
import { SyncComponent } from '../../components/sync/sync';

/**
 * Generated class for the SyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage {
  @ViewChild(SyncComponent)
  private sync: SyncComponent
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.myFunctionProvider.spinner(false, "")

  }

  menuBtn(e){
    if(e.title === "Sync Now"){
      if(this.myFunctionProvider.synching){
        iziToast.warning({
          title: 'Synching just started',
          message: 'Please wait... after synching is done',
        });
      }else{
        this.myFunctionProvider.dbQuery("SELECT COUNT(id) AS c FROM products", []).then((c: any) => {
          if(c[0].c === 0)
            this.sync.syncNow(true)
          else
            this.sync.syncNow(false)
        })
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyncPage');
  }

}
