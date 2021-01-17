export interface UrlData {
    newsTitle: string;
    url: string;
    newsType: string;
    description?: string;
}

export enum UrlType {
    BBC = 'bbc',
    YouTube = 'youtube',
    WhuFc = 'whufc',

}
