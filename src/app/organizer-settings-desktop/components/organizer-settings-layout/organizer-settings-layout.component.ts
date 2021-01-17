import {
  OrganizerSignatureLayoutComponent
} from '../organizer-signature-layout/organizer-signature-layout.component';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TimeZoneInformation, AutomaticRepliesSetting } from '../../../core/lib/microsoft-graph';
import { UserResponse } from '../../../organizer-settings-core/models/interfaces';
import { SettingsSnackBarComponent } from '../settings-snack-bar/settings-snack-bar.component';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MessageFormat, User, AuthInfoStateService } from '../../../auth';
import { SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { GlobalSignatureCreatorLayoutComponent } from '../global-signature-creator-layout/global-signature-creator-layout.component';


@Component({
  selector: 'dps-organizer-settings-layout',
  templateUrl: './organizer-settings-layout.component.html',
  styleUrls: ['./organizer-settings-layout.component.scss']
})

export class OrganizerSettingsLayoutComponent implements OnInit, OnChanges {
  @Input() token: string;
  @Input() isChaserEnable: boolean;
  @Input() isLoading: boolean;
  @Input() isSignatureAutoAdd: boolean;
  @Input() userResponse: UserResponse;
  @Input() timeZones: TimeZoneInformation[];
  @Input() userTimeZone: string;
  @Input() signature: string;
  @Input() isExtensionsSaveSuccess: boolean;
  @Input() isSignatureSaveSuccess: boolean;
  @Input() isSaveSuccess: boolean;
  @Input() isSaveFail: boolean;
  @Input() userInfo: User;
  @Input() automaticRepliesSetting: AutomaticRepliesSetting;
  @Input() reminderSoundEnable: boolean;
  @Input() newMailSoundEnable: boolean;
  @Input() messageFormat: MessageFormat;
  @Input() useGlobalSignature: boolean;
  @Input() signatureTemplete: string;

  @Output() changeAutomaticRepliesSetting = new EventEmitter();
  @Output() updateChaserEnableChange = new EventEmitter();
  @Output() updateAutoSignatureAddChange = new EventEmitter();
  @Output() updateTimeZoneChange = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @Output() updateSignatureChange = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() clear = new EventEmitter();
  @Output() onResponse = new EventEmitter();
  @Output() signatureReplaced = new EventEmitter<string>();
  @Output() updateImageFile = new EventEmitter();
  @Output() updateReminderSoundEnableChange = new EventEmitter();
  @Output() updateNewMailSoundEnableChange = new EventEmitter();
  @Output() updateMessageFormat = new EventEmitter();
  @Output() updateUseGlobalSignature = new EventEmitter<boolean>();
  @Output() updateGlobalSignTemplete = new EventEmitter<string>();

  saving = false;
  filename = '';
  imageFile = null;
  enableAutoReplies = false;
  IsLoginUserSupervisor$: any;
  globalSignatureHtml$: any;
  globalSignatureTempleteIsLoading$: any;
  loading = true;

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog,
    private access: AccessControlService, private auth: AuthInfoStateService) {

  }

  ngOnInit() {
    this.IsLoginUserSupervisor$ = this.access.getSettingValue(SettingKey.IsLoginUserSupervisor);
    this.globalSignatureHtml$ = this.auth.getGlobalSignature();
    this.globalSignatureTempleteIsLoading$ = this.auth.getGlobalSignatureForTempleteIsLoading();
    setTimeout(() => this.loading = false, 3000);
  }

  onFileChange(files: File[]) {
    this.updateImageFile.emit(files[0]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.userResponse && changes.userResponse && this.userResponse.displayStatus) {
      if (this.userResponse.displyMessage === 'No changers to save') {
        this.saving = false;
      } else {
        this.openSnackBar(this.userResponse.displyMessage, '');
      }
    }

    if ((changes.isSaveSuccess && this.isSaveSuccess)
      || (changes.isSaveFail && this.isSaveFail && !changes.isSaveFail.firstChange)) {


      if (this.isSaveSuccess) {
        this.saving = false;
        setTimeout(() => {
          this.onCancelBtnClicked();
        }, 100);

      }

      if (this.isSaveFail) {
        this.saving = false;
      }

    }
  }

  onChaserEnableChange(value) {
    this.updateChaserEnableChange.emit(value.checked);
  }
  onReminderSoundEnableChange(value) {
    this.updateReminderSoundEnableChange.emit(value.checked);
  }
  onNewMailSoundEnableChange(value) {
    this.updateNewMailSoundEnableChange.emit(value.checked);
  }

  onSignatureAutoAddChange(value) {
    this.updateAutoSignatureAddChange.emit(value.checked);
  }

  onSignatureChange(value) {
    this.updateSignatureChange.emit(value);
  }

  onTimeZoneChange(value) {
    this.updateTimeZoneChange.emit(value);
  }
  onContentTypeChange(value) {
    this.updateMessageFormat.emit({ ...this.messageFormat, contentType: value });
  }
  onFontFamilyChange(value) {
    this.updateMessageFormat.emit({ ...this.messageFormat, fontFamily: value });
  }
  onFontSizeChange(value) {
    this.updateMessageFormat.emit({ ...this.messageFormat, fontSize: value });
  }
  onIsBoldChange() {
    this.updateMessageFormat.emit({ ...this.messageFormat, isBold: !this.messageFormat.isBold });
  }
  onIsItalicChange() {
    this.updateMessageFormat.emit({ ...this.messageFormat, isItalic: !this.messageFormat.isItalic });
  }
  onIsUnderlineChange() {
    this.updateMessageFormat.emit({ ...this.messageFormat, isUnderline: !this.messageFormat.isUnderline });
  }
  onFontColorChange(fontColor) {
    this.updateMessageFormat.emit({ ...this.messageFormat, fontColor });
  }
  onSubmitBtnClick() {
    if (new Date(this.automaticRepliesSetting.scheduledStartDateTime.dateTime).valueOf() <
      new Date(this.automaticRepliesSetting.scheduledEndDateTime.dateTime).valueOf()) {
      this.onSubmit.emit();
      this.saving = true;
    } else {
      const inforDialogData: InforDialogData = {
        content: {
          title: `Automatic replies settings`,
          message: `Starting time should not be greater than the end time. Please change the start time or end time.`
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: inforDialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'dps-notification'
      });
    }
  }

  onCancelBtnClicked() {
    this.clear.emit();
    this.cancel.emit();
  }

  onSignatureCreatorBtnClicked() {
    const dialogRef = this.dialog.open(OrganizerSignatureLayoutComponent, {
      width: '700px',
      height: '700px',
      data: { userInfo: this.userInfo, globalSig: false },
      panelClass: 'dps-signature-creator',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.signatureReplaced.emit(result);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.openFromComponent(SettingsSnackBarComponent, {
      data: message,
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
  onChangeAutomaticRepliesSetting(event) {
    this.changeAutomaticRepliesSetting.emit(event);
  }
  ckReady() {
    this.enableAutoReplies = true;
  }
  onUseGlobalSignatureChange(value) {
    this.updateUseGlobalSignature.emit(value.checked);
  }
  onGlobalSignatureCreatorBtnClicked() {
    const dialogRef = this.dialog.open(GlobalSignatureCreatorLayoutComponent, {
      width: '800px',
      height: '733px',
      panelClass: 'dps-global-signature-creator',
      disableClose: true,
    });
    setTimeout(() => dialogRef.componentInstance.signatureTemplete = this.signatureTemplete, 500);
    dialogRef.componentInstance.userInfo = this.userInfo;

    dialogRef.afterClosed().subscribe(result => {
      if (result !== '$discard$') {
        this.updateGlobalSignTemplete.emit(result);
      }
    });
  }
}
