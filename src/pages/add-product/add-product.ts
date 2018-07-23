import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment'
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
  category: any
  categories: any = []
  measurement_units: any = []
  photo: any = ""
  thumbnail: any = ""
  image: any
  shared: boolean = false
  catName: string = ""
  myForm: FormGroup;
  submitAttempt: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder
  ) {

    this.myForm = formBuilder.group({
      pName: ['', Validators.required],
      measurement_unit: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      pack: ['', Validators.required],
      sku: [''],
      category: [''],
    });
    this.loadPhoto()
    this.category = (navParams.get("id")) ? navParams.get("id") : null

    this.catSelected()
    this.myFunctionProvider.dbQuery("SELECT * FROM product_categories ORDER BY sequence", []).then((categories: any) => {
      this.categories = categories
      this.myForm.controls.category.setValue(navParams.get("id"))
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
      console.log("Photo Data", photoData)
      this.photo = photoData.photo
      this.thumbnail = photoData.thumbnail
      this.loadPhoto()
    })
  }

  loadPhoto(){
    this.image = (!this.photo) ? "assets/images/bc5.jpg" : this.myFunctionProvider.sanitize(this.photo)
  }

  catSelected(){
    this.myFunctionProvider.dbQuery("SELECT name FROM product_categories WHERE id = ?", [this.category]).then((cat: any) => {
      if(cat.length)
        this.catName = cat[0].name
    })
  }

  submit(){
    this.submitAttempt = true;
    if(!this.myForm.valid)
      return
    let fc = this.myForm.controls
    let genSKU = fc.sku.value
    if(fc.sku.value == ""){
      let l3 = this.catName.slice(0, 3).toUpperCase()
      console.log(l3)
      genSKU = l3 + moment().format("x")
      console.log(genSKU)
    }

    console.log(this.myForm)
    this.myFunctionProvider.spinner(true, "Please wait")
    this.myFunctionProvider.dbQuery("INSERT OR REPLACE INTO products (id, name, photo, thumbnail, category, cost, price, author, measurement_unit, shareable, sku, sequence, pack, sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [this.myFunctionProvider.getTimestamp(), fc.pName.value, this.photo, this.thumbnail, fc.category.value, fc.cost.value, fc.price.value, this.myFunctionProvider.getSettings("logged_staff"), fc.measurement_unit.value, (this.shared) ? null : this.myFunctionProvider.settings.depot.id, genSKU, 0, parseInt(fc.pack.value), null]).then(() => {
      this.myFunctionProvider.presentToast("New product saved", "my-success")
      this.myFunctionProvider.spinner(false, "")
      this.navCtrl.pop()
    })

  }

  isValid(field){
    return !this.myForm.controls[field].valid && (!!this.myForm.controls[field].dirty || this.submitAttempt)
  }

  uploadPhoto(){
    this.myFunctionProvider.fileChooser.open().then(uri => {
      this.myFunctionProvider.imageProcess(uri).then((photoData: any) => {
        this.photo = photoData.photo
        this.thumbnail = photoData.thumbnail
        this.loadPhoto()
      })
    }).catch(e => console.log(e));
  }

}
