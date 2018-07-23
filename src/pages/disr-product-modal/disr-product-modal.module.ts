import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisrProductModalPage } from './disr-product-modal';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    DisrProductModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DisrProductModalPage),
    MyHeaderComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DisrProductModalPageModule {}
