import { Directive, OnInit, Input  } from '@angular/core';
import { InstanceRef } from './instance-ref';


@Directive({
  selector: '[dpsCkSignature]'
})
export class DpsCkSignatureDirective implements OnInit {
 // @ViewChild('ckeditor') ckeditor: any;
 // @ViewChild('one') d1: ElementRef;

  @Input() dpsCkSignature: string;
 // @Input() targetId;
  //  @Input('inline') inline: boolean;
  // @Input('config') config: any;



  constructor(private ref: InstanceRef) {

    // this.editor = window['CKEDITOR']['replace'](targetId);
    // if (this.inline === true) {
    //   this.editor = window['CKEDITOR'].inline(element[0], this.config || {});
    // } else {
    //   this.editor = window['CKEDITOR'].replace(element[0], this.config || {});
    // }
    // tslint:disable-next-line:no-debugger
    // this.editor = window['CKEDITOR'].instances;
    // this.editor = window['CKEDITOR']['replace'](this.targetId);
    // this.dpsCkSignature1();
  }



  // ngAfterViewInit() {
  //  // this.editor = window['CKEDITOR'].instances.editor1;
  //  //  this.addSignature(window['CKEDITOR'].instances.editor1, this.dpsCkSignature);
  // }

  ngOnInit(): void {
    const subscription = this.ref.created().subscribe((editor) => {
      this.addSignature(editor, this.dpsCkSignature);
     // this.addSignature(window['CKEDITOR'].instances.editor1, this.dpsCkSignature);
      subscription.unsubscribe();
    });
  }


  addSignature(editor, signature) {
    if (editor) {
      editor.addCommand('dpsinsertsignature',
        {
          exec: function () {
           // alert('dpsinsertsignature');
            if (signature) {
              const div = document.createElement('div');
              div.innerHTML = signature;
              div.setAttribute('class', 'signature');

              const fwdOrRpyCont = editor.editable().find('#divRplyFwdMsg').$;
              const signatureCont = editor.editable().find('.signature').$;
              if (fwdOrRpyCont.length) {
                if (fwdOrRpyCont[0].previousSibling) {
                  if (fwdOrRpyCont[0].previousSibling.className && fwdOrRpyCont[0].previousSibling.className === 'signature') {
                    if (signatureCont.length > 0) {
                      signatureCont[0].remove();
                    }
                  }
                }
                fwdOrRpyCont[0].parentNode.insertBefore(div, fwdOrRpyCont[0]);
              } else {

                if (signatureCont.length > 0) {
                  signatureCont[0].remove();
                }
                editor.editable().$.append(div);
              }
              // const fwdOrRpyCont = $('#divRplyFwdMsg', ckjq);
              /* const fwdOrRpyCont = ckjq.getElementById('divRplyFwdMsg');
                if (fwdOrRpyCont) {
                  let el = fwdOrRpyCont.prev('hr');
                  if (el.length === 0) {
                    el = fwdOrRpyCont;
                  }
                  if (el.prevAll('.signature').length > 0) {
                    el.prevAll('.signature').remove();
                  }
                  el.before('<div class="signature">' + 'this.signature ' + '</div>');
                } else {
                  ckjq.find('.signature').remove();
                  ckjq.append('<div class="signature">' + 'this.signature' + '</div>');
                }*/
            }
            // scope.$apply();
          },
          canUndo: true
        });

      editor.ui.addButton('DPSSignature', {
        label: 'Insert Signature',
        command: 'dpsinsertsignature',
        toolbar: 'insert',
       // icons: '../assets/ckeditor/plugins/dpssignatureSample/icons/pngdpssignature.png'
      });
    }




  }
}
