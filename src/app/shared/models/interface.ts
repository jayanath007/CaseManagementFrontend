export interface Address {
    id: string;
    name: string;
    floor: string;
    address1: string;
    address2: string;
    town: string;
    state: string;
    country: string;
    postCode: string;
    coordinates: {
        latitude?: number;
        longitude?: number;
    };
    phoneNumber: string;
    url: string;
}

export interface TableColumn {
    name: string;
    propertyName: string;
    width: string;
    textAlign?: 'left' | 'right' | 'center';
    isDate?: boolean;
    dateFormat?: string;
    isCheckBox?: boolean;
    numberFormat?: string;
    isButton?: boolean;
    isInput?: boolean;
    defuiltValue?: any;
}
export interface TableRow<T> {
    data: T;
    /** don't use this for SelectInputWithTableComponent */
    selected?: boolean;
    /** only for SelectInputWithTableComponent */
    key?: string | number;
    /** only for SelectInputWithTableComponent */
    value?: string | number;

    index?: number;
}

export interface V3Error {
    message?: string;
    errorCode: string;
    errorDetail?: { key: string, value: string, Key: string, Value: string }[];
}
