import { ReactNode, ComponentType } from 'react';

export interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export type SearchQueryFilter = Record<string, string>;

export interface FilterFieldMapping {
  stateKey: string;
  fieldName: string;
  skipValue?: string;
  operation?: 'EQUAL' | 'MATCH';
}

export interface UnifiedListGridFetchParams {
  pageParam: number;
  searchValue: string;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  searchQueryFilter: SearchQueryFilter;
  pageSize: number;
}

export interface UnifiedListGridFetchResult<TItem = unknown> {
  success: boolean;
  data?: TItem[];
  total?: number;
  message?: string;
}

export type UnifiedListGridFetcher<TItem = unknown> = (
  params: UnifiedListGridFetchParams,
) => Promise<UnifiedListGridFetchResult<TItem>>;

export interface UnifiedListGridCardProps<TItem = unknown> {
  data: TItem;
  refreshGrid?: () => void;
  onCheck?: (id: unknown, checked: unknown) => void;
}

export type UnifiedListGridSearchMode = 'debounced' | 'url';

export type UnifiedListGridFilterMode = 'mobile' | 'desktop';

export interface UnifiedListGridFilterSlotProps {
  mode: UnifiedListGridFilterMode;
  closeMobileFilter: () => void;
  refreshList: () => void;
}

export interface UnifiedListGridConfig {
  title: string;
  queryKey: string;
  textTotal?: [string, string];
  pageSize?: number;
  backHref?: string;
  disableFilter?: boolean;
  showCreateButton?: boolean;
  hasSidebarFilter?: boolean;
  searchField?: string;
  searchMode?: UnifiedListGridSearchMode;
  searchDebounceMs?: number;
  sortField?: string;
  filterFieldMappings?: FilterFieldMapping[];
  onMobileFilterOpen?: () => void;
  /** Poll interval in ms (e.g. status lists). Default: disabled. */
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

export interface UnifiedListGridSlots<TItem = unknown> {
  CardComponent: ComponentType<UnifiedListGridCardProps<TItem>>;
  SkeletonComponent: ComponentType;
  FilterComponent?: ComponentType<UnifiedListGridFilterSlotProps>;
  CreateButton?: ReactNode;
  EmptyComponent?: ComponentType<{ error?: string }>;
}

export interface UnifiedListGridProps<TItem = unknown> {
  config: UnifiedListGridConfig;
  slots: UnifiedListGridSlots<TItem>;
  fetcher: UnifiedListGridFetcher<TItem>;
  searchBoxList: SearchBoxItem[];
  filterBoxList?: SearchBoxItem[];
  searchQueryFilter?: SearchQueryFilter;
  refreshGrid?: boolean;
  onCheck?: (id: unknown, checked: unknown) => void;
}

export interface UnifiedListGridPageProps<TItem = unknown> extends UnifiedListGridProps<TItem> {
  skeletonHeaderName?: string;
  loadingHasCreateBtn?: boolean;
}
