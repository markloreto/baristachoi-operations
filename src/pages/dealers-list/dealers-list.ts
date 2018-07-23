import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DealersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealers-list',
  templateUrl: 'dealers-list.html',
})
export class DealersListPage {
  staffs: any = []
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.staffs = navParams.get("staffs")
  }

  select(staff){
    this.viewCtrl.dismiss(staff);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealersListPage');
  }

}
