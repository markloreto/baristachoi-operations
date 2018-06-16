import { Component } from '@angular/core';

/**
 * Generated class for the BreadBreadcrumbsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bread-breadcrumbs',
  templateUrl: 'bread-breadcrumbs.html'
})
export class BreadBreadcrumbsComponent {

  text: string;

  constructor() {
    console.log('Hello BreadBreadcrumbsComponent Component');
    this.text = 'Hello World';
  }

}
