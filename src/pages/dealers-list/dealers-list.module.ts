import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealersListPage } from './dealers-list';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    DealersListPage,
  ],
  imports: [
    IonicPageModule.forChild(DealersListPage),
    MyHeaderComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DealersListPageModule {}
