import { OpportunitySaveViewModel, PropertyQuoteRequest, ProfertyQuoteSaveModal, PropertyQuReport, SaveScreenItem, CostDiscount, WebQuoteVars, MatterVarsViewModel, WebQuoteCompnayDetails, Cost, WebQuoteBranch, PropertyQuReportview, PropertyQuoteType } from './interfaces';
import { PropertyQuoteRequestKey, LeaseHold } from './enums';
import { PropertyQuoteApp } from '../../core/lib/web-quote';

export class QuoteRequest {
    constructor(public item: OpportunitySaveViewModel) { }

    toPost() {
        return {
            opportunityId: this.item.enquiryId,
            clientName: this.item.clientName,
            departmentId: this.item.departmentId,
            workTypeId: this.item.workTypeId,
            feeEarner: this.item.feeEarner,
            quoteAmount: this.item.amount,
            quoteDis: this.item.quoteDis,
            otherFees: this.item.otherFees,
            templateName: this.item.templete,
            email1: this.item.email1
        };
    }

}

export class PropertyQuRequest {
    constructor(public request: PropertyQuoteRequest) { }
    toPost() {
        switch (this.request[PropertyQuoteRequestKey.appId]) {
            case PropertyQuoteApp.Buying:
                return {
                    reportId: this.request[PropertyQuoteRequestKey.reportId],
                    appId: this.request[PropertyQuoteRequestKey.appId],
                    branchId: this.request[PropertyQuoteRequestKey.branchId],
                    isEngProperty: this.request[PropertyQuoteRequestKey.isEngProperty],
                    purchesValue: this.request[PropertyQuoteRequestKey.purchesValue],
                    buyLeasehold: this.request[PropertyQuoteRequestKey.buyLeasehold],
                    lasId: this.request[PropertyQuoteRequestKey.lasId],
                    buyShare: this.request[PropertyQuoteRequestKey.buyShare],
                    martgage: this.request[PropertyQuoteRequestKey.martgage],
                    isBuyHouse: this.request[PropertyQuoteRequestKey.isBuyHouse],
                    isFirstTimeBuyer: this.request[PropertyQuoteRequestKey.isFirstTimeBuyer],
                    isNewBuild: this.request[PropertyQuoteRequestKey.isNewBuild],
                    isBuyToLet: this.request[PropertyQuoteRequestKey.isBuyToLet],
                    isSecondProperty: this.request[PropertyQuoteRequestKey.isSecondProperty],
                    isRightToBuy: this.request[PropertyQuoteRequestKey.isRightToBuy],
                    purchesProfCostDis: this.request[PropertyQuoteRequestKey.purchesProfCostDis],
                };
            case PropertyQuoteApp.Selling: {
                return {
                    reportId: this.request[PropertyQuoteRequestKey.reportId],
                    appId: this.request[PropertyQuoteRequestKey.appId],
                    branchId: this.request[PropertyQuoteRequestKey.branchId],
                    isEngProperty: this.request[PropertyQuoteRequestKey.isEngProperty],
                    martgage: this.request[PropertyQuoteRequestKey.martgage],
                    saleValue: this.request[PropertyQuoteRequestKey.saleValue],
                    saleleasehold: this.request[PropertyQuoteRequestKey.saleleasehold],
                    sellShare: this.request[PropertyQuoteRequestKey.sellShare],
                    lasId: this.request[PropertyQuoteRequestKey.lasId],
                    isSaleHouse: this.request[PropertyQuoteRequestKey.isSaleHouse],
                    saleProfCostDis: this.request[PropertyQuoteRequestKey.saleProfCostDis],
                };
            }
            case PropertyQuoteApp.BuyingAndSelling: {
                return {
                    reportId: this.request[PropertyQuoteRequestKey.reportId],
                    appId: this.request[PropertyQuoteRequestKey.appId],
                    branchId: this.request[PropertyQuoteRequestKey.branchId],
                    isEngProperty: this.request[PropertyQuoteRequestKey.isEngProperty],
                    purchesValue: this.request[PropertyQuoteRequestKey.purchesValue],
                    buyLeasehold: this.request[PropertyQuoteRequestKey.buyLeasehold],
                    lasId: this.request[PropertyQuoteRequestKey.lasId],
                    buyShare: this.request[PropertyQuoteRequestKey.buyShare],
                    martgage: this.request[PropertyQuoteRequestKey.martgage],
                    isBuyHouse: this.request[PropertyQuoteRequestKey.isBuyHouse],
                    isFirstTimeBuyer: this.request[PropertyQuoteRequestKey.isFirstTimeBuyer],
                    isNewBuild: this.request[PropertyQuoteRequestKey.isNewBuild],
                    isBuyToLet: this.request[PropertyQuoteRequestKey.isBuyToLet],
                    isSecondProperty: this.request[PropertyQuoteRequestKey.isSecondProperty],
                    isRightToBuy: this.request[PropertyQuoteRequestKey.isRightToBuy],
                    saleValue: this.request[PropertyQuoteRequestKey.saleValue],
                    saleleasehold: this.request[PropertyQuoteRequestKey.saleleasehold],
                    sellShare: this.request[PropertyQuoteRequestKey.sellShare],
                    isSaleHouse: this.request[PropertyQuoteRequestKey.isSaleHouse],
                    purchesProfCostDis: this.request[PropertyQuoteRequestKey.purchesProfCostDis],
                    saleProfCostDis: this.request[PropertyQuoteRequestKey.saleProfCostDis],
                };
            } default: {
                return {
                    reportId: this.request[PropertyQuoteRequestKey.reportId],
                    appId: this.request[PropertyQuoteRequestKey.appId],
                    branchId: this.request[PropertyQuoteRequestKey.branchId],
                    isEngProperty: this.request[PropertyQuoteRequestKey.isEngProperty],
                    martgage: this.request[PropertyQuoteRequestKey.martgage],
                    hIPsValue: this.request[PropertyQuoteRequestKey.hIPsValue],
                    hipsLeasehold: this.request[PropertyQuoteRequestKey.hipsLeasehold],
                    lasId: this.request[PropertyQuoteRequestKey.lasId],
                    sellShare: this.request[PropertyQuoteRequestKey.sellShare],
                    hipsProfCostDis: this.request[PropertyQuoteRequestKey.hipsProfCostDis],
                };
            }
        }
    }
}

