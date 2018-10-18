import { MyHeaderComponentModule } from './../../components/my-header/my-header.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    MyHeaderComponentModule
  ],
})
export class SettingsPageModule {}
