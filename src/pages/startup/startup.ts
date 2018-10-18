import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component, ViewEncapsulation } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {trigger, transition, style, animate, query, stagger} from '@angular/animations';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import swal from 'sweetalert2';
import moment from 'moment';
/**
 * Generated class for the StartupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-startup',
  templateUrl: 'startup.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(100, [
            animate('0.8s', style({ opacity: 0 }))
          ])
        ], {optional: true}),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.8s', style({ opacity: 1 }))
          ])
        ])
      ])
    ])
  ]
})
export class StartupPage {
  step2: any = {
    showNext: true,
    showPrev: true
  };

  step3: any = {
    showSecret: false
  };

  selectedDepot: number = 0
  selectedDepot2: boolean = false
  selectedDepotName: string = ""
  province: string = ''
  municipal: string = ''
  brgy: string = ''
  internetConnection: () => void

  depotList: any = []
  dateTime: string
  dateTimeValue: boolean = true
  interval: any
  passcode: string = "1234"

  isCompleted = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public events: Events,
    public openNativeSettings: OpenNativeSettings,
    private androidPermissions: AndroidPermissions
  ) {
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.READ_SMS, this.androidPermissions.PERMISSION.WRITE_CONTACTS, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);

    console.log(moment().toDate())

    this.internetConnection = () => {
      if(this.depotList.length === 0)
        this.loadList()
    }
    this.events.subscribe("network:connected", this.internetConnection)


    this.myFunctionProvider.checkInternetConnection().then((i:any) => {
      if(i)
        this.loadList()
      else{
        swal({
          type: 'warning',
          title: 'Oops...',
          text: 'Failed to retrieve list of Depot... Please check your internet connection'
        })
      }
    })
  }

  chkDateTime(){
    if(!this.dateTimeValue){
      this.openNativeSettings.open("date").then(() => {
        this.dateTimeValue = true
      })
    }
  }

  loadList(){
    this.myFunctionProvider.spinner(true, "Downloading List...")
    this.myFunctionProvider.APIGet("getDepot").then((data: any) => {
      this.myFunctionProvider.spinner(false, "")
      this.depotList = data.data
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartupPage');
  }

  openAjaxSwal() {
    let self = this
    swal({
      title: 'Key Required',
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      preConfirm: function (key) {
        return new Promise(function (resolve, reject) {
          self.myFunctionProvider.APIGet("checkKey?id=" + self.selectedDepot + "&key=" + key).then((data: any)=>{
            if(data.data){
              resolve()
            }else{
              reject("Wrong Key")
            }
          })
        });
      },
      allowOutsideClick: false
    }).then(function (email) {
      self.selectedDepot2 = true
      swal({
        type: 'success',
        title: 'Correct Key!'
      });
    }).catch((e) => {
      self.selectedDepot = 0
      self.selectedDepot2 = false
      swal.showValidationError(e)
      swal.noop()
    });
  }

  selectDepot(ev){
    console.log(ev)
    if(this.selectedDepot){
      this.selectedDepotName = ev.name
      this.province = ev.province
      this.municipal = ev.municipal
      this.brgy = ev.brgy
      this.openAjaxSwal()
    }
  }

  onStep1Next(event) {
    this.dateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    try{
      clearInterval(this.interval)
    }catch(e){

    }
    this.interval = setInterval(()=>{
      this.dateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    }, 1000)
  }

  onStep2Next(event) {
    console.log(event);
  }

  onStep3Next(event) {
    console.log('Step3 - Next');
  }

  onComplete() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      customClass: 'animated tada',
      confirmButtonText: 'Yes, proceed to login screen!'
    }).then((result) => {
      console.log(result)
      if (result) {
        this.myFunctionProvider.spinner(true, "Building Database")
        this.myFunctionProvider.APIGet("getProductCategories").then((cats: any) => {
          console.log("product categories", cats)
          for(let x in cats.data){
            this.myFunctionProvider.dbQuery("INSERT OR REPLACE INTO product_categories VALUES(?, ?, ?)", [cats.data[x].id, cats.data[x].name, cats.data[x].sequence])
          }

          this.myFunctionProvider.dbQueryBatch([
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [1, "time_in", null]],
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [2, "depot", JSON.stringify({name: this.selectedDepotName, id: this.selectedDepot, province: this.province, municipal: this.municipal, brgy: this.brgy})]],
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [3, "passcode", this.passcode]],
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [4, "logged_staff", null]],
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [5, "accountable_staff", null]],
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [6, "last_push_sync", null]],
            ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [7, "timestamp", this.myFunctionProvider.getTimestamp()]]
          ]).then(() => {

            this.myFunctionProvider.setSettings()
            this.isCompleted = true;
            this.navCtrl.setRoot("LoginPage")
            this.myFunctionProvider.spinner(false, "")
          })

        })
      }
    }).catch(e => {
      this.isCompleted = false;
    })
  }

  onStepChanged(step) {
    console.log('Changed to ' + step.title);
  }

  ionViewWillLeave() {
    this.events.unsubscribe('network:disconnected', this.internetConnection);
  }

}
