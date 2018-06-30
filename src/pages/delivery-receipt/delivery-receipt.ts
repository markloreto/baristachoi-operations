import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**
 * Generated class for the DeliveryReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delivery-receipt',
  templateUrl: 'delivery-receipt.html',
})
export class DeliveryReceiptPage {
  testData: any = [1, 2, 3, 4]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    private myFunctionProvider: MyFunctionProvider
  ) {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryReceiptPage');
  }

  ionViewWillLeave() {
    this.screenOrientation.unlock();
  }

  add(){
    this.myFunctionProvider.nav.push("AddDrPage")
  }

}
