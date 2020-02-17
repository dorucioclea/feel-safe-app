export function objectFromUrlParams(params: any) {
  const obj: any = {};

  const parts = params.split('&');

  parts.forEach((part: string) => {
    const key = part.split('=')[0];
    const value = part.split('=')[1];

    obj[key] = value;
  });

  return obj;
}
