interface ProtoItemsMeta {
  isFirstLoad?: boolean,
  isRefreshing?: boolean,
  isLoading?: boolean,
  hasMore?: boolean,
  totalCount?: number,
  error?: any,
}

export interface ProtoItems {
  items: any[],
  meta: ProtoItemsMeta,
}