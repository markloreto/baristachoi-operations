import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsModalPage } from './items-modal';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    ItemsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemsModalPage),
    MyHeaderComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemsModalPageModule {}
