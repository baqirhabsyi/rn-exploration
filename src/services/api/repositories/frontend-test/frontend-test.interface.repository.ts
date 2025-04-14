import {Transaction} from '../../models/transaction.model';

export type GetTransactionsRes = Record<string, Transaction>;

export interface IFrontendTestRepository {
  getTransactions(): Promise<GetTransactionsRes>;
}