export class PropertyQuoteSend {
    constructor(public OpportunityId: number, public request: PropertyQuoteRequest,
        public htmlContent: string, public reportData: PropertyQuReport, public email1: string,
        public vars: WebQuoteVars[], public companyDetals: WebQuoteCompnayDetails, public webQuotebranch: WebQuoteBranch[],
        public webQuoteApps: PropertyQuoteType[]
    ) { }
    toPost(): ProfertyQuoteSaveModal {
        let branchId = null;
        if (!!this.webQuotebranch && this.webQuotebranch.length > 0) {
            const selectedBrach = this.webQuotebranch.find(i => i.branchId === this.request.branchId);
            branchId = !!selectedBrach ? selectedBrach.spitfireBranchId : null;
        }
        const temp: ProfertyQuoteSaveModal = {
            OpportunityId: this.OpportunityId,
            BranchId: branchId,
            Email1: this.email1,
            EmailTitle: !!this.companyDetals && !!this.companyDetals.emailAcceptedQuoteSubject ?
                this.companyDetals.emailAcceptedQuoteSubject : 'Thanks for instructing us',
            HtmlContent: this.htmlContent,
            PropertyQuoteViewModels: [],
            PropertyQuoteRequest: new PropertyQuRequest(this.request).toPost(),
            // tslint:disable-next-line: max-line-length
            HasDiscount: this.isApplyProfCostDis([this.request.purchesProfCostDis, this.request.saleProfCostDis, this.request.hipsProfCostDis]),
        };
        let profCostPDiscount = 0;
        let profCostSDiscount = 0;
        let profCostHDiscount = 0;

        // Setting app code which mapped in web quote
        const spitfireBuyingAppCode = this.getMappingAppCode('p');
        const spitfireSallingAppCode = this.getMappingAppCode('s');
        const spitfireHipsAppCode = this.getMappingAppCode(this.request[PropertyQuoteRequestKey.appId]);
        switch (this.request[PropertyQuoteRequestKey.appId]) {

            case PropertyQuoteApp.Buying: {
                profCostPDiscount = this.getProfesionCostDis(this.request[PropertyQuoteRequestKey.purchesProfCostDis]);
                const purchesCosts = this.reportData.pData.repVatItem
                    .concat(this.reportData.pData.repNonVatItem
                        .concat(this.reportData.pData.extraCostItems));
                return {
                    ...temp,
                    PropertyQuoteViewModels: [{
                        propertyQuoteType: this.request[PropertyQuoteRequestKey.appId],
                        propertyQuoteValuesViewModel: {
                            profCosts: this.reportData.pData.profCosts - profCostPDiscount,
                            total: this.reportData.pData.ourtot - profCostPDiscount,
                            price: this.request[PropertyQuoteRequestKey.purchesValue],
                            costs: this.calCost(this.reportData.pData, profCostPDiscount, this.reportData.pData.vat),
                            disbursement: this.reportData.pData.total,
                            appCode: spitfireBuyingAppCode
                        },
                        varList: this.mapVars('Purchase',
                            this.request[PropertyQuoteRequestKey.purchesValue],
                            this.request[PropertyQuoteRequestKey.buyLeasehold], (this.reportData.pData.profCosts - profCostPDiscount),
                            this.reportData.pData.total, purchesCosts)
                    }]
                };
            }
            case PropertyQuoteApp.Selling: {
                profCostSDiscount = this.getProfesionCostDis(this.request[PropertyQuoteRequestKey.saleProfCostDis]);
                const sellingCosts = this.reportData.sData.repVatItem
                    .concat(this.reportData.sData.repNonVatItem
                        .concat(this.reportData.sData.extraCostItems));
                return {
                    ...temp,
                    PropertyQuoteViewModels: [{
                        propertyQuoteType: this.request[PropertyQuoteRequestKey.appId],
                        propertyQuoteValuesViewModel: {
                            profCosts: this.reportData.sData.profCosts - profCostSDiscount,
                            total: this.reportData.sData.ourtot - profCostSDiscount,
                            price: this.request[PropertyQuoteRequestKey.saleValue],
                            costs: this.calCost(this.reportData.sData, profCostSDiscount, this.reportData.sData.vat),
                            disbursement: this.reportData.sData.total,
                            appCode: spitfireSallingAppCode
                        },
                        varList: this.mapVars('Sale',
                            this.request[PropertyQuoteRequestKey.saleValue],
                            this.request[PropertyQuoteRequestKey.saleleasehold], (this.reportData.sData.profCosts - profCostSDiscount),
                            this.reportData.sData.total, sellingCosts)
                    }]
                };
            }
            case PropertyQuoteApp.BuyingAndSelling: {
                profCostPDiscount = this.getProfesionCostDis(this.request[PropertyQuoteRequestKey.purchesProfCostDis]);
                profCostSDiscount = this.getProfesionCostDis(this.request[PropertyQuoteRequestKey.saleProfCostDis]);
                const sellingCosts = this.reportData.sData.repVatItem
                    .concat(this.reportData.sData.repNonVatItem
                        .concat(this.reportData.sData.extraCostItems));
                const purchesCosts = this.reportData.pData.repVatItem
                    .concat(this.reportData.pData.repNonVatItem
                        .concat(this.reportData.pData.extraCostItems));
                return {
                    ...temp,
                    PropertyQuoteViewModels: [{
                        propertyQuoteType: PropertyQuoteApp.Buying,
                        propertyQuoteValuesViewModel: {
                            profCosts: this.reportData.pData.profCosts - profCostPDiscount,
                            total: this.reportData.pData.ourtot - profCostPDiscount,
                            price: this.request[PropertyQuoteRequestKey.purchesValue],
                            costs: this.calCost(this.reportData.pData, profCostPDiscount, this.reportData.pData.vat),
                            disbursement: this.reportData.pData.total,
                            appCode: spitfireBuyingAppCode
                        },
                        varList: this.mapVars('Purchase',
                            this.request[PropertyQuoteRequestKey.purchesValue],
                            this.request[PropertyQuoteRequestKey.buyLeasehold], (this.reportData.pData.profCosts - profCostPDiscount),
                            this.reportData.pData.total, purchesCosts)
                    },
                    {
                        propertyQuoteType: PropertyQuoteApp.Selling,
                        propertyQuoteValuesViewModel: {
                            profCosts: this.reportData.sData.profCosts - profCostSDiscount,
                            total: this.reportData.sData.ourtot - profCostSDiscount,
                            price: this.request[PropertyQuoteRequestKey.saleValue],
                            costs: this.calCost(this.reportData.sData, profCostSDiscount, this.reportData.sData.vat),
                            disbursement: this.reportData.sData.total,
                            appCode: spitfireSallingAppCode
                        },
                        varList: this.mapVars('Sale',
                            this.request[PropertyQuoteRequestKey.saleValue],
                            this.request[PropertyQuoteRequestKey.saleleasehold], (this.reportData.sData.profCosts - profCostSDiscount),
                            this.reportData.sData.total, sellingCosts)
                    }]
                };
            }
            default:
                profCostHDiscount = this.getProfesionCostDis(this.request[PropertyQuoteRequestKey.hipsProfCostDis]);
                let hipVarId = null;
                const hipsCost = this.reportData.hData.repVatItem
                    .concat(this.reportData.hData.repNonVatItem
                        .concat(this.reportData.hData.extraCostItems));
                switch (this.request[PropertyQuoteRequestKey.appId]) {
                    case (PropertyQuoteApp.EquityRelease): hipVarId = 'Equity_Release'; break;
                    case (PropertyQuoteApp.ReMortgage): hipVarId = 'Re-Mortgage'; break;
                    case (PropertyQuoteApp.TransferofEquity): hipVarId = 'Transfer_of_Equity'; break;
                }
                return {
                    ...temp,
                    PropertyQuoteViewModels: [{
                        propertyQuoteType: this.request[PropertyQuoteRequestKey.appId],
                        propertyQuoteValuesViewModel: {
                            profCosts: this.reportData.hData.profCosts - profCostHDiscount,
                            total: this.reportData.hData.ourtot - profCostHDiscount,
                            price: this.request[PropertyQuoteRequestKey.saleValue],
                            costs: this.calCost(this.reportData.hData, profCostHDiscount, this.reportData.hData.vat),
                            disbursement: this.reportData.hData.total,
                            appCode: spitfireHipsAppCode
                        },
                        varList: this.mapVars(hipVarId,
                            this.request[PropertyQuoteRequestKey.hIPsValue],
                            this.request[PropertyQuoteRequestKey.hipsLeasehold], (this.reportData.hData.profCosts - profCostHDiscount),
                            this.reportData.hData.total, hipsCost)
                    }]
                };
        }
    }

