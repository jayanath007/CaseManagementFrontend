import { CommonControllerTypes, FormType } from '../models/enums';
import { ProbCategoryWishControllersData } from './../models/interfce';


export const categoryWishControllersData: ProbCategoryWishControllersData[] = [
    // ==============================Asset ===============================================
    {
        formType: FormType.Asset,
        categoryId: 0, // 2  ok
        categoryCode: 'Jewellery',
        categorDescription: `Jewellery (valued at £500 or more) `,
        formName: 'IHT205 Box 11.2  IHT407 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jewelleryMarketValue', text: 'Value at date of death',
                styleSheet: { class: 'input-xs' }
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 1, // ok
        categoryCode: 'VehiclesBoatsAircraft',
        categorDescription: ` Vehicles, boats and aircraft `,
        formName: 'IHT205 Box 11.2  IHT407 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'vehicleManufacturer', text: 'Manufacturer',
                styleSheet: { class: 'input-md' }
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'vehicleModel', text: 'Model',
                styleSheet: { class: 'input-md' }
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'yearOfManufacture',
                text: 'Year of manufacture or first registration',
                styleSheet: { class: 'input-md' }
            }, {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'regNumber',
                text: 'Registration number,where oppropriate',
                styleSheet: { class: 'input-md' }
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'condition',
                text: 'Condition at the date of death and mileage for cars',
                styleSheet: { class: 'input-md' }
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'openMarketValue',
                text: 'Open market value at date of death',
                styleSheet: { class: 'input-md' }
            }
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 2, // ok
        categoryCode: 'AntiquesWorksOfArtCollections',
        categorDescription: ` Antiques, works of art or collections `,
        formName: 'IHT205 Box 11.2  IHT407 Box 3',
        formControllers: [

            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jewelleryMarketValue',
                text: 'Value at date of death ', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 3, // 5,25,26,29,30,31,33,34,35,40 -ok
        categoryCode: 'OtherHouseholdAndPersonalGoods',
        categorDescription: ` Household and personal goods (other)`,
        formName: 'IHT205 Box 11.2  IHT407 Box 4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total', text: 'total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 4, // ok
        categoryCode: 'ItemsReferredInTheWillNotIncludedOnThisForm',
        categorDescription: ` Items referred to in the will and not included in the estate `,
        formName: 'IHT400 Box 28',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'itemGivenTo',
                text: 'Who was the item given or sold to, or what happened to it?', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'whatDeceasedDidWithProceeds',
                text: 'If the item was sold, what did the deceased do with the sale proceeds?', styleSheet: {}
            }
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 5, // ok
        categoryCode: 'Cash',
        categorDescription: ` Cash and Uncashed traveller's cheques `,
        formName: 'IHT205 Box 11.1  IHT400 Box 53',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 6, // ok
        categoryCode: 'Pension',
        categorDescription: ` Pensions (non-state) `,
        formName: 'IHT205 Box 11.11  IHT409 Box 7',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'pensionTotal',
                text: 'Total', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isPensionChanges2Years',
                text: 'Tick to Include changes mode to pension within 2 years of date of death', styleSheet: {}
            }
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 7, // ok
        categoryCode: 'BankBuildingSocietyAccounts',
        categorDescription: `Bank and building society accounts - sole accounts`,
        formName: 'IHT205 Box 11.1  IHT406 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'bankOrBuildingSociety',
                text: 'Name of bank or building society', styleSheet: {}, requiredField: true
            }, {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'bankAccountNo',
                text: 'Account number / roll or reference number', styleSheet: {}, requiredField: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'bankAmountHeld',
                text: 'Amount held at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'bankInterest',
                text: 'Interest', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalBank',
                text: 'Total amount', styleSheet: {}, disabled: true
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 8, // ok
        categoryCode: 'NationalSavingsAccounts',
        categorDescription: ` National Savings Accounts `,
        formName: 'IHT205 Box 11.1  IHT406 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'typeOfAccount',
                text: 'Type of account(for example, Investment, DirectISA)', styleSheet: {}, requiredField: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'nationalSavingsAccountNo',
                text: ' Account number', styleSheet: {}, requiredField: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'nationalSavingsAmountHeld',
                text: 'Amount held DOD', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'nationalSavingsInterest',
                text: 'Interest', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'nationalSavingsTotal',
                text: 'Total', styleSheet: {}, disabled: true
            }
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 9, // ok
        categoryCode: 'PremiumBonds',
        categorDescription: ` Premium Bonds `,
        formName: 'IHT205 Box 11.1  IHT406 Box 3',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'bondNo',
                text: 'Bond number', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'bondValue',
                text: 'Bond value at date of death(A)', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueUnclaimedPrizes',
                text: 'Value of any unclaimed or uncashed prizes(B)', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalBondValue',
                text: 'Total(A + B)', styleSheet: {}, disabled: true
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 10, // ok
        categoryCode: 'OtherNationalSavingsInvestmentsProducts',
        categorDescription: ` National Savings (other products) `,
        formName: 'IHT205 Box 11.1  IHT406 Box 4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'otherTypeOfAccount',
                text: 'Type of account(for example, Investment, Direct ISA)', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'certificateNo',
                text: 'Certificate number', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'otherNationalAmount',
                text: 'Amount held, including interest, at date of death', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 11, // 12,16,41
        categoryCode: 'DeceasedsResidence',
        categorDescription: ` Deceased's residence (excluding farmhouses) `,
        formName: 'IHT205 Box 11.8 IHT405 Box 7',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'propertyItemNo',
                text: 'Property Item No', styleSheet: {}, disabled: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'residencePostCode',
                text: 'Postcode of property', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'tenure',
                text: 'Tenure', styleSheet: {}, valueArray: [`Freehold`, `Leasehold`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'detailsOfLettings',
                text: 'Details of lettings/leases ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueOfAgriBusiness',
                text: 'Value of  agricultural business or woodlands relief or heritage exemption deduction ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isAgriRelief',
                text: 'Agricultural Relief', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isBusinessRelief',
                text: 'Business Relief', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'openMarketValueProperty',
                text: 'Value at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Residence Nil Rate Band', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbOwnedByDeceased',
                text: 'Residence owned and lived in by the deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbInheritedByDescendents',
                text: 'Residence  is inherited by the direct descendants of the deceased', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 12,
        categoryCode: 'OtherLandBuildingsRightsOverLand',
        categorDescription: `Land, buildings and rights over land (other) `,
        formName: 'IHT205 Box 11.10  IHT405 Box 8',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'buildingLandType',
                text: 'Type', styleSheet: {}, valueArray: [`Businesses inc. farm businesses, assets and timber`,
                    `Farms, farmhouses and farmland`,
                    `Other land, buildings and rights over land`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'propertyItemNo',
                text: 'Property Item No', styleSheet: {}, disabled: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'residencePostCode',
                text: 'Postcode of property', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'tenure',
                text: 'Tenure', styleSheet: {}, valueArray: [`Freehold`, `Leasehold`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'detailsOfLettings',
                text: 'Details of lettings/leases ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueOfAgriBusiness',
                text: 'Value of  agricultural business or woodlands relief or heritage exemption deduction ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'openMarketValueProperty',
                text: 'Value at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Residence Nil Rate Band', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbOwnedByDeceased',
                text: 'Residence owned and lived in by the deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbInheritedByDescendents',
                text: 'Residence  is inherited by the direct descendants of the deceased', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 13, // 14,15
        categoryCode: 'JointlyOwnedHousesBulidingsLand',
        categorDescription: ` Jointly owned houses, buildings, land`,
        formName: 'IHT205 Box 9.2  IHT404 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'jointAssetType',
                text: 'Type of joint asset', styleSheet: {}, valueArray: [`Deceased's residence`,
                    'Freehold/leasehold residential property (other)', `Land, buildings and rights over land (other)`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'jointOwner',
                text: 'Name and relationship owner', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'jointOwnershipStartDate',
                text: 'Date joint ownership started', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isJointNotApplicable',
                text: 'Not Applicable', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.JointlyOwnedAssetsTypes, name: 'jointContribution',
                text: 'Contribution by joint owner %', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.JointlyOwnedAssetsTypes, name: 'jointShare',
                text: 'Share of income received %', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointValueDateOfDeath',
                text: 'Value at DOD', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointDeceasedShare',
                text: 'Deceaseds share at DOD', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 14,
        categoryCode: 'JointlyOwnedSharesSecurities',
        categorDescription: ` Jointly owned shares and securities`,
        formName: 'IHT205 Box 9.2  IHT404 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'jointAssetType',
                text: 'Type of joint asset', styleSheet: { class: 'JointlyOwnedSharesSecurities' }, valueArray: [
                    `Stocks and shares - listed, that did not give the deceased control of the company`,
                    `Stocks and shares - listed, that gave the deceased control of the company`,
                    `Stocks and shares - traded unlisted, that did not give the deceased control of the company`,
                    `Stocks and shares - traded unlisted, that gave the deceased control of the company`,
                    `Stocks and shares - UK Government and municipal securities`,
                    `Stocks and shares - unlisted, that did not give the deceased control of the company`,
                    `Stocks and shares - unlisted, that gave the deceased control of the company`,
                ]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'jointOwner',
                text: 'Name and relationship owner', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'jointOwnershipStartDate',
                text: 'Date joint ownership started', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isJointNotApplicable',
                text: 'Not Applicable', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.JointlyOwnedAssetsTypes, name: 'jointContribution',
                text: 'Contribution by joint owner %', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.JointlyOwnedAssetsTypes, name: 'jointShare',
                text: 'Share of income received %', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointValueDateOfDeath',
                text: 'Value at DOD', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointDeceasedShare',
                text: 'Deceaseds share at DOD', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 15,
        categoryCode: 'OtherJointlyOwnedAssets',
        categorDescription: ` Jointly owned assets (other) `,
        formName: 'IHT205 Box 9.2  IHT404 Box 6',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'jointAssetType',
                text: 'Type of joint asset', styleSheet: { class: 'OtherJointlyOwnedAssets' }, valueArray: [
                    `Antiques, works of art or collections`,
                    `Bank and building society accounts`,
                    `Cash and Uncashed traveller's cheques`,
                    `Household and personal goods (other)`,
                    `Interest in another estate (houses, land, businesses, shares)`,
                    `Interest in another estate (other)`,
                    `Jewellery`,
                    `Life assurance policies`,
                    `Life assurance policies that benefit deceased`,
                    `National Savings (other products)`,
                    `National Savings Accounts`,
                    `Premium Bonds`,
                    `Vehicles, boats and aircraft`,
                ]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'jointOwner',
                text: 'Name and relationship owner', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'jointOwnershipStartDate',
                text: 'Date joint ownership started', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isJointNotApplicable',
                text: 'Not Applicable', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.JointlyOwnedAssetsTypes, name: 'jointContribution',
                text: 'Contribution by joint owner %', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.JointlyOwnedAssetsTypes, name: 'jointShare',
                text: 'Share of income received %', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointValueDateOfDeath',
                text: 'Value at DOD', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointDeceasedShare',
                text: `Deceased's share at DOD`, styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 16,
        categoryCode: 'DeceasedsResidencyForTaxPurposes',
        categorDescription: ` Deceased's residency for tax purposes `,
        formName: 'IHT401 Box 6',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'propertyItemNo',
                text: 'Property Item No', styleSheet: {}, disabled: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'residencePostCode',
                text: 'Postcode of property', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'tenure',
                text: 'Tenure', styleSheet: {}, valueArray: [`Freehold`, `Leasehold`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'detailsOfLettings',
                text: 'Details of lettings/leases ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueOfAgriBusiness',
                text: 'Value of  agricultural business or woodlands relief or heritage exemption deduction ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'openMarketValueProperty',
                text: 'Value at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Residence Nil Rate Band', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbOwnedByDeceased',
                text: 'Residence owned and lived in by the deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbInheritedByDescendents',
                text: 'Residence  is inherited by the direct descendants of the deceased', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 17, // ok
        categoryCode: 'HouseholdPersonalGoodsDonatedToCharity',
        categorDescription: ` Household and personal goods donated to charity`,
        formName: 'IHT205 Box 11.2, Box J  IHT408 Schedule of items',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'nameOfCharity',
                text: 'Name of charity', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueOfCharityItems',
                text: 'Value of the item(s)', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 18, // ok 19
        categoryCode: 'UKGovernmentMunicipalSecurities',
        categorDescription: `Stocks and shares - UK Government and municipal securities`,
        formName: 'IHT205 Box 11.3  IHT411 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfStockHeld',
                text: 'Amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPricePerUnit',
                text: 'Market price per unit at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfStock',
                text: 'Total value of stock at date of death', styleSheet: {}, disabled: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'interestOrDividendDue',
                text: 'Dividend or interest due to date of death', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 19, // ok
        categoryCode: 'ListedStocksSharesInvestmentsThatDidNotGiveControlOfCompany',
        categorDescription: `Stocks and shares - listed, that did not give the deceased control of the company`,
        formName: 'IHT205 Box 11.3  IHT411 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfStockHeld',
                text: 'Amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPricePerUnit',
                text: 'Market price per unit at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfStock',
                text: 'Total value of stock at date of death', styleSheet: {}, disabled: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'interestOrDividendDue',
                text: 'Dividend or interest due to date of death', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 20, // ok 21,22,23,24
        categoryCode: 'TradedUnlistedStocksSharesThatDidNotGiveControlOfCompany',
        categorDescription: ` Stocks and shares - traded unlisted, that did not give the deceased control of the company `,
        formName: 'IHT205 Box 11.4  IHT412 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'noOfShares',
                text: 'Number of shares or amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPriceOfShare',
                text: 'Market price of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfShares',
                text: 'Total value of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'dividendDue',
                text: 'Dividend  due to date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfBrDue',
                text: 'Amount of business relief(BR) due', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Owned for two years', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
                text: 'Yes', styleSheet: {}, valueArray: ['Yes', 'No']
            },
            // {
            //     cols: 2, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
            //     text: 'No', styleSheet: {}
            // },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Rate of BR', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR100',
                text: '100%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR50',
                text: '50%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR0',
                text: '0%', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 21, // ok
        categoryCode: 'UnlistedStocksSharesThatDidNotGiveControlOfCompany',
        categorDescription: ` Stocks and shares - unlisted, that did not give the deceased control of the company `,
        formName: 'IHT205 Box 11.4  IHT412 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'noOfShares',
                text: 'Number of shares or amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPriceOfShare',
                text: 'Market price of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfShares',
                text: 'Total value of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'dividendDue',
                text: 'Dividend  due to date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfBrDue',
                text: 'Amount of business relief(BR) due', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Owned for two years', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
                text: 'Yes', styleSheet: {}, valueArray: ['Yes', 'No']
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Rate of BR', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR100',
                text: '100%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR50',
                text: '50%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR0',
                text: '0%', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 22, // ok
        categoryCode: 'UnlistedStocksSharesThatGaveControlOfCompany',
        categorDescription: ` Stocks and shares - unlisted, that gave the deceased control of the company `,
        formName: 'IHT205 Box 11.4  IHT412 Box 3',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'noOfShares',
                text: 'Number of shares or amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPriceOfShare',
                text: 'Market price of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfShares',
                text: 'Total value of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'dividendDue',
                text: 'Dividend  due to date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfBrDue',
                text: 'Amount of business relief(BR) due', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Owned for two years', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
                text: 'Yes', styleSheet: {}, valueArray: ['Yes', 'No']
            },
            // {
            //     cols: 2, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
            //     text: 'No', styleSheet: {}
            // },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Rate of BR', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR100',
                text: '100%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR50',
                text: '50%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR0',
                text: '0%', styleSheet: {}
            },


        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 23, // ok
        categoryCode: 'TradedUnlistedStocksSharesThatGaveControlOfCompany',
        categorDescription: `Stocks and shares - traded unlisted, that gave the deceased control of the company`,
        formName: 'IHT205 Box 11.4  IHT412 Box 4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'noOfShares',
                text: 'Number of shares or amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPriceOfShare',
                text: 'Market price of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfShares',
                text: 'Total value of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'dividendDue',
                text: 'Dividend  due to date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfBrDue',
                text: 'Amount of business relief(BR) due', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Owned for two years', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
                text: 'Yes', styleSheet: {}, valueArray: ['Yes', 'No']
            },
            // {
            //     cols: 2, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
            //     text: 'No', styleSheet: {}
            // },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Rate of BR', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR100',
                text: '100%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR50',
                text: '50%', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR0',
                text: '0%', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 24, // ok
        categoryCode: 'ListedStocksSharesThatGaveControlOfCompany',
        categorDescription: ` Stocks and shares - listed, that gave the deceased control of the company`,
        formName: 'IHT205 Box 11.3  IHT412 Box 5',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'noOfShares',
                text: 'Number of shares or amount of stock held', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'marketPriceOfShare',
                text: 'Market price of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalValueOfShares',
                text: 'Total value of shares/stock at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'dividendDue',
                text: 'Dividend  due to date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfBrDue',
                text: 'Amount of business relief(BR) due', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Owned for two years', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
                text: 'Yes', styleSheet: {}, valueArray: ['Yes', 'No']
            },
            // {
            //     cols: 2, rows: 1, type: CommonControllerTypes.RadioBtn, name: 'isOwnedForTwoYearsYes',
            //     text: 'No', styleSheet: {}
            // },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Rate of BR', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR100',
                text: '100%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR50',
                text: '50%', styleSheet: {}
            },
            {
                cols: 1, rows: 1, type: CommonControllerTypes.SingleRadioBtn, name: 'isRateOfBR0',
                text: '0%', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 25, // ok
        categoryCode: 'InterestInAnotherEstateHousesLandBusinessesShares',
        categorDescription: `Interest in another estate (houses, land, businesses, shares)`,
        formName: 'IHT205 Box 11.7  IHT415 Box 7',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 26, // ok
        categoryCode: 'OtherInterestInAnotherEstate',
        categorDescription: ` Interest in another estate (other)`,
        formName: 'IHT205 Box 11.7  IHT415 Box 9',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 27, // ok 28
        categoryCode: 'ForeignAssetsHousesLandBuildingsBusinessesShares',
        categorDescription: `Foreign assets (houses, land, buildings, businesses, shares)`,
        formName: 'IHT417 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueForeignCurrency',
                text: 'Value at the date of death in foreign currency', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.FourDecimal, name: 'exchangeRate',
                text: 'Exchange rate at the date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.TwoDecimal, name: 'valueSterling',
                text: `Value at the date of death £ sterling`, styleSheet: {}, disabled: true
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 28, // ok
        categoryCode: 'OtherForeignAssets',
        categorDescription: ` Foreign assets (other)`,
        formName: 'IHT205 Box 9.5 IHT417 Box 6',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueForeignCurrency',
                text: 'Value at the date of death in foreign currency', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.FourDecimal, name: 'exchangeRate',
                text: 'Exchange rate at the date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.TwoDecimal, name: 'valueSterling',
                text: 'Value at the date of death sterling', styleSheet: {}, disabled: true
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 29, // ok
        categoryCode: 'AssetsInTheTrustOnWhichTheTrusteesDoNotWishToPayTaxNow',
        categorDescription: ` Assets in the trust on which the trustees do not wish to pay tax now`,
        formName: 'IHT418 Box 18',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 30,  // ok
        categoryCode: 'IncomeTaxOrCapitalGainsTaxRepayment',
        categorDescription: ` Income Tax or Capital Gains Tax repayment"`,
        formName: 'IHT205 Box 11.11 IHT400 Box 74',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },

    {
        formType: FormType.Asset,
        categoryId: 31,
        categoryCode: 'TrustIncomeDueToTheDeceased',
        categorDescription: `Trust income due to the deceased"`,
        formName: 'IHT205 Box 11.11 IHT400 Box 75',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 32, // ok
        categoryCode: 'DebtsDueToTheEstate',
        categorDescription: ` Debts due to the estate`,
        formName: 'IHT205 Box 11.6  IHT416 Box 3',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'capital',
                text: 'Capital', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'interest',
                text: ' Interest', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalCapitalInterest',
                text: 'Total', styleSheet: {}, disabled: true
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 33, // ok
        categoryCode: 'OtherAssetsOrIncomeDueToTheDeceased',
        categorDescription: ` Assets or income due to the deceased (other)`,
        formName: 'IHT205 Box 11.11 IHT400 Box 76',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 34, // ok
        categoryCode: 'AssetsInTheTrustHousesBulidingsLandSharesSecurities',
        categorDescription: ` Assets in the trust (houses, bulidings, land, shares and securities)`,
        formName: 'IHT205 Box 9.3  IHT418 Box 8',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 35, // ok
        categoryCode: 'OtherAssetsInTheTrust',
        categorDescription: ` Assets in the trust (other)`,
        formName: 'IHT205 Box 9.3  IHT418 Box 13',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 36, // ok
        categoryCode: 'LifeAssurancePolicies',
        categorDescription: `Life assurance policies (on life of deceased)"`,
        formName: 'IHT205 Box 11.5  IHT410 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'payableInsuranceCompany',
                text: 'Name of insurance company', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'payablePolicyNo',
                text: 'Policy Number', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountPayable',
                text: 'Amount payable,including bonuses', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 37, // ok
        categoryCode: 'LifeAssurancePoliciesThatBenefitDeceased',
        categorDescription: `Life assurance policies that benefit deceased`,
        formName: 'IHT205 Box 11.5  IHT410 Box 5',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'lifeAssuranceCompany',
                text: 'Name of insurance company', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'lifeAssurancePolicyNo',
                text: 'Policy Number', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'personAssured',
                text: 'Name of person assured', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueLifeAssurance',
                text: 'Value of policy provided by insurance company at the date of death', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 38, // ok
        categoryCode: 'PaymentsMadeAfterTheDeceasedsDeath',
        categorDescription: ` Payments made after the deceased's death"`,
        formName: 'IHT410 Box 8',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'companyThatProvidedPolicy',
                text: 'Company that provided the policy', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'frequencyOfPayments',
                text: 'Frequency payments made', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'detailsOfIncrease',
                text: 'Details of increase in payments,if any', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'finalPaymentDate',
                text: 'Date of final guaranteed payment', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueOfPayment',
                text: 'Value of the right to receive the remainder of the payment', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 39, // ok
        categoryCode: 'LumpSumPaymentMadeOnTheDeceasedsDeath',
        categorDescription: `Lump sum payment made on the deceased's death"`,
        formName: 'IHT205 Box 11.11  IHT410 Box 11',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'lumpSumCompany',
                text: 'Company that provided the policy', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'explaination',
                text: 'How the decease disposed of the right to receive the lump sum', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueLumpSum',
                text: 'Value of the lump sum', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 40, // ok
        categoryCode: 'NominatedAssets',
        categorDescription: ` Nominated assets"`,
        formName: 'IHT205 Box 9.4  IHT400 Box 101',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 41,
        categoryCode: 'OtherFreeholdLeaseholdResidentialProperty',
        categorDescription: ` Freehold/leasehold residential property (other)`,
        formName: 'IHT205 Box 11.9  IHT405 Box 8',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'buildingLandType',
                text: 'Type', styleSheet: {}, valueArray: [`Businesses inc. farm businesses, assets and timber`,
                    `Farms, farmhouses and farmland`,
                    `Other land, buildings and rights over land`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'propertyItemNo',
                text: 'Property Item No', styleSheet: {}, disabled: true
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'residencePostCode',
                text: 'Postcode of property', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'tenure',
                text: 'Tenure', styleSheet: {}, valueArray: [`Freehold`, `Leasehold`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'detailsOfLettings',
                text: 'Details of lettings/leases ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueOfAgriBusiness',
                text: 'Value of  agricultural business or woodlands relief or heritage exemption deduction ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'openMarketValueProperty',
                text: 'Value at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Residence Nil Rate Band', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbOwnedByDeceased',
                text: 'Residence owned and lived in by the deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isRnrbInheritedByDescendents',
                text: 'Residence  is inherited by the direct descendants of the deceased', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Asset,
        categoryId: 42, // ok
        categoryCode: 'PartnershipAndBusinessInterests',
        categorDescription: `Partnership and business interests`,
        formName: 'IHT205 Box 11.7  IHT400 Box 69',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'partnershipValue',
                text: 'Value at date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'partnershipRelief',
                text: 'Value of business relief', styleSheet: {}
            },

        ]
    },
    // ==============================Liability ===============================================
    {
        formType: FormType.Liability,
        categoryId: 0, // ok 0/5/6/10
        categoryCode: 'OtherLiabilities',
        categorDescription: `Liabilities (other)`,
        formName: 'IHT400 Box 82',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },


        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 1, // ok need to check DropDown value
        categoryCode: 'JointlyOwnedAssets',
        categorDescription: `Jointly owned houses, bulidings, land, shares and securities`,
        formName: 'IHT205 Box 10.1 or 10.2  IHT404 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.LiabilityAssetDropDown, name: 'jointLiabilities',
                text: 'Joint Assets for Liability', styleSheet: {}, valueArray: ['Testing1', 'Testing2']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'jointLiabilityCreditor',
                text: 'Name of creditor', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointLiabilityAmount',
                text: 'Total amount outstanding at DOD', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointLiabilityShare',
                text: 'Deceased (s) share of  amount outstanding at DOD', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 2, // ok need to check DropDown value
        categoryCode: 'OtherJointlyOwnedAssets',
        categorDescription: `Jointly owned assets (other)`,
        formName: 'IHT205 Box 10.2  IHT404 Box 7',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.LiabilityAssetDropDown, name: 'jointLiabilities',
                text: 'Joint Assets for Liability', styleSheet: {}, valueArray: ['Testing1', 'Testing2']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'jointLiabilityCreditor',
                text: 'Name of creditor', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointLiabilityAmount',
                text: 'Total amount outstanding at DOD', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'jointLiabilityShare',
                text: ` Deceased 's share of  amount outstanding at DOD`, styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 3, // ok
        categoryCode: 'Mortgages',
        categorDescription: `Mortgages`,
        formName: 'IHT205 Box 12.2  IHT400 Box 80',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'mortgageCreditor',
                text: 'Name of creditor ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'mortgageAmount',
                text: 'Amount ', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 4, // ok
        categoryCode: 'Funeral',
        categorDescription: `Funeral`,
        formName: 'IHT205 Box 12.1  IHT400 Box 81',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'funeralCosts',
                text: 'Funeral costs', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'headstone',
                text: 'Headstone', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Other cost', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Description', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'Value', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.TableInputBox, name: 'otherFuneral1',
                text: '', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.TableAmount, name: 'funeralValue1',
                text: '', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.TableInputBox, name: 'otherFuneral2',
                text: '', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.TableAmount, name: 'funeralValue2',
                text: '', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.TableInputBox, name: 'otherFuneral3',
                text: '', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.TableAmount, name: 'funeralValue3',
                text: '', styleSheet: {}
            },
            {
                cols: 2, rows: 1, type: CommonControllerTypes.TableInputBox, name: 'otherFuneral4',
                text: '', styleSheet: {}
            },
            {
                cols: 4, rows: 1, type: CommonControllerTypes.TableAmount, name: 'funeralValue4',
                text: '', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalFuneral',
                text: 'Total', styleSheet: {}, disabled: true
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 5, // ok 1/5/6/10
        categoryCode: 'AssetsInTheTrustHousesBulidingsLandSharesSecurities',
        categorDescription: `Assets in the trust (houses, bulidings, land, shares and securities)`,
        formName: 'IHT400 Box 9',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 6, // ok
        categoryCode: 'OtherAssetsInTheTrust',
        categorDescription: `Assets in the trust (other)`,
        formName: 'IHT418 Box 14',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 7, // ok
        categoryCode: 'MoneySpentOnTheDeceasedsBehalf',
        categorDescription: `Money spent on the deceased's behalf`,
        formName: 'IHT419 Box 1',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'personSpentMoney',
                text: 'Name of person who spent the money', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'spentRelationship',
                text: 'Relationship to deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'whatMoneySpentOn',
                text: 'What was money spent on', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'whyDeceasedMoneyNotUsed',
                text: 'Explain why deceased(s) own money not used', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'whyMoneyWasntRepaid',
                text: 'Explain why the money was not repaid during the deceased(s) lifetime', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountSpent',
                text: 'Value Amount spent', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 8, // ok
        categoryCode: 'GuaranteedDebts',
        categorDescription: `Guaranteed debts`,
        formName: 'IHT419 Box 4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'nameOfGuaranteed',
                text: 'Name of person debts guaranteed', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'guaranteedRelationship',
                text: 'Relationship to deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isCalledUptoToRepay',
                text: 'Was deceased called upon to repay loan?', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'whyLoanDeducted',
                text: 'If NO, why should loan be deducted from estate', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountDebtGuaranteed',
                text: 'Amount of debt guaranteed', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 9, // ok
        categoryCode: 'LoansFromPersonThatReceivedGift',
        categorDescription: `Loans from person to whom gift made`,
        formName: 'IHT419 Box 5',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'loanDate',
                text: 'Date of loan ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountLoan',
                text: 'Amount of loan ', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'amountOfPayments',
                text: 'Amount paid', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'whereIsMoney',
                text: 'What did deceased use money for and where is it reflected in the estate ', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 10, // ok
        categoryCode: 'DebtsOwingToPersonsOutsideTheUK',
        categorDescription: `Foreign assets - debts owed`,
        formName: 'IHT205 Box 10.4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 11, // Ok 12
        categoryCode: 'ForeignAssetsHousesLandBuildingsBusinessesShares',
        categorDescription: `Foreign assets (houses, land, buildings, businesses, shares)`,
        formName: 'IHT417 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueForeignCurrency',
                text: 'Liability at the date of death in foreign currency', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.FourDecimal, name: 'exchangeRate',
                text: 'Exchange rate at the date of death', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.TwoDecimal, name: 'valueSterling',
                text: 'Liability at the date of death £ sterling', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 12, // Ok
        categoryCode: 'OtherForeignAssets',
        categorDescription: `Foreign assets (other)`,
        formName: 'IHT417 Box 7',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'valueForeignCurrency',
                text: `Liability at the date of death in foreign currency`, styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.FourDecimal, name: 'exchangeRate',
                text: `Exchange rate at the date of death`, styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.TwoDecimal, name: 'valueSterling',
                text: `Liability at the date of death sterling`, styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 13, // ok
        categoryCode: 'Loans',
        categorDescription: `Loans`,
        formName: 'IHT419 Box 2',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'loanLender',
                text: 'Name of lender', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'loanRelationship',
                text: 'Relationship to the deceased', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'loanStartDate',
                text: 'Date of loan', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'loanPurpose',
                text: 'State the purpose of the loan and where the money is reflected in the', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.CheckBox, name: 'isLoanSecured',
                text: 'Was the loan secured on any property?', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'loanOriginalAmount',
                text: 'original amount of the loan', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'loanOutstandingDOD',
                text: 'Amount outstanding at DOD', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Liability,
        categoryId: 14, // need to veryfy from backend
        categoryCode: 'LiabilitiesRelatedToAnInsurancePolicy',
        categorDescription: `NEW - CHECK - Liabilities related to an insurance policy`,
        formName: '',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Value at date of death', styleSheet: {}
            },

        ]
    },
    // ============================== Gift===============================================
    {
        formType: FormType.Gift,
        categoryId: 0,
        categoryCode: 'GiftsMadeWithinSevenYearsBeforeDeath',
        categorDescription: `Gifts made within the seven years before death`,
        formName: 'IHT205 Box 9.1  IHT403 Box 7',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'dateOfGift',
                text: 'Date of Gift', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'valueDateOfGift',
                text: 'Value at DOG', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'exemptionAllowance',
                text: 'Exemption Allowance', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'giftBeneficiary',
                text: 'Beneficiary', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'giftExemption',
                text: 'Relief', styleSheet: {}, valueArray: ['No Relief', 'Relief']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Percentage, name: 'reliefPercentage',
                text: 'Relief Value %', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Gift,
        categoryId: 1,
        categoryCode: 'GiftsWithReservationOfBenefit',
        categorDescription: `Gifts with reservation of benefit`,
        formName: 'IHT403 Box 12',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'dateOfGift',
                text: 'Date of Gift', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'valueDateOfGift',
                text: 'Value at DOG', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'exemptionAllowance',
                text: 'Exemption Allowance', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'giftBeneficiary',
                text: 'Beneficiary', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'giftExemption',
                text: 'Relief', styleSheet: {}, valueArray: ['No Relief', 'Relief']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Percentage, name: 'reliefPercentage',
                text: 'Relief Value %', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Gift,
        categoryId: 2,
        categoryCode: 'PreownedAssets',
        categorDescription: `Pre-owned assets (POA)`,
        formName: 'IHT403 Box 16',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'preOwnedAssetDateOfGift',
                text: 'Date of Gift', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'preOwnedAssetValueGift',
                text: 'Value at DOG', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'preOwnedAssetRefNo',
                text: 'POA reference no', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'preOwnedAssetBeneficary',
                text: 'Beneficiary', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'preOwnedAssetExemption',
                text: 'Exemption', styleSheet: {}, valueArray: ['No Exemption', 'Relief']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Percentage, name: 'preOwnedAssetRelief',
                text: 'Relief Value %', styleSheet: {}
            },

        ]
    },
    {
        formType: FormType.Gift,
        categoryId: 3,
        categoryCode: 'EarlierTransfers',
        categorDescription: `Earlier transfers`,
        formName: 'IHT403 Box 19',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'dateOfGift',
                text: 'Date of Gift', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'valueDateOfGift',
                text: 'Value at DOG', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'exemptionAllowance',
                text: 'Exemption Allowance', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'giftBeneficiary',
                text: 'Beneficiary', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'giftExemption',
                text: 'Relief', styleSheet: {}, valueArray: ['No Relief', 'Relief']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Percentage, name: 'reliefPercentage',
                text: 'Relief Value %', styleSheet: {}
            },
        ]
    },
    {
        formType: FormType.Gift,
        categoryId: 4,
        categoryCode: 'Specific',
        categorDescription: `Specific`,
        formName: 'IHT403 Box 19',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DatePicker, name: 'dateOfGift',
                text: 'Date of Gift', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'valueDateOfGift',
                text: 'Value at DOG', styleSheet: {}
            },
            {
                cols: 3, rows: 1, type: CommonControllerTypes.Amount, name: 'exemptionAllowance',
                text: 'Exemption Allowance', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Input, name: 'giftBeneficiary',
                text: 'Beneficiary', styleSheet: {}
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.DropDown, name: 'giftExemption',
                text: 'Relief', styleSheet: {}, valueArray: ['No Relief', 'Relief']
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Percentage, name: 'reliefPercentage',
                text: 'Relief Value %', styleSheet: {}
            },
        ]
    },
    // ========================Exemption=====================================================
    {
        formType: FormType.Exemption,
        categoryId: 0,
        categoryCode: 'SolelyOwnedExemptionsColumnA',
        categorDescription: `Solely owned exemptions (Column A)`,
        formName: 'IHT400 Box 92',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 1,
        categoryCode: 'SolelyOwnedExemptionsColumnB',
        categorDescription: `Solely owned exemptions (Column B)`,
        formName: 'IHT400 Box 93',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 2,
        categoryCode: 'JointlyOwnedAssets',
        categorDescription: `Jointly owned houses, bulidings, land, shares and securities`,
        formName: 'IHT404 Box 4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.ExemptionAssetDropDown, name: 'jointExemption',
                text: 'Joint assets for exemption', styleSheet: {}, valueArray: [`Test Gift`, `Test Gift`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalJointExemption',
                text: 'Total amount', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 3,
        categoryCode: 'OtherJointlyOwnedAssets',
        categorDescription: `Jointly owned assets (other)`,
        formName: 'IHT404 Box 9',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.ExemptionAssetDropDown, name: 'jointExemption',
                text: 'Joint assets for exemption', styleSheet: {}, valueArray: [`Test Gift`, `Test Gift`]
            },
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'totalJointExemption',
                text: 'Total amount', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 4,
        categoryCode: 'AssetsInTheTrustHousesBulidingsLandSharesSecurities',
        categorDescription: `Assets in the trust (houses, bulidings, land, shares and securities)`,
        formName: 'IHT418 Box 11',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 5,
        categoryCode: 'OtherAssetsInTheTrust',
        categorDescription: `Assets in the trust (other)`,
        formName: 'IHT400 Box 16',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 6,
        categoryCode: 'ForeignAssetsHousesLandBuildingsBusinessesShares',
        categorDescription: `Foreign assets (houses, land, buildings, businesses, shares)`,
        formName: 'IHT417 Box 4',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 7,
        categoryCode: 'OtherForeignAssets',
        categorDescription: `Foreign assets (other)`,
        formName: 'IHT417 Box 9',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Amount, name: 'total',
                text: 'Total', styleSheet: {}
            }

        ]
    },
    {
        formType: FormType.Exemption,
        categoryId: 8,
        categoryCode: 'SpouseOrCivilPartnerExemption',
        categorDescription: `Spouse or Civil Partner Exemption`,
        formName: '',
        formControllers: [
            {
                cols: 6, rows: 1, type: CommonControllerTypes.Label, name: '',
                text: 'No Data', styleSheet: {}
            }

        ]
    },
    // =============================================================================
];
