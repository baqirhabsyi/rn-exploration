import {Transaction} from '@services/api/models/transaction.model';

export type GetTransactionsRes = Record<string, Transaction>;

export interface IFrontendTestRepository {
  getTransactions(): Promise<GetTransactionsRes>;
}
