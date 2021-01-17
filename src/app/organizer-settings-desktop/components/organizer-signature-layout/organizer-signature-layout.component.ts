import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../auth';
import { GlobalSignatureKey } from '../../../organizer-settings-core/models/enum';


@Component({
    selector: 'dps-organizer-signature-layout',
    templateUrl: './organizer-signature-layout.component.html',
    styleUrls: ['./organizer-signature-layout.component.scss']
})
export class OrganizerSignatureLayoutComponent implements OnInit {

    constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<OrganizerSignatureLayoutComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { userInfo: User, globalSig: boolean }) {
    }
    name = '';
    role = '';
    emailAddress = '';
    workNumber = '';
    mobileNumber = '';
    faxNumber = '';
    logoUrl = '';
    bannerUrl = '';
    bannerRedirectUrl = '';
    webSiteUrl = '';
    linkedIn = '';
    twitter = '';

    ngOnInit() {
        if (!!this.data.globalSig) {
            this.name = GlobalSignatureKey.Name;
            this.emailAddress = GlobalSignatureKey.EmailAddress;
            this.role = GlobalSignatureKey.JobTitle;
        } else {

            this.name = this.data.userInfo.profile.name;
            this.emailAddress = this.data.userInfo.profile.upn;
        }
        if (this.data.userInfo.profile.upn.toLowerCase().includes('@dpssoftware.co.uk')) {
            this.logoUrl = this.data.userInfo.general.companyLogoUrl ||
                'https://www.dpssoftware.co.uk/wp-content/uploads/2019/03/DPS-Software-Orb.png';
            this.bannerUrl = this.data.userInfo.general.companyBannerUrl || 'http://www.dpsutils.co.uk/DPSFileRepositry/Images/DPSMessage.png';
            this.bannerRedirectUrl = 'http://www.dpsutils.co.uk/DPSFileRepositry/images/DPSMessageLink.html';
            this.webSiteUrl = 'http://www.dpssoftware.co.uk';
            this.linkedIn = 'http://linkd.in/1r6uT0L';
            this.twitter = 'https://twitter.com/dpssoftware';
        } else {
            this.logoUrl = this.data.userInfo.general.companyLogoUrl || '';
            this.bannerUrl = this.data.userInfo.general.companyBannerUrl || '';
        }
    }

    get htmlContent() {
        return document.getElementById('signaturePreview').innerHTML;
    }

    get isLogoUrlNotSecure() {
        return (this.logoUrl || '').startsWith('http://');
    }
    get isBannerUrlNotSecure() {
        return (this.bannerUrl || '').startsWith('http://');
    }





    isUrlNotSecure(url = '') {
        return url.startsWith('http://');
    }

}
