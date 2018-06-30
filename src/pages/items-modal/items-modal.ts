import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ItemsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-items-modal',
  templateUrl: 'items-modal.html',
})
export class ItemsModalPage {
  categories: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.categories = navParams.get("products")
    console.log(this.categories)
  }

  updateC(){
    console.log(this.categories)
  }

  submit(){
    this.viewCtrl.dismiss(this.categories);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsModalPage');
  }

}
