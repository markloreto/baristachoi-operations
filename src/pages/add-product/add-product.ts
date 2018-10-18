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
  starred: boolean = false
  catName: string = ""
  myForm: FormGroup;
  submitAttempt: boolean = false;
  id: number
  title: string
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder
  ) {
    this.myFunctionProvider.spinner(false, "")

    this.id = (navParams.get("id")) ? navParams.get("id") : null

    this.category = (navParams.get("cat_id")) ? navParams.get("cat_id") : null
    this.myForm = formBuilder.group({
      pName: ['', Validators.required],
      measurement_unit: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      pack: ['', Validators.required],
      sku: [''],
      category: [''],
    });

    if(this.id){
      let fc = this.myForm.controls
      this.myFunctionProvider.getProducts(null, this.id, true).then((products: any) => {

        let p = products[0]
        this.title = "Modify " + p.product_name
        fc.pName.setValue(p.product_name)
        fc.measurement_unit.setValue(p.unit_id)
        fc.cost.setValue(p.product_cost)
        fc.price.setValue(p.product_price)
        fc.sku.setValue(p.product_sku)
        fc.pack.setValue(p.product_pack)
        this.photo = p.product_photo
        this.thumbnail = p.product_thumbnail
        this.starred = (p.product_star) ? true : false
        this.shared = (p.product_shareable === this.myFunctionProvider.settings.depot.id) ? false : (p.product_shareable === null) ? true : false
        this.loadPhoto()
      })
    }else{
      this.title = "Add New Products"
      this.loadPhoto()
    }


    this.myFunctionProvider.dbQuery("SELECT * FROM product_categories ORDER BY sequence", []).then((categories: any) => {
      this.categories = categories
      this.myForm.controls.category.setValue(navParams.get("cat_id"))
      this.catSelected()
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
      genSKU = l3 + moment().format("X")
      console.log(genSKU)
    }

    console.log(this.myForm)
    this.myFunctionProvider.spinner(true, "Please wait")
    if(this.id){
      this.myFunctionProvider.dbQuery("UPDATE products SET name = ?, photo = ?, thumbnail = ?, category = ?, cost = ?, price = ?, measurement_unit = ?, shareable = ?, sku = ?, pack = ?, sync = ?, star = ? WHERE id = ?", [fc.pName.value, this.photo, this.thumbnail, fc.category.value, fc.cost.value, fc.price.value, fc.measurement_unit.value, (this.shared) ? null : this.myFunctionProvider.settings.depot.id, genSKU, parseInt(fc.pack.value), null, (this.starred) ? 1 : null, this.id]).then(() => {
        this.myFunctionProvider.presentToast(fc.pName.value + " is now updated", "my-success")
        this.myFunctionProvider.spinner(false, "")

        this.navCtrl.pop()
        this.myFunctionProvider.scanUpdates(["products"])
      })
    }else{
      this.myFunctionProvider.dbQuery("INSERT OR REPLACE INTO products (id, name, photo, thumbnail, category, cost, price, author, measurement_unit, shareable, sku, sequence, pack, sync, star) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [this.myFunctionProvider.getTimestamp(), fc.pName.value, this.photo, this.thumbnail, fc.category.value, fc.cost.value, fc.price.value, this.myFunctionProvider.getSettings("logged_staff"), fc.measurement_unit.value, (this.shared) ? null : this.myFunctionProvider.settings.depot.id, genSKU, 0, parseInt(fc.pack.value), null, (this.starred) ? 1 : null]).then((id: any) => {
        this.myFunctionProvider.presentToast("New product saved", "my-success")
        this.myFunctionProvider.spinner(false, "")
        this.myFunctionProvider.scanUpdates(["products"])
        this.navCtrl.pop()
      })
    }
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
