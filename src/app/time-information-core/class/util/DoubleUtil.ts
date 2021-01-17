export class DoubleUtil {

    public static roundUpToTwoDPos(value: number): number {
        const num = Math.round(value * 100.0) / 100.0;
        return parseFloat(num.toFixed(2));
    }

}
