import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.myFunctionProvider.syncPull(["product_categories"], true)
  }



}
