export function sortByTitle(a: any, b: any): number {
  if (a.title < b.title) { return -1; }
  if (a.title > b.title) { return 1; }

  return 0;
}
