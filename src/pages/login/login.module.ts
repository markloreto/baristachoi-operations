import { PopupMenuComponentModule } from './../../components/popup-menu/popup-menu.module';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';

@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    MyHeaderComponentModule,
    PopupMenuComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPageModule {}
