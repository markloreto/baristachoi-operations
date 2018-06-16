import { Component } from '@angular/core';

/**
 * Generated class for the AuthComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'auth',
  templateUrl: 'auth.html'
})
export class AuthComponent {

  text: string;

  constructor() {
    console.log('Hello AuthComponent Component');
    this.text = 'Hello World';
  }

}
