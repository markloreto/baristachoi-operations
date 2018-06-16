import {Component, Input, OnDestroy, Inject, ViewEncapsulation} from '@angular/core';
import {Spinkit} from './spinkits';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
    public isSpinnerVisible = true;
    private _message = ""
    private _visible = false;
    public Spinkit = Spinkit;
    @Input()
    set visible(visible: boolean) {
        this._visible = visible
        this.isSpinnerVisible = visible
    }

    @Input()
    set message(message: string) {
        this._message = message
    }

    get message(): string { return this._message; }

    @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';
    @Input() public spinner = Spinkit.skWave;

    constructor(
      @Inject(DOCUMENT) private document: Document
    ) {
        this.isSpinnerVisible = this._visible;
    }

    ngOnDestroy(): void {
        this.isSpinnerVisible = this._visible;
    }
}
