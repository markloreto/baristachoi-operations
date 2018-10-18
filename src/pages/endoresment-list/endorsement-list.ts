import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EndoresmentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-endorsement-list',
  templateUrl: 'endorsement-list.html',
})
export class EndorsementListPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.myFunctionProvider.spinner(false, "")
    this.myFunctionProvider.dbQuery("SELECT * FROM endorsements", []).then((e: any) => {
      console.log("Endorsements", e)
      this.myFunctionProvider.dbQuery("SELECT * FROM endorsement_items", []).then((ei: any) => {
        console.log("Endorsements Items", ei)
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EndoresmentListPage');
  }

  add(){
    this.myFunctionProvider.spinner(true, "Please wait")
    this.navCtrl.push("EndorsementPage")
  }

  menuBtn(e){
    console.log(e)
    if(e.title === "New Endorsement"){
      this.add()
    }
  }

}
