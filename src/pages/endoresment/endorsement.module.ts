import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndorsementPage } from './endorsement';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    EndorsementPage,
  ],
  imports: [
    IonicPageModule.forChild(EndorsementPage),
    MyHeaderComponentModule
  ],
})
export class EndorsementPageModule {}
