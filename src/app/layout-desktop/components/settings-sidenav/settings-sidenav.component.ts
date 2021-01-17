import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserImageCropperPopupComponent } from '../user-image-cropper-popup/user-image-cropper-popup.component';
import { User } from '../../../auth';
import { SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';

@Component({
  selector: 'dps-settings-sidenav',
  templateUrl: './settings-sidenav.component.html',
  styleUrls: ['./settings-sidenav.component.scss']
})
export class SettingsSidenavComponent implements OnInit {

  @Input() user: User;
  @Output() logout = new EventEmitter();
  @Input() isGoogle: boolean;

  @Output() openMailSettings = new EventEmitter();
  @Output() openPostingPeriod = new EventEmitter();
  @Output() updateImageFile = new EventEmitter();
  @Output() oppenOpportunitySettings = new EventEmitter();
  @Output() mlsInquiryForm = new EventEmitter();
  @Output() openPageSetup = new EventEmitter();


  showProfileImg = false;
  IsLoginUserSupervisor$: any;

  constructor(private dialog: MatDialog, private access: AccessControlService) { }

  ngOnInit() {
    this.IsLoginUserSupervisor$ = this.access.getSettingValue(SettingKey.IsLoginUserSupervisor);
  }
  onLogout() {
    this.logout.emit();
  }
  onMailSettings() {
    this.openMailSettings.emit();
  }
  onPostingPeriod() {
    this.openPostingPeriod.emit();
  }

  onPageSetup() {
    this.openPageSetup.emit();
  }


  showUserImgeCropper() {
    this.dialog.open(UserImageCropperPopupComponent, {
      data: this.user,
      width: '700px',
      height: '700px',
      panelClass: 'dps-user-image-cropper-popup',
      disableClose: true
    }).beforeClosed().subscribe((value: File) => {
      if (value) {
        this.updateImageFile.emit(value);
      }
    });
  }
  onMLSInquiryForm() {
    this.mlsInquiryForm.emit();
  }

  onOpportunitySettings() {
    this.oppenOpportunitySettings.emit();
  }

}
