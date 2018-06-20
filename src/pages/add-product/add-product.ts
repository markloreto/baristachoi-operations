import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the AddProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {
  segment: string = "details"
  name: string = ""
  cost: number
  price: number
  sku: string = ""
  category: any
  measurement_unit: any
  categories: any = []
  measurement_units: any = []
  photo: any = ""
  thumbnail: any
  image: any
  shared: boolean = false
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.loadPhoto()
    this.category = (navParams.get("id")) ? navParams.get("id") : null
    this.myFunctionProvider.dbQuery("SELECT * FROM product_categories ORDER BY sequence", []).then((categories: any) => {
      this.categories = categories
    })

    this.myFunctionProvider.dbQuery("SELECT * FROM measurement_units", []).then((mu: any) => {
      this.measurement_units = mu
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProductPage');
  }

  takePhoto(){
    this.myFunctionProvider.takePicture().then((photoData: any) => {
      this.photo = photoData.photo
      this.thumbnail = photoData.thumbnail
      this.loadPhoto()
    })
  }

  loadPhoto(){
    this.image = (!this.photo) ? "assets/images/bc5.jpg" : this.myFunctionProvider.sanitize(this.photo)
  }

  submit(){
    if(this.sku == ""){
      //this.myFunctionProvider.dbQuery("SELECT sku FROM products WHERE sku LIKE '%%'")
    }
  }

}
