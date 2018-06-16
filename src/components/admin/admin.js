var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from '../../shared/menu-items/menu-items';
var AdminComponent = /** @class */ (function () {
    /*  @ViewChild('toggleButton') toggle_button: ElementRef;
      @ViewChild('sideMenu') side_menu: ElementRef;*/
    function AdminComponent(menuItems) {
        this.menuItems = menuItems;
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
        this.headerTheme = 'theme1';
        this.logoTheme = 'theme1';
        this.toggleOn = true;
        this.headerFixedMargin = '80px';
        this.navBarTheme = 'themelight1';
        this.activeItemTheme = 'theme4';
        this.isCollapsedMobile = 'no-block';
        this.isCollapsedSideBar = 'no-block';
        this.chatToggle = 'out';
        this.chatToggleInverse = 'in';
        this.chatInnerToggle = 'off';
        this.chatInnerToggleInverse = 'on';
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
    }
    AdminComponent.prototype.ngOnInit = function () {
    };
    AdminComponent.prototype.onResize = function (event) {
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
    AdminComponent.prototype.setMenuAttributes = function (windowWidth) {
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
    AdminComponent.prototype.toggleOpened = function () {
        if (this.windowWidth < 768) {
            this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
        }
        this.toggleOn = true;
        this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
    };
    AdminComponent.prototype.onClickedOutside = function (e) {
        if (this.windowWidth < 768 && this.toggleOn && this.verticalNavType !== 'offcanvas') {
            this.toggleOn = true;
            this.verticalNavType = 'offcanvas';
        }
    };
    AdminComponent.prototype.onMobileMenu = function () {
        this.isCollapsedMobile = this.isCollapsedMobile === 'yes-block' ? 'no-block' : 'yes-block';
    };
    AdminComponent.prototype.toggleOpenedSidebar = function () {
        this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
    };
    __decorate([
        ViewChild('searchFriends'),
        __metadata("design:type", ElementRef)
    ], AdminComponent.prototype, "search_friends", void 0);
    AdminComponent = __decorate([
        Component({
            selector: 'admin',
            templateUrl: './admin.html',
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
        __metadata("design:paramtypes", [MenuItems])
    ], AdminComponent);
    return AdminComponent;
}());
export { AdminComponent };
//# sourceMappingURL=admin.js.map