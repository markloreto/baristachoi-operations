import { MyHeaderComponentModule } from './../components/my-header/my-header.module';
import { RegistrationPage } from './../pages/registration/registration';
import { MySideMenuComponent } from './../components/my-side-menu/my-side-menu';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClickOutsideModule} from 'ng-click-outside';
import {SharedModule} from '../shared/shared.module';

import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundMode } from '@ionic-native/background-mode';
import { MyFunctionProvider } from '../providers/my-function/my-function';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { ImageResizer } from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Deeplinks } from '@ionic-native/deeplinks';

@NgModule({
  declarations: [
    MyApp,
    RegistrationPage,
    MySideMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    ClickOutsideModule,
    SharedModule,
    MyHeaderComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegistrationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MyFunctionProvider,
    SQLite,
    Network,
    OpenNativeSettings,
    AndroidPermissions,
    Camera,
    ImageResizer,
    File,
    FileChooser,
    PhotoViewer,
    Deeplinks
  ]
})
export class AppModule {}
