import { Request, Response } from "express";
import z from "zod";
import { ShopDashboardQueryDTO } from "../dtos/dashboard.dtos";
import { DashboardService } from "../services/dashboard.service";

const dashboardService = new DashboardService();

export class DashboardController {
    async getRoot(req: Request, res: Response) {
        return res.status(200).json({
            success: true,
            message: "Dashboard API root",
            endpoints: {
                shopOverview: "/dashboard/shop/overview",
            },
        });
    }

    async getShopOverview(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json({ success: false, message: "User Id is Required" });
            }

            const parsedQuery = ShopDashboardQueryDTO.safeParse(req.query);
            if (!parsedQuery.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedQuery.error),
                });
            }

            const data = await dashboardService.getShopOverview({
                userId: String(userId),
                from: parsedQuery.data.from,
                to: parsedQuery.data.to,
                granularity: parsedQuery.data.granularity,
                topN: parsedQuery.data.topN,
            });

            return res.status(200).json({
                success: true,
                message: "Shop dashboard overview retrieved",
                data,
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
