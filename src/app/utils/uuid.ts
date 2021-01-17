
export function uuid(): string {
  const cryptObj = window.crypto;
  const buf = new Uint16Array(8);
  cryptObj.getRandomValues(buf);

  function s4(num: number) {
    let ret = num.toString(16);
    while (ret.length < 4) {
      ret = '0' + ret;
    }
    return ret;
  }

  return s4(buf[0]) + s4(buf[1]) + '-' + s4(buf[2]) + '-' + s4(buf[3]) + '-' +
    s4(buf[4]) + '-' + s4(buf[5]) + s4(buf[6]) + s4(buf[7]);
}
