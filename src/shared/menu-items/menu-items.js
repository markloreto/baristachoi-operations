var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
var MENUITEMS = [
    {
        label: 'Navigation',
        main: [
            {
                state: 'dashboard',
                short_label: 'D',
                name: 'Dashboard',
                type: 'link',
                icon: 'ti-home'
            },
            {
                state: 'basic',
                short_label: 'B',
                name: 'Basic Components',
                type: 'sub',
                icon: 'ti-layout-grid2-alt',
                children: [
                    {
                        state: 'button',
                        name: 'Button'
                    },
                    {
                        state: 'typography',
                        name: 'Typography'
                    }
                ]
            },
            {
                state: 'notifications',
                short_label: 'n',
                name: 'Notifications',
                type: 'link',
                icon: 'ti-crown'
            },
        ],
    },
    {
        label: 'Tables',
        main: [
            {
                state: 'bootstrap-table',
                short_label: 'B',
                name: 'Bootstrap Table',
                type: 'link',
                icon: 'ti-receipt'
            }
        ]
    },
    {
        label: 'Map And Extra Pages ',
        main: [
            {
                state: 'map',
                short_label: 'M',
                name: 'Maps',
                type: 'link',
                icon: 'ti-map-alt'
            },
            {
                state: 'authentication',
                short_label: 'A',
                name: 'Authentication',
                type: 'sub',
                icon: 'ti-id-badge',
                children: [
                    {
                        state: 'login',
                        type: 'link',
                        name: 'Login',
                        target: true
                    }, {
                        state: 'registration',
                        type: 'link',
                        name: 'Registration',
                        target: true
                    }
                ]
            },
            {
                state: 'error',
                external: 'http://lite.codedthemes.com/guru-able/error.html',
                name: 'Error',
                type: 'external',
                icon: 'ti-layout-list-post',
                target: true
            },
            {
                state: 'user',
                short_label: 'U',
                name: 'User Profile',
                type: 'link',
                icon: 'ti-user'
            }
        ]
    },
    {
        label: 'Other',
        main: [
            {
                state: '',
                short_label: 'M',
                name: 'Menu Levels',
                type: 'sub',
                icon: 'ti-direction-alt',
                children: [
                    {
                        state: '',
                        name: 'Menu Level 2.1',
                        target: true
                    }, {
                        state: '',
                        name: 'Menu Level 2.2',
                        type: 'sub',
                        children: [
                            {
                                state: '',
                                name: 'Menu Level 2.2.1',
                                target: true
                            },
                            {
                                state: '',
                                name: 'Menu Level 2.2.2',
                                target: true
                            }
                        ]
                    }, {
                        state: '',
                        name: 'Menu Level 2.3',
                        target: true
                    }, {
                        state: '',
                        name: 'Menu Level 2.4',
                        type: 'sub',
                        children: [
                            {
                                state: '',
                                name: 'Menu Level 2.4.1',
                                target: true
                            },
                            {
                                state: '',
                                name: 'Menu Level 2.4.2',
                                target: true
                            }
                        ]
                    }
                ]
            },
            {
                state: 'simple-page',
                short_label: 'S',
                name: 'Simple Page',
                type: 'link',
                icon: 'ti-layout-sidebar-left'
            }
        ]
    }, {
        label: 'Support',
        main: [
            {
                state: 'Upgrade To Pro',
                short_label: 'U',
                external: 'https://codedthemes.com/item/guru-able-admin-template/',
                name: 'Upgrade To Pro',
                type: 'external',
                icon: 'ti-layout-list-post',
                target: true
            }
        ]
    }
];
var MenuItems = /** @class */ (function () {
    function MenuItems() {
    }
    MenuItems.prototype.getAll = function () {
        return MENUITEMS;
    };
    MenuItems = __decorate([
        Injectable()
    ], MenuItems);
    return MenuItems;
}());
export { MenuItems };
//# sourceMappingURL=menu-items.js.map