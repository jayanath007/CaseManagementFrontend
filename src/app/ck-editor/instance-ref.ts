import { filter } from 'rxjs/operators';
import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
declare var CKEDITOR: any;

@Injectable()
export class InstanceRef implements OnDestroy {
    private instance;
    private readySubject = new BehaviorSubject(null);
    private createdSubject = new BehaviorSubject(null);

    public change = new EventEmitter();
    public blur = new EventEmitter();
    public focus = new EventEmitter();
    public valueWriteSubject = new Subject<string>();
    public iniitalValue = null;
    public isSetData = false;

    constructor() {

    }


    destroy() {
        if (this.instance) {
            try {
                this.instance.removeAllListeners();
                CKEDITOR.instances[this.instance.name].destroy();
                this.instance.destroy();
                this.instance = null;
                this.readySubject.complete();
                this.instance = null;
            } catch (e) { }

        }
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    createInstance(element: Element, config = {}) {
        this.instance = CKEDITOR.replace(element, config || {});
        this.createdSubject.next(this.instance);
        this.instance.on('instanceReady', () => {
            if (this.iniitalValue) {
                this.setData(this.iniitalValue);
                this.iniitalValue = null;
            }
            this.readySubject.next(this.instance);
        });
        return this.ready();
    }

    setData(value) {
        if (this.instance && this.instance.instanceReady) {
            this.isSetData = true;
            this.instance.setData(value);
            this.valueWriteSubject.next(value);
        } else if (value) {
            this.iniitalValue = value;
        }
    }

    public valueWrite() {
        return this.valueWriteSubject;
    }

    public ready() {
        return this.readySubject.pipe(filter(instance => instance !== null));
    }
    public created() {
        return this.createdSubject.pipe(filter(instance => instance !== null));
    }
    public readOnly(isReadOnly: boolean) {
        if (this.instance) {
            this.instance.setReadOnly(!!isReadOnly);
        }
    }
    public editorFocus() {
        if (this.instance) {
            this.instance.focus();
        }
    }
}
