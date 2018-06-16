var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Input, Inject, ViewEncapsulation } from '@angular/core';
import { Spinkit } from './spinkits';
import { DOCUMENT } from '@angular/common';
var SpinnerComponent = /** @class */ (function () {
    function SpinnerComponent(document) {
        this.document = document;
        this.isSpinnerVisible = true;
        this._message = "";
        this._visible = false;
        this.Spinkit = Spinkit;
        this.backgroundColor = 'rgba(0, 115, 170, 0.69)';
        this.spinner = Spinkit.skWave;
        this.isSpinnerVisible = this._visible;
    }
    Object.defineProperty(SpinnerComponent.prototype, "visible", {
        set: function (visible) {
            this._visible = visible;
            this.isSpinnerVisible = visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpinnerComponent.prototype, "message", {
        get: function () { return this._message; },
        set: function (message) {
            this._message = message;
        },
        enumerable: true,
        configurable: true
    });
    SpinnerComponent.prototype.ngOnDestroy = function () {
        this.isSpinnerVisible = this._visible;
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], SpinnerComponent.prototype, "visible", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SpinnerComponent.prototype, "message", null);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], SpinnerComponent.prototype, "backgroundColor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], SpinnerComponent.prototype, "spinner", void 0);
    SpinnerComponent = __decorate([
        Component({
            selector: 'app-spinner',
            templateUrl: './spinner.component.html',
            encapsulation: ViewEncapsulation.None
        }),
        __param(0, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [Document])
    ], SpinnerComponent);
    return SpinnerComponent;
}());
export { SpinnerComponent };
//# sourceMappingURL=spinner.component.js.map