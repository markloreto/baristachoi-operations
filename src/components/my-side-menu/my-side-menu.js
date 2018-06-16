var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from './../../shared/menu-items/menu-items';
/**
 * Generated class for the MySideMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var MySideMenuComponent = /** @class */ (function () {
    function MySideMenuComponent(menuItems, events, myFunctionProvider) {
        var _this = this;
        this.menuItems = menuItems;
        this.events = events;
        this.myFunctionProvider = myFunctionProvider;
        this.events.subscribe("staff:login", function (settings) {
            _this.loadIt(settings);
        });
        this.navType = 'st2';
        this.themeLayout = 'vertical';
        this.vNavigationView = 'view1';
        this.verticalPlacement = 'left';
        this.verticalLayout = 'wide';
        this.deviceType = 'desktop';
        this.verticalNavType = 'expanded';
        this.verticalEffect = 'shrink';
        this.pcodedHeaderPosition = 'fixed';
        this.pcodedSidebarPosition = 'fixed';
        this.navBarTheme = 'themelight1';
        this.activeItemTheme = 'theme4';
        this.isCollapsedSideBar = 'no-block';
        this.menuTitleTheme = 'theme5';
        this.itemBorder = true;
        this.itemBorderStyle = 'none';
        this.subItemBorder = true;
        this.subItemIcon = 'style6';
        this.dropDownIcon = 'style1';
        this.isSidebarChecked = true;
        this.isHeaderChecked = true;
        var scrollHeight = window.screen.height - 150;
        this.innerHeight = scrollHeight + 'px';
        this.windowWidth = window.innerWidth;
        this.setMenuAttributes(this.windowWidth);
        this.loadIt(this.myFunctionProvider.settings);
    }
    MySideMenuComponent.prototype.loadIt = function (settings) {
        var _this = this;
        this.myFunctionProvider.dbQuery("SELECT staffs.*, roles.name AS role_name FROM staffs, roles WHERE staffs.id = ? AND roles.id = staffs.role_id", [settings.logged_staff]).then(function (staff) {
            console.log("Logged User", staff);
            _this.staff = staff[0];
        });
    };
    MySideMenuComponent.prototype.onResize = function (event) {
        this.innerHeight = event.target.innerHeight + 'px';
        /* menu responsive */
        this.windowWidth = event.target.innerWidth;
        var reSizeFlag = true;
        if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
            reSizeFlag = false;
        }
        else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
            reSizeFlag = false;
        }
        /* for check device */
        if (reSizeFlag) {
            this.setMenuAttributes(this.windowWidth);
        }
    };
    MySideMenuComponent.prototype.setMenuAttributes = function (windowWidth) {
        if (windowWidth >= 768 && windowWidth <= 1024) {
            this.deviceType = 'tablet';
            this.verticalNavType = 'offcanvas';
            this.verticalEffect = 'push';
        }
        else if (windowWidth < 768) {
            this.deviceType = 'mobile';
            this.verticalNavType = 'offcanvas';
            this.verticalEffect = 'overlay';
        }
        else {
            this.deviceType = 'desktop';
            this.verticalNavType = 'expanded';
            this.verticalEffect = 'shrink';
        }
    };
    MySideMenuComponent.prototype.toggleOpenedSidebar = function () {
        this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
    };
    MySideMenuComponent.prototype.logout = function () {
        this.events.publish("staff:logout");
    };
    MySideMenuComponent = __decorate([
        Component({
            selector: 'my-side-menu',
            templateUrl: 'my-side-menu.html',
            animations: [
                trigger('mobileMenuTop', [
                    state('no-block, void', style({
                        overflow: 'hidden',
                        height: '0px',
                    })),
                    state('yes-block', style({
                        height: AUTO_STYLE,
                    })),
                    transition('no-block <=> yes-block', [
                        animate('400ms ease-in-out')
                    ])
                ]),
                trigger('fadeInOutTranslate', [
                    transition(':enter', [
                        style({ opacity: 0 }),
                        animate('400ms ease-in-out', style({ opacity: 1 }))
                    ]),
                    transition(':leave', [
                        style({ transform: 'translate(0)' }),
                        animate('400ms ease-in-out', style({ opacity: 0 }))
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [MenuItems,
            Events,
            MyFunctionProvider])
    ], MySideMenuComponent);
    return MySideMenuComponent;
}());
export { MySideMenuComponent };
//# sourceMappingURL=my-side-menu.js.map