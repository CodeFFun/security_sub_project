import { HttpError } from "../errors/http-error";
import { DashboardRepository, DashboardGranularity } from "../repositories/dashboard.repository";

const dashboardRepository = new DashboardRepository();

interface IGetShopOverviewInput {
    userId: string;
    from?: Date;
    to?: Date;
    granularity: DashboardGranularity;
    topN: number;
}

export class DashboardService {
    async getShopOverview(input: IGetShopOverviewInput) {
        const { userId, from, to, granularity, topN } = input;

        if (!userId) {
            throw new HttpError(400, "User Id is Required");
        }

        if (from && to && from > to) {
            throw new HttpError(400, "'from' date must be before or equal to 'to' date");
        }

        return await dashboardRepository.getShopOverview(userId, {
            from,
            to,
            granularity,
            topN,
            successStatus: "completed",
        });
    }
}
