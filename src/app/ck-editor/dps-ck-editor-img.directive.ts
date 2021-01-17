import { Directive, OnInit, Input, EventEmitter, NgZone, OnChanges, HostListener, } from '@angular/core';
import { InstanceRef } from './instance-ref';

@Directive({
    selector: '[dpsCkEditorImg]'
})
export class DpsCkEditorImgDirective implements OnInit, OnChanges {

    @Input() dpsCkEditorImg: string;
    ckEditor: any;

    constructor(private ref: InstanceRef, private zone: NgZone) {
    }

    ngOnChanges() {
        if (this.ckEditor) {
            this.changeImgStyle(this.ckEditor);
        }
    }

    ngOnInit(): void {
        const subscription = this.ref.ready().subscribe((editor) => {
            this.changeImgStyle(editor);
            this.ckEditor = editor;
            subscription.unsubscribe();
        });
    }

    // This method will set the width and hight as attributes of the images in the CK Editor HTML content,
    // if dimension figures are found on the CSS styles, it will be used to propagate those attributes.
    changeImgStyle(editor) {
        // Collect all the images in the body
        const imgList = editor.document.getElementsByTag('img');
        if (imgList && imgList.$.length > 0) {
            for (let i = 0; i < imgList.$.length; i++) {
                if (imgList.$[i].style.height === '') {
                    // Style class not found
                    if (imgList.$[i].height === '') {
                        // Element width height not found
                        imgList.$[i].width = 85;
                        imgList.$[i].height = 85;
                    } else {
                        // Element width height found
                        imgList.$[i].width = imgList.$[i].width;
                        imgList.$[i].height = imgList.$[i].height;
                    }
                } else {
                    // Style class found
                    if (imgList.$[i].height === '') {
                        // Element width height not found
                        imgList.$[i].width = imgList.$[i].style.width;
                        imgList.$[i].height = imgList.$[i].style.height;
                    } else {
                        // Element width height found
                        imgList.$[i].width = imgList.$[i].width;
                        imgList.$[i].height = imgList.$[i].height;
                    }
                }
            }

            // KR: This will trigger the bold button on the CK Editor tool-bar as we need to fire up a click event,
            // in order to update the content in the state. Since there are two bold commands would have executed,
            // there will be no effect on the existing content or content which is being added/updated.
            editor.execCommand('bold');
            editor.execCommand('bold');
        }
    }
}
