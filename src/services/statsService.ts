import AxiosApi from '@/services/axios/AxiosApi';

// eslint-disable-next-line import/no-anonymous-default-export
export default new class StatsService {
  async getStatsData(id: string) {
    try {
      const response = await AxiosApi.get(
          `/report/solo/answers-data-sheet/${id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A0%2C%22rows%22%3A100000%7D`
      );
      const rawData = response.data;

      const headRow = rawData.content[0]?.row ?? [];
      const headData = [
        {
          questionId: "index_column_id",
          questionTitle: "ردیف"
        },
        ...headRow,
        {
          questionId: "actions_column_id",
          questionTitle: "عملیات"
        }
      ];

      const dataWithIndex = rawData.content.map((item: any, index: number) => ({
        ...item,
        row: [
          {
            answer: (index + 1).toString(),
            questionId: "index_column_id"
          },
          ...item.row
        ]
      }));

      return {
        headData,
        allData: dataWithIndex
      };
    } catch (error) {
      console.error("Error in getStatsData:", error);
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
