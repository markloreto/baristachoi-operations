import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import swal from 'sweetalert2';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  staffs: any = []
  internetConnection: () => void
  loaded: boolean = false
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public events: Events,
    public menuCtrl: MenuController
  ) {
    this.loadList()
    this.internetConnection = () => {
      this.loadList()
    }
    this.events.subscribe("network:connected", this.internetConnection)
    console.log("Settings", this.myFunctionProvider.settings)
  }

  updateStaffs(array){
    this.myFunctionProvider.APIGet("getRoles").then((result: any) => {
      var d = result.data
      var a = []
      for(var x in d){
        a.push(["INSERT OR REPLACE INTO roles (id, name) VALUES (?, ?)", [d[x].id, d[x].display_name]])
      }

      this.myFunctionProvider.dbQueryBatch(a).then((rolesB: any) => {
        console.log("roles batch", rolesB)
        var b = []
        for(var x in array){
          b.push(["INSERT OR REPLACE INTO staffs (id, depot_id, name, photo, thumbnail, role_id, created_at, updated_at, sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [array[x].id, array[x].depot_id, array[x].name, array[x].photo, array[x].thumbnail, array[x].role_id, array[x].created_at, array[x].updated_at, this.myFunctionProvider.getTimestamp()]])
        }
        this.myFunctionProvider.dbQueryBatch(b).then((staffsB: any) => {
          console.log("staff batch", staffsB)
          this.loaded = true
          this.loadList()
        })
      })
    })
  }

  loadList(){
    this.myFunctionProvider.dbQuery("SELECT staffs.*, roles.name AS role_name FROM staffs, roles WHERE staffs.role_id = roles.id", []).then((staffs: any) => {
      console.log("Staffs", staffs)
      this.staffs = staffs

      if(!this.loaded){
        this.myFunctionProvider.checkInternetConnection().then((i:any) => {
          if(i){
            if(!staffs.length)
              this.myFunctionProvider.spinner(true, "Retrieving List...")
            this.myFunctionProvider.APIGet("staff").then((result: any) => {
              console.log(result)
              if(!staffs.length)
                this.myFunctionProvider.spinner(false, "")
              if(result.data.length)
                this.updateStaffs(result.data)
            })
          }
          else{
            if(!staffs.length)
              swal({
                type: 'warning',
                title: 'Oops...',
                text: 'Failed to retrieve the list... Please check your internet connection'
              })
          }
        })
      }

    })
  }

  login(staff){
    let self = this
    swal({
      title: 'Password',
      text: "Please provide password for " + staff.name,
      input: 'password',
      showCancelButton: true,
      customClass: 'animated tada',
      confirmButtonText: 'Logged me in!',
      preConfirm: function (password) {
        return new Promise(function (resolve, reject) {
          if(password != self.myFunctionProvider.settings.passcode){
            reject("Wrong Password!")
          }else{
            resolve()
          }
        });
      },
      allowOutsideClick: false
    }).then((password) => {
      console.log(password)
      this.myFunctionProvider.spinner(true, "")

      this.myFunctionProvider.dbQuery("SELECT data FROM settings WHERE id = 5", []).then((as: any) => {
        //todo: accountanble staff
        this.myFunctionProvider.dbQueryBatch([
          ["UPDATE settings SET data = ? WHERE id = ?", [staff.id, 4]],
          ["UPDATE settings SET data = ? WHERE id = ?", [staff.id, 5]]
        ]).then(() => {
          this.menuCtrl.swipeEnable(true)
          this.navCtrl.setRoot("HomePage")

          this.myFunctionProvider.setSettings().then((settings: any) => {
            this.events.publish("staff:login", settings)
          })
          setTimeout(()=>{
            this.myFunctionProvider.spinner(false, "")
          }, 500)

        })
      })
    }).catch(e => {

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillLeave() {
    this.events.unsubscribe('network:disconnected', this.internetConnection);
  }

}
