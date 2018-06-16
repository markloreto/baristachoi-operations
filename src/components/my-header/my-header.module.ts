import { MyHeaderComponent } from './my-header';
// music-card module
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [MyHeaderComponent],
  imports: [IonicModule],
  exports: [MyHeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MyHeaderComponentModule { }