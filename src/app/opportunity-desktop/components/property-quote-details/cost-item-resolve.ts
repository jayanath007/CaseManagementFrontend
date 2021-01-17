import { WebQuoteCost } from '../../../opportunity-core/models/interfaces';

export class CostItemResolve {

    public costDescription(appId, itemName, allCost: WebQuoteCost[], branchId: number): string {
        if (allCost && allCost.length > 0) {
            const item = this.getBranchRelatedCost(appId, itemName, allCost, branchId);
            if (!!item) {
                return item.description;
            }
        }
        return itemName;
    }
    public isEnabaleCost(appId: string, itemName: string, allCost: WebQuoteCost[], branchId: number): boolean {
        if (allCost && allCost.length > 0 && appId) {
            const item = this.getBranchRelatedCost(appId, itemName, allCost, branchId);
            if (item) {
                return !item.disable;
            }
        }
        return false;
    }
    private getBranchRelatedCost(appId: string, itemName: string, allCost: WebQuoteCost[], branchId: number): WebQuoteCost {
        if (allCost && allCost.length > 0) {
            const branchItem = allCost.find(i => i.appId === appId && i.itemName.toLocaleLowerCase() === itemName.toLocaleLowerCase()
                && Number(i.branchId) === Number(branchId));
            if (branchItem) {
                return branchItem;
            } else {
                return allCost.find(i => i.appId === appId && i.itemName.toLocaleLowerCase() === itemName.toLocaleLowerCase()
                    && Number(i.branchId) === 0);
            }
        }
        return null;
    }
}


