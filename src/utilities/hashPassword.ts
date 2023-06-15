import bcrypt from "bcrypt";
import { config } from "../config/config";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(Number(config.salt));
    return await bcrypt.hash(password, salt);
};
