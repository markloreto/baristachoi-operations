import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import { IziToastSettings, default as iziToast } from 'izitoast';

/**
 * Generated class for the DisrProductModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disr-product-modal',
  templateUrl: 'disr-product-modal.html',
})
export class DisrProductModalPage {
  title: any
  row: any
  loadEnabled: boolean
  product: any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.row = navParams.get("row")
    this.title = this.row.name + " Details"
    this.loadEnabled = navParams.get("loadEnabled")
    this.product = navParams.get("product")
  }

  submit(){
    if(isNaN(this.row.amount)){
      iziToast.error({
        title: 'Wrong Input',
        message: 'Invalid characted detected',
      });
      return
    }
    if(this.row.price != "")
      this.viewCtrl.dismiss(this.row);
  }

  compute() {
    let r = this.row

    if (r.load !== ""){
      r.load = parseInt(r.load)
      r.total = parseInt(r.load) + parseInt(r.previous)
    }
    if (r.remaining !== "") {
      r.remaining = parseInt(r.remaining)
      r.sold = parseInt(r.total) - r.remaining
      if(r.price !== "")
        r.amount = (parseInt(r.sold) * parseFloat(r.price)).toFixed(2)
    }

    if (r.remaining === "") {
      r.sold = ""
      r.amount = ""
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisrProductModalPage');
  }

}
