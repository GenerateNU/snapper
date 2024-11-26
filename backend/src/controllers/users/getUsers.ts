import express from "express";
import { UserModel } from "../../models/users";

export default async function getUsersPaginated(req: express.Request, res: express.Response) {
    try {
        const { text, page = "1", limit = "10" } = req.query;

        const pageSize = parseInt(page as string);
        const limitSize = parseInt(limit as string);

        if (pageSize < 1 || limitSize < 1) {
            return res.status(400).json({
                error: "Invalid pagination parameters. Page and limit must be positive numbers.",
            });
        }

        const skip = (pageSize - 1) * limitSize;

        const query = [
            {
                $search: {
                    index: "username",
                    text: {
                        query: text,
                        fuzzy : {
                            maxEdits : 2,
                        },
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            },
            {
                $skip: skip, 
            },
            {
                $limit: limitSize, 
            },
        ]

        const results = await UserModel.aggregate(query);

        return res.status(200).json({
            page: pageSize,
            limit: limitSize,
            results,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "An error occurred while fetching users.",
        });
    }
}