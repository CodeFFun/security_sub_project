import z from "zod";

const parseOptionalDate = (value: unknown): Date | undefined => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    return date;
};

export const ShopDashboardQueryDTO = z.object({
    from: z
        .preprocess((value) => parseOptionalDate(value), z.date().optional())
        .optional(),
    to: z
        .preprocess((value) => parseOptionalDate(value), z.date().optional())
        .optional(),
    granularity: z.enum(["day", "week", "month"]).default("day"),
    topN: z.coerce.number().int().min(1).max(20).default(5),
});

export type ShopDashboardQueryDTO = z.infer<typeof ShopDashboardQueryDTO>;
