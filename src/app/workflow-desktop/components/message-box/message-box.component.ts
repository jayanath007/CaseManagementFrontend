import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DialogResult, MessageBoxMediator, MessageBoxButtons } from '../../../workflow-core';

@Component({
  selector: 'dps-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, OnDestroy {

  public messageText: string;
  public _icon: string;
  public caption: string;
  private lcSubscription;

  constructor( @Inject(MAT_DIALOG_DATA) public data: { mediator: MessageBoxMediator },
    public dialogRef: MatDialogRef<MessageBoxComponent>) {
  }

  public buttonDef: { [action: string]: { label: string, action: DialogResult } } = {};
  public buttons: { label: string, action: DialogResult }[] = [];

  ngOnInit() {

    this.lcSubscription = this.data.mediator.lifecycle.subscribe(() => { }, () => {
      this.dialogRef.close();
    });


    this.buttonDef[DialogResult.Ok] = { label: 'Ok', action: DialogResult.Ok };
    this.buttonDef[DialogResult.Yes] = { label: 'Yes', action: DialogResult.Yes };
    this.buttonDef[DialogResult.No] = { label: 'No', action: DialogResult.No };
    this.buttonDef[DialogResult.Cancel] = { label: 'Cancel', action: DialogResult.Cancel };
    this.buttonDef[DialogResult.Retry] = { label: 'Retry', action: DialogResult.Retry };
    this.buttonDef[DialogResult.Abort] = { label: 'Abort', action: DialogResult.Abort };
    this.buttonDef[DialogResult.Ignore] = { label: 'Ignore', action: DialogResult.Ignore };
    this.buttonDef[DialogResult.Contact] = { label: 'Contact', action: DialogResult.Contact };
    this.buttonDef[DialogResult.Matter] = { label: 'Matter', action: DialogResult.Matter };
    this.buttonDef[DialogResult.Reload] = { label: 'Reload', action: DialogResult.Reload };
    this.buttonDef[DialogResult.Unlink] = { label: 'Unlink', action: DialogResult.Unlink };

    this.data.mediator.ready().then(message => {
      console.log(message);
      this.caption = message.caption;
      this.messageText = message.text ? message.text.replace(/\n/g, '<br />') : '';
      this.buttons = this.buildButons(message.buttons);
      this._icon = message.icon;
    });

  }

  public get icon() {
    if (!this._icon) {
      return 'dps-workflow-none';
    }
    return 'dps-workflow-' + this._icon.toLowerCase();
  }

  private buildButons(button: MessageBoxButtons): { label: string, action: DialogResult }[] {
    const buttons = [];
    switch (button) {
      case MessageBoxButtons.Ok:
        buttons.push(this.buttonDef[DialogResult.Ok]);
        break;

      case MessageBoxButtons.OkCancel:
        buttons.push(this.buttonDef[DialogResult.Ok]);
        buttons.push(this.buttonDef[DialogResult.Cancel]);
        break;

      case MessageBoxButtons.RetryCancel:
        buttons.push(this.buttonDef[DialogResult.Retry]);
        buttons.push(this.buttonDef[DialogResult.Cancel]);
        break;

      case MessageBoxButtons.YesNo:
        buttons.push(this.buttonDef[DialogResult.Yes]);
        buttons.push(this.buttonDef[DialogResult.No]);
        break;

      case MessageBoxButtons.YesNoCancel:
        buttons.push(this.buttonDef[DialogResult.Yes]);
        buttons.push(this.buttonDef[DialogResult.No]);
        buttons.push(this.buttonDef[DialogResult.Cancel]);
        break;

      case MessageBoxButtons.AbortRetryIgnore:
        buttons.push(this.buttonDef[DialogResult.Abort]);
        buttons.push(this.buttonDef[DialogResult.Reload]);
        buttons.push(this.buttonDef[DialogResult.Ignore]);
        break;

      case MessageBoxButtons.ContactMatterCancel:
        buttons.push(this.buttonDef[DialogResult.Contact]);
        buttons.push(this.buttonDef[DialogResult.Matter]);
        buttons.push(this.buttonDef[DialogResult.Cancel]);
        break;

      case MessageBoxButtons.ReloadUnlink:
        buttons.push(this.buttonDef[DialogResult.Reload]);
        buttons.push(this.buttonDef[DialogResult.Unlink]);
        break;
    }
    return buttons;
  }

  onActionClick(action: DialogResult) {
    this.dialogRef.close({ isReply: true, dialogResult: action });
  }

  ngOnDestroy(): void {
    this.data.mediator.destroy();
    this.lcSubscription.unsubscribe();
  }


  // onClose() {

  //   this.dialogRef.close(null);

  // }

}
