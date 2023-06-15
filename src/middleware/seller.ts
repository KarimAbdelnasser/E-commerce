import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { logger } from "../utilities/logger";

type UserType = {
    _id: string;
};

const checkSeller = async (
    req: Request & { user?: UserType },
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user) {
            const user = await User.findByPk(req.user._id);

            if (user?.getDataValue("role") === "seller") {
                next();
            } else {
                return res.status(403).json({
                    error: "Only sellers are allowed to add products",
                });
            }
        }
    } catch (error) {
        logger.error((error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export default checkSeller;
