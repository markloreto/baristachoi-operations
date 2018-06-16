import { Component } from '@angular/core';

/**
 * Generated class for the TitleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'title',
  templateUrl: 'title.html'
})
export class TitleComponent {

  text: string;

  constructor() {
    console.log('Hello TitleComponent Component');
    this.text = 'Hello World';
  }

}
