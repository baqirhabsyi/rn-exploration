import {HttpService} from '@services/http/http.service';
import FrontendTestRepository from './repositories/frontend-test/frontend-test.repository';

const baseURL = 'https://recruitment-test.flip.id';
const httpService = new HttpService();

export const apiService = {
  frontendTest: new FrontendTestRepository(httpService, baseURL),
};
