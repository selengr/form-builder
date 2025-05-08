import AxiosApi from '@/services/axios/AxiosApi';

class StatsService {
  async getStatsData(id: string) {
    try {
      const response = await AxiosApi.get(
        `/report/solo/answers-data-sheet/${id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A100000%7D`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getFormData(id: string) {
    try {
      const response = await AxiosApi.get(`/form/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new StatsService();
