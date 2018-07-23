import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.row = navParams.get("row")
    this.title = this.row.name + " Details"
  }

  submit(){
    if(this.row.price != "")
      this.viewCtrl.dismiss(this.row);
  }

  compute() {
    let r = this.row
    if (r.load !== "")
      r.total = parseInt(r.load) + parseInt(r.previous)
    if (r.remaining !== "") {
      r.remaining = parseInt(r.remaining)
      r.sold = parseInt(r.total) - r.remaining
      if(r.price !== "")
        r.amount = parseInt(r.sold) * parseFloat(r.price)
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
