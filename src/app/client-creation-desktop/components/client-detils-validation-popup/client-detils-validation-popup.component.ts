import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Client } from '../../../client-creation-core/models/interfaces';
import { ConfirmDialogResultKind } from '../../../shared/models/dialog';

@Component({
  selector: 'dps-client-detils-validation-popup',
  templateUrl: './client-detils-validation-popup.component.html',
  styleUrls: ['./client-detils-validation-popup.component.scss']
})
export class ClientDetilsValidationPopupComponent implements OnInit {

  @Input() isLoading: boolean;

  @Input() myToken: string;
  @Input() client: Client;
  @Input() selectedUserInMovement: any;
  ConfirmDialogResultKind = ConfirmDialogResultKind;
  constructor(public dialogRef: MatDialogRef<ClientDetilsValidationPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  directorForename: string;
  directorSurname: string;
  houseNo: string;
  directorAddressLine: string;
  clientTown: string;
  clientPostCode: string;
  dateOfBirth: string;
  niNumber: string;
  expiryDate: string;
  issueCode: string;
  drivingLicence: string;
  passportNo1: string;
  passportNo2: string;
  passportNo3: string;
  passportNo4: string;
  passportNo5: string;
  passportNo6: string;
  ngOnInit() {
    if (this.data) {

      this.myToken = this.data.token;
      this.client = this.data.input.client;

      this.directorForename = this.client.firstName;
      this.directorSurname = this.client.lastName;
      this.houseNo = this.client.clientAddress1; // this.client.
      this.directorAddressLine = this.client.clientAddress2; // this.client.dt
      this.clientTown = this.client.clientTown;
      this.clientPostCode = this.client.clientPostCode;
      this.dateOfBirth = this.client.dateOfBirth;
      this.niNumber = this.client.niNumber;

    }

  }

  onClose(kind) {
    this.dialogRef.close({ kind: kind });
  }

  onChangSureName(value) {
    this.directorSurname = value;

  }

  onChangForeName(value) {
    this.directorForename = value;
  }
  onChangHouseNumber(value) {
    this.houseNo = value;


  }
  onChangAddressLine(value) {
    this.directorAddressLine = value;
  }
  onChangTown(value) {
    this.clientTown = value;

  }
  onChangPostCode(value) {
    this.clientPostCode = value;

  }
  onDateOfBirthChange(value) {
    this.dateOfBirth = value;

  }
  onChangeNIC(value) {
    this.niNumber = value;
  }

  onDrivingLicence(value) {
    this.drivingLicence = value;

  }
  onCountryOfIssue(value) {
    this.issueCode = value;

  }
  onEntryDateChange(value) {

    this.expiryDate = value;
  }
  onPassportLine1(value) {
    this.passportNo1 = value;
  }

  onPassportLine2(value) {
    this.passportNo2 = value;

  }
  onPassportLine3(value) {
    this.passportNo3 = value;
  }
  onPassportLine4(value) {
    this.passportNo4 = value;
  }
  onPassportLine5(value) {
    this.passportNo5 = value;
  }
  onPassportLine6(value) {
    this.passportNo6 = value;

  }


  onSaveChanges(kind) {

    const validData: any = {
      directorForename: this.directorForename,
      directorSurname: this.directorSurname,
      houseNo: this.houseNo,
      directorAddressLine: this.directorAddressLine,
      dateOfBirth: this.dateOfBirth,
      clientTown: this.clientTown,
      clientPostCode: this.clientPostCode,
      clientModel: this.data,
      niNumber: this.niNumber,

      drivingLicence: this.drivingLicence,
      expiryDate: this.expiryDate,
      issueCode: this.issueCode,
      passportNo: this.passportNo1 + this.passportNo2 + this.passportNo3 + this.passportNo4 + this.passportNo5 + this.passportNo6,
      kind: kind
    };

    this.dialogRef.close(validData);

  }

}
