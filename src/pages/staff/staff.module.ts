import { PopupMenuComponentModule } from './../../components/popup-menu/popup-menu.module';
import { MyHeaderComponentModule } from './../../components/my-header/my-header.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffPage } from './staff';


@NgModule({
  declarations: [
    StaffPage,
  ],
  imports: [
    IonicPageModule.forChild(StaffPage),
    MyHeaderComponentModule,
    PopupMenuComponentModule,
  ],
})
export class StaffPageModule {}
