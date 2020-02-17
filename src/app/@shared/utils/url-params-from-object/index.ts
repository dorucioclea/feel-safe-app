export function urlParamsFromObject(obj: any) {
  let str = '';
  for (const key in obj) {
    if (str != '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(obj[key]);
  }

  return str;
}