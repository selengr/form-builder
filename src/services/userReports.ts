import { getUserReportsDataAction } from "../../actions/userReports/getUserReportsDataAction";

// eslint-disable-next-line import/no-anonymous-default-export
export default new (class StatsService {
  async getUserReportsData(page: number = 1, pageSize: number = 25) {
    return getUserReportsDataAction(page, pageSize);
  }
})();