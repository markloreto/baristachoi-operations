import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductPage } from './add-product';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    AddProductPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProductPage),
    MyHeaderComponentModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddProductPageModule {}
