import { QueryFilter } from "@/models/service/foundation/api-contracts/query-filter";
import { Encryption } from "@/utils/encryption";

export class BaseService {
  createQueryFilterObject(pgNo: number, pgSize: number): QueryFilter {
    const queryFilter = new QueryFilter();
    queryFilter.top = pgSize;
    queryFilter.skip = (pgNo - 1) * pgSize;
    return queryFilter;
  }

  encrypt(txt: string): string {
    return Encryption.encrypt(txt);
  }

  decrypt(txtToDecrypt: string): string {
    return Encryption.decrypt(txtToDecrypt);
  }
}
