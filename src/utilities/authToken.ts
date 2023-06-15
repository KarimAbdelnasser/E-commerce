import jwt, { Secret } from "jsonwebtoken";
import { config } from "../config/config";

export = function generateAuthToken(id: string) {
    const token = jwt.sign({ _id: id }, config.jwt as Secret);
    return token;
};
