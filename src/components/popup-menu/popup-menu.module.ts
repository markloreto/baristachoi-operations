import { PopupMenuComponent } from './popup-menu';
// music-card module
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [PopupMenuComponent],
  imports: [IonicModule],
  exports: [PopupMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PopupMenuComponentModule { }
