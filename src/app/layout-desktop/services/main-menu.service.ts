import { map } from 'rxjs/operators';
import { OpenCaseMenueData, MailSubjectParam } from '../../core/lib/open-case';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Menus from '../actions/main-menu';
import { MainMenuItem, DPSFilesToMailAttachmentRequestViewModel, } from '../models/interfaces';
import { MenuGroups, RouterOutlets } from '../models/enums';
import { ActivatedRoute } from '@angular/router';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { NavigateByRoute } from '../actions/main-menu';
import { getMenuItemByToken } from '../reducers';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../core';
import { Utilities } from '../../utils/utilities';
import { ScreenEditComponentTreeData } from './../../core/lib/screen-edit';

@Injectable()
export class MainMenuService {

  private desktopRoute: ActivatedRoute;

  constructor(private store: Store<any>, private dialog: MatDialog,
    private http: HttpClient, private appConfig: AppConfig) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'viewDpsFile' && event.newValue) {
        window.focus();
        this.goToOpenCaseByMailSubjectOrDiaryId(JSON.parse(event.newValue));
      } else if (event.key === 'goToOpenCase' && event.newValue) {
        window.focus();
        this.gotoOpenCase(JSON.parse(event.newValue));
      }
    });
  }
  addToMenu(item: MainMenuItem<any>) {
    this.store.dispatch(new Menus.AppendToMainMenu({ item: item }));
  }

  removeFromMenu(id: string) {
    this.store.dispatch(new Menus.RemoveFromMainMenu({ id: id }));
  }

  setDeskTopRoute(route: ActivatedRoute) {
    this.desktopRoute = route;
  }

  appendAndNavigate(item: MainMenuItem<any>) {
    this.addToMenu(item);
    this.navigateById(item.id);
  }

  navigateById(id: string) {
    this.store.dispatch(new Menus.NavigateToView(id, this.desktopRoute));
  }

  gotoOpenCase(materData: GridRowItemWrapper) {
    const tokenKey = this.getOpenCaseTabKey(materData.data.appID, materData.data.fileID);
    const token = 'openCaseToken_' + btoa(tokenKey);
    const input: OpenCaseMenueData = {
      matterData: materData,
      openCaseToken: token
    };

    const item: MainMenuItem<OpenCaseMenueData> = {
      id: token,
      label: 'Open case label - ' + materData.data.matterReferenceNo,
      icon: '',
      group: MenuGroups.OpenCase,
      outlet: RouterOutlets.Main,
      routerLink: ['open-case', 'home', token],
      data: input,
      token: token,
      hidden: true,
      isSelected: true,
      moduleId: null,
      canAccess: true
    };

    this.appendAndNavigate(item);
    return token;
  }

  getOpenCaseTabKey(appID, fileID) {
    return '(DPS:' + ':' + appID + ':' + fileID + ')';
  }



  goToOpenCaseByMailSubjectOrDiaryId({ subject, diaryId }: { subject: string, diaryId: number }) {


    if (subject && (subject.trim().toUpperCase().indexOf('#DPS:') !== -1 ||
      subject.trim().toUpperCase().indexOf('[DPS:') !== -1)) {

      const tokenKey = this.getTokenKeyFronMailSubject(subject);
      const token = 'openCaseToken_' + btoa(tokenKey);
      const input: OpenCaseMenueData = {
        mailSubject: subject,
        openCaseToken: token
      };
      const item: MainMenuItem<OpenCaseMenueData> = {
        id: token,
        label: 'Open case label - ' + subject,
        icon: 'content_paste',
        group: MenuGroups.OpenCase,
        outlet: RouterOutlets.Main,
        routerLink: ['open-case', 'home', token],
        data: input,
        token: token,
        hidden: true,
        isSelected: true,
        moduleId: null,
        canAccess: true
      };

      this.appendAndNavigate(item);

    } else {
      this.store.dispatch(new Menus.GetMenuOpenCaseData({ mailSubject: subject, diaryId }));
    }

  }

  getTokenKeyFronMailSubject(mailSubject: string) {

    let tokenKey = '';
    if (mailSubject.trim().toUpperCase().indexOf('#DPS:') !== -1 || mailSubject.trim().toUpperCase().indexOf('[DPS:') !== -1) {
      const matter = this.getMatterFromMailSubject(mailSubject);
      tokenKey = this.getOpenCaseTabKey(matter.AppId, matter.FileId);
    } else {


      const subject1 = mailSubject.split('(DPS:')[1];
      const subject2 = subject1.split(')')[0];
      const subject3 = subject2.split(':');
      tokenKey = this.getOpenCaseTabKey(subject3[1], subject3[2]);
    }
    return tokenKey;
  }


  getMatterFromMailSubject(mailSubject: string): MailSubjectParam {
    let char = '#';
    if (mailSubject.trim().toUpperCase().indexOf('[DPS:') !== -1) {
      char = '[';
    }
    const startIndex = mailSubject.indexOf(char + 'DPS:');
    const endIndex = mailSubject.length;
    mailSubject = mailSubject.substring(startIndex, endIndex);
    mailSubject = mailSubject.replace(char + 'DPS:', '');
    mailSubject = mailSubject.replace(char === '[' ? ']' : char, '');
    mailSubject = mailSubject.trim();
    const refFields = mailSubject.split(':');

    const companyCode = refFields[0];
    let matterCode = refFields[1];
    const conversationCode = refFields[2];
    const conversationId = Utilities.ConvertFromBase64Arithmetic(conversationCode);

    let twoDigitBranch = false;
    if (matterCode.startsWith('$')) {
      twoDigitBranch = true;
      matterCode = matterCode.replace('$', '');
    }
    // convert utility returns an int, we need a string to break down
    let branchAppFile = Utilities.ConvertFromBase64Arithmetic(matterCode).toString();


    const branchDigits = twoDigitBranch ? 2 : 1;
    const branchId = parseInt(branchAppFile.substring(0, branchDigits), 10);
    branchAppFile = branchAppFile.substring(branchDigits);
    const appId = parseInt(branchAppFile.substring(0, 2), 10);
    branchAppFile = branchAppFile.substring(2);
    const fileId = parseInt(branchAppFile, 10);

    return {
      BranchId: branchId, FileId: fileId, AppId: appId,
      CompanyCode: companyCode, ConversationId: conversationId
    };

  }


  navigateToByRoute(routerLink: any) {
    this.store.dispatch(new NavigateByRoute(routerLink, this.desktopRoute));
  }

  updateMenuItem(id: string, item: Partial<MainMenuItem<any>>) {
    this.store.dispatch(new Menus.UpdateMenuItem(id, item));
  }

  resolveItemByToken<T>(token): Observable<MainMenuItem<T>> {
    return this.store.select(getMenuItemByToken(token));
  }


  // public getMailDraftId(draftIdRequest: DPSFilesToMailAttachmentRequestViewModel) {
  //   return this.http.get<any>
  //       (this.servicebase + 'MailBox/GetComposeEmailFullView?DPSFilesToMailAttachmentRequestViewModel=' + draftIdRequest)
  //       .map(response => response.data);
  // }

  public getMailDraftId(draftIdRequest: DPSFilesToMailAttachmentRequestViewModel) {
    const headers = new Headers({ 'Content-Type': undefined });
    return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/GetComposeEmailFullView',
      { ...draftIdRequest, isWithOutShare: true }).pipe(
        map((response) => response));
  }
  getEmailList(branchId: number, appId: number, fileId: number) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Contacts/GetEmailLookupListByCase', {
      BranchId: branchId,
      AppId: appId,
      FileId: fileId,
      DisplayDataString: 'EmailAddress'
    }).pipe(map(res => res.data));
  }

  public showMailPopupFailMsg(title: string, message: string) {
    // const dialogData: InforDialogData = {
    //   content: {
    //     title: title,
    //     message: message
    //   },
    //   contentParams: {},
    //   data: null
    // };
    // const dialogRef = this.dialog.open(InforDialogComponent, {
    //   data: dialogData,
    //   width: '400px',
    //   disableClose: true
    // });

    // return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
    //   return true;
    // });
    // .map((result) => ({ result, menuItem, newMenuItem }));

  }

  public GetMenuItems(request: string[]) {
    return this.http.post<{ data: ScreenEditComponentTreeData[] }>(`${this.appConfig.serviceBase}/EditScreen/GetMenuItems`,
      { SclName: request }).pipe(
        map(responce => responce.data)
      );
  }


  public getInboxEntriesCountByUser() {
    return this.http.get<any>(`${this.appConfig.serviceBase}/PostOffice/GetInboxEntriesCountByUser`).pipe(
      map(response => response.data));
  }


}
