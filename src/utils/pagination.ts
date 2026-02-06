export interface PaginationViewModel {
  PageSize: number;
  totalCount: number;
  currentPage: number;
}

export function getPagesCountArray(paginationModel: PaginationViewModel): number[] {
  const totalPages = Math.ceil(paginationModel.totalCount / paginationModel.PageSize);
  return Array.from(new Array(totalPages), (x, i) => i + 1);
}
