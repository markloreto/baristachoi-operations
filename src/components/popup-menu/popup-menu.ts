import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the PopupMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popup-menu',
  templateUrl: 'popup-menu.html'
})
export class PopupMenuComponent {
  openMenu = false;
  @Input() btns: any = []
  @Output() btnPush = new EventEmitter<any>();
  @Output() menuOpen = new EventEmitter<any>();
  @Output() menuClose = new EventEmitter<any>();
  constructor() {
    console.log('Hello PopupMenuComponent Component');

  }

  myBtn(btn){
    this.togglePopupMenu()
    this.btnPush.emit(btn)
  }

  togglePopupMenu() {
    this.openMenu = !this.openMenu
    if(this.openMenu)
      this.menuOpen.emit(null)
    else
      this.menuClose.emit(null)
    return this.openMenu;
  }


}
