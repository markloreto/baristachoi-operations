import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncPage } from './sync';
import {ProgressBarModule} from "angular-progress-bar"
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    SyncPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncPage),
    ProgressBarModule,
    MyHeaderComponentModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SyncPageModule {}
