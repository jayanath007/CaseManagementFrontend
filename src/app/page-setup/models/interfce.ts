
export interface PageSetup {
    topMargin: number;
    bottomMargin: number;
    leftMargin: number;
    rightMargin: number;
    gutter: number;
    pageWidth: number;
    pageHeight: number;
    footerDistance: number;
    headerDistance: number;

}
export interface PageSetupData {
    firstPage: PageSetup;
    otherPages: PageSetup;
}
export interface PageSetupResponce {
    firstPage: PageSetup;
    otherPages: PageSetup;
    usingDefaults: boolean;
    differentFirstPageHeaderFooter: boolean;
}



