
const tr = (s) => s.replace(/\/+$/, '');
const tl = (s) => s.replace(/^\/+/, '');

const isAbsoluteUrl = (s) => {
    const pat = /^https?:\/\//i;
    return (pat.test(s));
};

export class AppConfig {
    constructor(private data, public version: string, public buildVersion: string) {

    }

    get tenant(): string {
        return this.data.tenant;
    }

    get appId(): string {
        return this.data.appId;
    }

    get endpoints(): {
        graphApi: string,
        outlookApi: string,
        dpsWebService: string,
        dpsWopiService: string
        dpsWebServiceV3: string,
    } {
        // must have
        const endpoints = {
            graphApi: 'https://graph.microsoft.com',
            outlookApi: 'https://outlook.office.com',
        };

        return {
            ...endpoints,
            ...this.data.endpoints
        };
    }

    get inlineAttachmentBase() {
        return this.getUrl(this.data.inlineAttachmentBase);
    }
    get profilePhotoBase() {
        return this.getUrl(this.data.profilePhotoBase);
    }

    get serviceBase(): string {
        return this.getUrl(this.data.serviceBase);
    }

    get serviceBase2(): string {
        return this.getUrl(this.data.serviceBase2);
    }
    get apiv3FormsLibraryApi(): string {
        return this.getUrl(this.data.workflow);
    }
    get apiv3CrimeApi(): string {
        return this.getUrl(this.data.crime);
    }
    get apiv3OpportunityApi(): string {
        return this.getUrl(this.data.opportunity);
    }
    get apiv3SolicitorApi(): string {
        return this.getUrl(this.data.solicitor);
    }
    get apiv3TeamTalkApi(): string {
        return this.getUrl(this.data.teamTalk);
    }
    get apiv3ProbateApi(): string {
        return this.getUrl(this.data.probate);
    }
    get apiv3FileserverApi(): string {
        return this.getUrl(this.data.fileserver);
    }
    get apiv3StorageProxy(): string {
        return this.getUrl(this.data.storageProxy);
    }
    get apiv3DiaryApi(): string {
        return this.getUrl(this.data.diary);
    }
    get apiv3DocumentHandler(): string {
        return this.getUrl(this.data.documentHandler);
    }
    get apiv3DocumentHandlerProxy(): string {
        return this.getUrl(this.data.documentHandlerProxy);
    }
    get apiv3DurableProxy(): string {
        return this.getUrl(this.data.durableProxy);
    }
    get apiv3Inbox(): string {
        return this.getUrl(this.data.inbox);
    }
    get apiv3PrecidentHApi(): string {
        return this.getUrl(this.data.precidentH);
    }
    get apiv3SafeboxApi(): string {
        return this.getUrl(this.data.safebox);
    }
    get apiv3CivilApi(): string {
        return this.getUrl(this.data.civil);
    }

    get absoluteServiceBase(): string {
        return isAbsoluteUrl(this.data.serviceBase) ? tr(this.data.serviceBase) :
            window.location.origin + '/' + tl(tr(this.data.serviceBase));
    }

    get outlookApiBase(): string {
        return tr(this.data.outlookApiBase);
    }

    get graphApiBase(): string {
        return tr(this.data.graphApiBase);
    }

    get pdfviwer(): string {
        return this.getUrl(this.data.pdfviwer);
    }

    get workflowStreamingUrl() {
        return this.data.workflowStreamingUrl;
    }

    get insightsInstrumentationKey(): string {
        return this.data.insightsInstrumentationKey;
    }

    get indexeddbVersion(): number {
        return this.data.indexeddbVersion;
    }
    get dashboardTheme(): string {
        return this.data.dashboardTheme;
    }

    get tokenFlow(): string {
        return this.data.tokenFlow;
    }
    get googleClientId(): string {
        return this.data.googleClientId;
    }

    private getUrl(url: string) {
        return isAbsoluteUrl(url) ? tl(url) : '/' + tl(tr(url));
    }

}
