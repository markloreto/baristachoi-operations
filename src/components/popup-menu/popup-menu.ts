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
  constructor() {
    console.log('Hello PopupMenuComponent Component');

  }

  myBtn(btn){
    this.btnPush.emit(btn)
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }
  goToAccount() {
    alert('Account clicked.');
    this.togglePopupMenu();
  }
  goToHome() {
    alert('Home clicked.');
    this.togglePopupMenu();
  }
  goToCups() {
    alert('Cups clicked.');
    this.togglePopupMenu();
  }
  goToLeaderboard() {
    alert('Leaderboard clicked.');
    this.togglePopupMenu();
  }
  goToHelp() {
    alert('Help clicked.');
    this.togglePopupMenu();
  }
  goToShop() {
    alert('Shop clicked.');
    this.togglePopupMenu();
  }

}
