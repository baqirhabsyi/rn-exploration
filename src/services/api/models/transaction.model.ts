export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
}

export type Transaction = {
  id: string;
  amount: number;
  unique_code: string;
  status: TransactionStatus;
  sender_bank: string;
  account_number: string;
  beneficiary_name: string;
  beneficiary_bank: string;
  remark: string;
  created_at: string; // YYYY-MM-DD HH:MM:SS
  completed_at: string; // YYYY-MM-DD HH:MM:SS
  fee: number;
};
