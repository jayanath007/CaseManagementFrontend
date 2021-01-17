
export function toQueryParams(params) {
    const qs = Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    return qs;
}

export function isMyDomainUrl(url: string) {
    if (url.startsWith('/')) {
        return true;
    }
    return url.startsWith(window.location.origin);
}

export function getExtention(fileName: string) {
    return fileName ? fileName.split('.').pop() : '';
}
