export function harmonizeLoopbackFilter(filter: any) {
  if (filter.where && !filter.where.and) {
    filter.where = {
      and: [
        filter.where,
      ],
    };
  }

  if (!filter.where) {
    filter.where = {
      and: [],
    };
  }

  return filter;
}