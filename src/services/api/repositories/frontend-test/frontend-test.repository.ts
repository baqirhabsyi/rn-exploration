import {HttpService} from '@services/http/http.service';
import {
  GetTransactionsRes,
  IFrontendTestRepository,
} from './frontend-test.interface.repository';

export default class FrontendTestRepository implements IFrontendTestRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly baseURL: string,
  ) {}

  getTransactions(): Promise<GetTransactionsRes> {
    return this.httpService.get<GetTransactionsRes>(
      `${this.baseURL}/frontend-test`,
    );
  }
}
