import { PropertyQuoteType } from '../../opportunity-core/models/interfaces';
import { QuoteType } from '../../opportunity-core/models/enums';

export enum PropertyQuoteApp {
    BuyingAndSelling = 'ps',
    Buying = 'p',
    Selling = 's',
    EquityRelease = 'e',
    ReMortgage = 'r',
    TransferofEquity = 't'
}

export const mapingList: { propertyQuoteApp: PropertyQuoteApp, spitfireApp: string }[] = [
    { propertyQuoteApp: PropertyQuoteApp.BuyingAndSelling, spitfireApp: 'cp' },
    { propertyQuoteApp: PropertyQuoteApp.Buying, spitfireApp: 'cp' },
    { propertyQuoteApp: PropertyQuoteApp.Selling, spitfireApp: 'cs' },
    { propertyQuoteApp: PropertyQuoteApp.EquityRelease, spitfireApp: 'er' },
    { propertyQuoteApp: PropertyQuoteApp.ReMortgage, spitfireApp: 'rm' },
    { propertyQuoteApp: PropertyQuoteApp.TransferofEquity, spitfireApp: 'te' }
];

export function getWebQuoteAppIdBySpitfireAppCode(appCode: string): PropertyQuoteApp {
    const temp = mapingList.find(i => i.spitfireApp === appCode.toLowerCase());
    return temp ? temp.propertyQuoteApp : null;
}

export function getQuoteType(types: PropertyQuoteType[], appCode: string): QuoteType {
    // resole appCode with webQuote type
    if (!!types && types.length > 0 && !!appCode) {
        const webQuteType = getWebQuoteAppIdBySpitfireAppCode(appCode);
        if (!!webQuteType && !!types.find(i => i.appId === webQuteType)) {
            return QuoteType.PropertyQuote;
        }
    }
    return QuoteType.GenaralQuote;
}


