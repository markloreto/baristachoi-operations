import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffAddPage } from './staff-add';
import { FormioModule } from 'angular-formio';
import { MyHeaderComponentModule } from './../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    StaffAddPage,
  ],
  imports: [
    IonicPageModule.forChild(StaffAddPage),
    FormioModule,
    MyHeaderComponentModule
  ],
})
export class StaffAddPageModule {}
