var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MyHeaderComponentModule } from './../components/my-header/my-header.module';
import { RegistrationPage } from './../pages/registration/registration';
import { MySideMenuComponent } from './../components/my-side-menu/my-side-menu';
import { DashboardDefaultComponent } from './../components/dashboard-default/dashboard-default';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedModule } from '../shared/shared.module';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpModule } from '@angular/http';
import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundMode } from '@ionic-native/background-mode';
import { MyFunctionProvider } from '../providers/my-function/my-function';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AndroidPermissions } from '@ionic-native/android-permissions';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                HomePage,
                RegistrationPage,
                DashboardDefaultComponent,
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
                HomePage,
                RegistrationPage
            ],
            providers: [
                StatusBar,
                SplashScreen,
                OneSignal,
                BackgroundMode,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                MyFunctionProvider,
                SQLite,
                Network,
                OpenNativeSettings,
                AndroidPermissions
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map