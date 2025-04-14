import {HttpService} from '../../../http/http.service';
import {
  GetTransactionsRes,
  IFrontendTestRepository,
} from './frontend-test.interface.repository';

function createFrontendTestRepository(
  httpService: HttpService,
  baseURL: string,
): IFrontendTestRepository {
  function getTransactions(): Promise<GetTransactionsRes> {
    return httpService.get<GetTransactionsRes>(`${baseURL}/frontend-test`);
  }

  return {
    getTransactions,
  };
}

export default createFrontendTestRepository;
