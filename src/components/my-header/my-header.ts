import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  constructor() {
    console.log('Hello MyHeaderComponent Component');

  }

  button1Click(){
    this.btn1OnPush.emit()
  }

  button2Click(){
    this.btn2OnPush.emit()
  }

}
