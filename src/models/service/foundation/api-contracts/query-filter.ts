export class QueryFilter {
  skip?: number;
  top?: number;
  orderByCommand!: string;
  searchText!: string;
  searchColumns!: string;
  searchType!: string;
  filterExpression?: string;
  selectFields?: string;
  expandFields?: string;
  inlineCount?: boolean;
}
