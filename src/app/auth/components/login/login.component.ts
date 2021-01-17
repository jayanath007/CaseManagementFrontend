import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AzureAuthService } from '../../services/azure-auth.service';
import { AuthTokenFlowService } from '../../services/auth-token-flow.service';
import { AzureTokenFlowV2Service } from '../../services/azure-token-flow-v2.service';
import { LoginMode } from '../../models/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConfig } from '../../../core';

@Component({
  selector: 'dps-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy, OnInit {

  private unsubscribe: Subject<void> = new Subject();

  isLoading = false;
  constructor(private authService: AzureAuthService, private router: Router, public appConfig: AppConfig) {

  }

  ngOnInit() {

  }

  microsoft() {
    this.authService.loginUrlPopup(LoginMode.AzureV2)
      .pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.isLoading = true;
        const url = '/main/(desktop:desktop/(main:matter-search/home/index//mail:mail/home/index/(inbox:inbox)//dashboard:tmp))';
        this.router.navigateByUrl(url, { replaceUrl: true });
      });
  }
  google() {
    this.authService.loginUrlPopup(LoginMode.Google)
      .pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.isLoading = true;
        const url = '/main/(desktop:desktop/(main:matter-search/home/index//dashboard:tmp))';
        this.router.navigateByUrl(url, { replaceUrl: true });
      });
  }

  ngOnDestroy() {
    this.isLoading = false;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
