import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staff',
  templateUrl: 'staff.html',
})
export class StaffPage {
  staffs: any = []
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.myFunctionProvider.spinner(false, "")

  }

  loadIt() {
    this.staffs = []
    this.myFunctionProvider.dbQuery("SELECT s.id, s.name, s.thumbnail, r.display_name FROM staffs s INNER JOIN roles r ON r.id = s.role_id ORDER BY s.name ASC", []).then((s: any) => {
      console.log("staffs", s)
      this.staffs = s
    })
  }

  edit(u){
    console.log(u)
    this.myFunctionProvider.spinner(true, "Retrieving User Data")
    this.myFunctionProvider.dbQuery("SELECT * FROM staffs WHERE id = ?", [u.id]).then((user: any) => {
      this.myFunctionProvider.spinner(false, "")
      this.navCtrl.push("StaffAddPage", {modify: true, user: user[0]})
    })
  }

  ionViewDidEnter() {
    this.loadIt()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffPage');
  }

  menuBtn(e) {
    if(e.title === "New Staff"){
      this.navCtrl.push("StaffAddPage", {modify: false})
    }
  }

}
