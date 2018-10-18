import { SynchronizeProvider } from './../../providers/synchronize/synchronize';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyFunctionProvider } from '../../providers/my-function/my-function';

/**
 * Generated class for the MyHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-header',
  templateUrl: 'my-header.html'
})
export class MyHeaderComponent {
  @Input() menuEnable: boolean = true
  @Input() title: string = ""
  @Input() headerColor: string = "primary"
  @Input() btn1: any = {enable: false, title: "", color: "secondary", icon: "options"}
  @Input() btn2: any = {enable: false, title: "", color: "secondary", icon: "options"}
  @Output() btn1OnPush = new EventEmitter<any>();
  @Output() btn2OnPush = new EventEmitter<any>();

  btn1Attr: string = ""
  synching: boolean = false
  constructor(
    public myF: MyFunctionProvider,
    public synchronizeProvider: SynchronizeProvider
  ) {
    console.log('Hello MyHeaderComponent Component');
    this.synching = this.myF.synching
  }

  button1Click(){
    this.btn1OnPush.emit()
  }

  button2Click(){
    this.btn2OnPush.emit()
  }

  sync(){
    this.synchronizeProvider.synching = true
    this.myF.dbQuery("SELECT * FROM update_sync", []).then((us: any) => {
      console.log("Update Sync", us)
      this.myF.nativeStorage.getItem('firstPush')
      .then(
        data => {
          if(data == null){
            this.synchronizeProvider.pushAllQ = true
          }

          this.synchronizeProvider.continous = true
          this.synchronizeProvider.syncPull(["staffs", "roles", "products", "product_categories", "measurement_units", "attachments", "delivery_receipts", "inventories", "modules", "endorsements", "endorsement_items", "disrs"], false)
        }
      );
    })
  }

}