    private getProfesionCostDis(discount: CostDiscount): number {
        return !!discount ? discount.discountAmount : 0;
    }

    private calCost(report: PropertyQuReportview, profCostPDiscount: number, vat: number) {
        let newCost = 0;
        let ourtot = 0;
        if (!!report) {
            if (profCostPDiscount && profCostPDiscount > 0) {
                // set new OurFee
                report.ourtot = report.ourtot - profCostPDiscount;
                // vatReduction
                const vatReductionAmout = this.vatReduction(profCostPDiscount, vat, report.profCosts);
                ourtot = report.ourtot - vatReductionAmout;
                vat = vat - vatReductionAmout;
            } else {
                ourtot = report.ourtot;
            }
            newCost = ourtot - vat;
        }
        return newCost;

    }

    private vatReduction(discountAmount: number, vat: number, profCosts: number): number {
        if (discountAmount > 0) {
            return (discountAmount * vat) / profCosts;
        } else {
            return 0;
        }
    }

    private getMappingAppCode(appID: string): string {
        if (this.webQuoteApps && this.webQuoteApps.length > 0) {
            const selectedApp = this.webQuoteApps.find(i => i.appId === appID);
            return selectedApp ? selectedApp.spitfireAppCode : null;
        }
        return null;

    }

    isApplyProfCostDis(dis: CostDiscount[]): boolean {
        let isapply = false;
        if (!!dis && dis.length > 0) {
            dis.forEach(i => {
                if (!!i && i.discountAmount && i.discountAmount > 0) {
                    isapply = true;
                }
            });
        }
        return isapply;
    }

