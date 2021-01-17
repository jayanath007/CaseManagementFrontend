export function isMobile() {
    return {
        Android: () => navigator.userAgent.match(/Android/i),
        BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
        IOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
        Opera: () => navigator.userAgent.match(/Opera Mini/i),
        Windows: () => navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i),
        any: () => (isMobile().Android() || isMobile().BlackBerry() ||
        isMobile().IOS() || isMobile().Opera() || isMobile().Windows())
    };
}
