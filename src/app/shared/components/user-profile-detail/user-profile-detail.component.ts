import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GeneralData } from '../../../auth';
import { TeamMember } from '../../../core/lib/team-members';

@Component({
  selector: 'dps-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.scss'],
})

export class UserProfileDetailComponent implements OnInit, OnChanges {

  @Input() selectedTeamMember: GeneralData & TeamMember;
  @Input() selectedDepartment;

  userEmail: string;
  userPhoneNo: string;
  userNameOrDepartment: string;
  imgPath: string;
  showProfileImg = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTeamMember || changes.selectedDepartment) {
      if (this.selectedTeamMember) {
        if (changes.selectedTeamMember && (!changes.selectedTeamMember.previousValue ||
          changes.selectedTeamMember.currentValue.userEmail !== changes.selectedTeamMember.previousValue.userEmail)) {
          this.showProfileImg = false;
        }
        this.userEmail = this.selectedTeamMember.userEmail;
        this.userPhoneNo = this.selectedTeamMember.userMobile || this.selectedTeamMember.userMobileNo;
        this.userNameOrDepartment = this.selectedTeamMember.userName || this.selectedTeamMember.fullName;
        this.imgPath = this.selectedTeamMember.userEmail;
      } else {
        // if (changes.selectedDepartment.previousValue !== changes.selectedDepartment.currentValue) {
        this.showProfileImg = false;
        this.userNameOrDepartment = this.selectedDepartment ? this.selectedDepartment.groupName : '';
        this.userPhoneNo = null;
        this.userEmail = null;
        this.imgPath = 'no-profile-img.png';
        // }

      }
    }
  }
  ngOnInit() {
  }

}
