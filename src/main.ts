import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppConfig } from './app/core/configs/app-config';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AuthTokenFlowService } from './app/auth/services/auth-token-flow.service';
import { AzureTokenFlowService } from './app/auth/services/azure-token-flow.service';
import { GoogleTokenFlowService } from './app/auth/services/google-token-flow.service';
import { DatePipe } from '@angular/common';
import { AzureTokenFlowV2Service } from './app/auth/services/azure-token-flow-v2.service';
import { uuid } from './app/utils/uuid';

Date.prototype.getWeek = function () {
  const onejan: any = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

Date.prototype.getThisWeekFriday = function () {
  const curr = new Date(this.getTime());
  const first = curr.getDate() - curr.getDay();
  const last = first + 5;
  return new Date(curr.setDate(last));
};

Date.prototype.getNextWeekMonday = function () {
  const d = new Date(this.getTime());
  let diff = d.getDate() - d.getDay() + 1;
  if (d.getDay() === 0) {
    diff -= 7;
  }
  diff += 7;
  return new Date(d.setDate(diff));
};

Date.prototype.getNextWeekFriday = function () {
  const d = this.getNextWeekMonday();
  return new Date(d.setDate(d.getDate() + 4));
};

Date.prototype.toDpsString = function (onlyDate = false, removeTime = false) {
  const datePipe = new DatePipe('en-US');
  if (removeTime) {
    return datePipe.transform(this, 'yyyy-MM-dd');
  }
  if (onlyDate) {
    return datePipe.transform(this, 'yyyy-MM-ddT00:00:00');
  }
  return datePipe.transform(this, 'yyyy-MM-ddTHH:mm:ss');
};

Date.prototype.dateWithOutTime = function () {
  const datePipe = new DatePipe('en-US');
  return new Date(datePipe.transform(this, 'yyyy-MM-ddT00:00:00'));
};

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

if (environment.production) {
  enableProdMode();
}

function loadAjax(url, error, success) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
      if (xmlhttp.status === 200) {
        success(xmlhttp.responseText);
      } else if (xmlhttp.status === 400) {
        error();
      } else {
        error();
      }
    }
  };

  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}


declare var gapi;
function addScript(url, callback) {
  const script = document.createElement('script');
  if (callback) {
    script.onload = callback;
  }
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
  if (!window.name && !window.opener) {
    window.name = uuid();
    window['appInstanceId'] = window.name;
  } else if (window.name && !window.opener) {
    window['appInstanceId'] = window.name;
  } else {
    window['appInstanceId'] = window.opener['appInstanceId'];
  }
}

function loadTokenFlowService(config, start) {


  if (config.googleClientId) {
    const SCOPE = [
      'profile email openid',
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/contacts.readonly',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      // 'https://www.google.com/m8/feeds/'
    ].join(' ');

    addScript('https://apis.google.com/js/api.js', () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          'clientId': config.googleClientId,
          'scope': SCOPE,
          'discoveryDocs': [
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
            'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
            'https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest'
          ]
        }).then(function () {

          let providers;

          if (config.appId) {

            providers = [{ provide: AppConfig, useValue: new AppConfig(config, environment.version, environment.buildVersion) },
            {
              provide: GoogleTokenFlowService, useFactory: (appConfig: AppConfig) => {
                return new GoogleTokenFlowService(appConfig, SCOPE);
              },
              deps: [AppConfig]
            } as any,
            {
              provide: AuthTokenFlowService, useFactory: (appConfig: AppConfig) => {
                return new AzureTokenFlowService(appConfig);
              },
              deps: [AppConfig]
            } as any,
            {
              provide: AzureTokenFlowV2Service, useFactory: (appConfig: AppConfig) => {
                return new AzureTokenFlowV2Service(appConfig);
              },
              deps: [AppConfig]
            } as any
            ];

          } else {

            providers = [{ provide: AppConfig, useValue: new AppConfig(config, environment.version, environment.buildVersion) },
            {
              provide: GoogleTokenFlowService, useFactory: (appConfig: AppConfig) => {
                return new GoogleTokenFlowService(appConfig, SCOPE);
              },
              deps: [AppConfig]
            } as any,
            {
              provide: AuthTokenFlowService, useFactory: (appConfig: AppConfig) => {
                return null;
              },
              deps: [AppConfig]
            } as any,
            {
              provide: AzureTokenFlowV2Service, useFactory: (appConfig: AppConfig) => {
                return null;
              },
              deps: [AppConfig]
            } as any
            ];

          }


          start(providers);
        });
      });
    });
  } else {

    const providers = [{ provide: AppConfig, useValue: new AppConfig(config, environment.version, environment.buildVersion) },
    {
      provide: GoogleTokenFlowService, useFactory: (appConfig: AppConfig) => {
        return null;
      },
      deps: [AppConfig]
    } as any,
    {
      provide: AuthTokenFlowService, useFactory: (appConfig: AppConfig) => {
        return new AzureTokenFlowService(appConfig);
      },
      deps: [AppConfig]
    } as any,
    {
      provide: AzureTokenFlowV2Service, useFactory: (appConfig: AppConfig) => {
        return new AzureTokenFlowV2Service(appConfig);
      },
      deps: [AppConfig]
    } as any
    ];
    start(providers);

  }

}

function bootstrapApp(providers) {
  platformBrowserDynamic(providers)
    .bootstrapModule(AppModule).catch(err => console.log(err));
}

loadAjax(environment.config, () => alert('error loading' + environment.config),
  (configResult) => {
    try {
      const config = JSON.parse(configResult);
      loadTokenFlowService(config, bootstrapApp);
    } catch (e) {
      alert(e);
    }
  });