    private mapVars(varMappingId, price: number, lease: LeaseHold, profCosts: number, disbursements: number, costs: Cost[]):
        MatterVarsViewModel[] {
        let ovList: MatterVarsViewModel[] = [];
        if (!!this.vars && this.vars.length > 0) {
            const vaers = this.vars.find(i => i.varMappingId === varMappingId);
            if (!!vaers) {
                ovList = ovList.concat([
                    { var: vaers.price, value: price.toString() },
                    // { var: vaers.lease, value: lease },
                    { var: vaers.professionalCost, value: profCosts.toString() },
                    { var: vaers.disbursements, value: disbursements.toString() }
                ]);
            }
        }
        if (costs && costs.length > 0) {
            costs.forEach(i => {
                if (i && i.varMappingId) {
                    ovList.push({ var: i.varMappingId, value: i.price ? i.price.toString() : '0.00' });
                }
            });
        }
        return ovList;

    }
}

export class MLSOpportunitySendRequest {
    constructor(public screenList: SaveScreenItem[]) { }
    toPost() {
        if (!!this.screenList) {
            return { screenList: this.groupBy(this.screenList) };
        }
        return { screenList: null };
    }


    groupBy(objectArray: SaveScreenItem[]) {
        const request: { appId: number, screens: { screenName: string, note: string }[] }[] = [];
        objectArray.forEach((obj) => {
            const temp = request.find(fi => fi.appId === obj.appId);
            if (!temp) {
                request.push({ appId: obj.appId, screens: [{ screenName: obj.screenName, note: obj.note }] });
            } else {
                temp.screens.push({ screenName: obj.screenName, note: obj.note });
                // test = { ...test, ...temp };
            }
        });
        return request;
    }



}


