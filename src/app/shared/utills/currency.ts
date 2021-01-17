
export function parseFloatCurrency(text) {
    if (isNaN(text)) {
        return parseFloat(text.replace("£", "").replace("$", ""));
    }
    return text;
}
