import {httpService} from '../http/http.service';
import createFrontendTestRepository from './repositories/frontend-test/frontend-test.repository';

const baseURL = 'https://recruitment-test.flip.id';

export const apiService = {
  frontendTest: createFrontendTestRepository(httpService, baseURL),
};
