import { Request, Response } from "express";
import { User } from "../models/user";
import generateAuthToken from "../utilities/authToken";
import { hashPassword } from "../utilities/hashPassword";
import mailSender from "../utilities/mailSender";
import bcrypt from "bcrypt";
import { logger } from "../utilities/logger";

type UserType = {
    _id: string;
};

//Create a new user
export const create = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const { password, ...newUserData } = req.body;

        const hashedPassword = await hashPassword(password);

        newUserData.password = hashedPassword;

        const newUser = await User.create({
            ...newUserData,
            password: hashedPassword,
        });

        const userId = newUser.dataValues.id;

        const token = await generateAuthToken(userId);

        return res
            .status(201)
            .header("x-auth-token", token)
            .json({
                message: "New user created successfully!",
                data: {
                    email: newUser.getDataValue("email"),
                    username: newUser.getDataValue("username"),
                    createdAt: newUser.getDataValue("createdAt"),
                },
            });
    } catch (error) {
        logger.error(`Error creating a new user: ${(error as Error).message}`);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Get an exist user
export const getUser = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findOne({
                where: { id: req.user._id },
                attributes: ["username", "email", "createdAt"],
            });

            if (user) {
                return res.status(200).json({ data: user });
            } else {
                return res.status(404).json({ message: "User not found!" });
            }
        }
    } catch (error) {
        logger.error("Error getting a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Update user's data
export const update = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { password, email, username } = req.body;
        const allowedFields = ["password", "email", "username"];

        // Check if any fields other than allowed fields are present in req.body
        const invalidFields = Object.keys(req.body).filter(
            (field) => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: "Invalid fields provided",
                invalidFields,
            });
        }

        const user = await User.findByPk(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password) {
            const isSamePassword = await bcrypt.compare(
                password,
                user.getDataValue("password")
            );

            if (isSamePassword) {
                return res.status(409).json({
                    message: "The new password cannot match the old password",
                });
            }

            const hashedPassword = await hashPassword(password);
            await user.update({ password: hashedPassword });
        }

        if (email) {
            await user.update({ email });
        }

        if (username) {
            await user.update({ username });
        }

        const updatedUser = {
            username: user.getDataValue("username"),
            email: user.getDataValue("email"),
            updatedAt: user.getDataValue("updatedAt"),
        };

        return res.status(201).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        logger.error("Error updating a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Delete an exist user
export const deleteUser = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findByPk(req.user._id);

            if (user) {
                await user.destroy();

                await mailSender(
                    user.getDataValue("email"),
                    "Hello " +
                        user.getDataValue("username") +
                        ",\n\n" +
                        "We're sad to see you go!"
                );

                return res.status(201).json({
                    message: "This user has been deleted successfully!",
                    data: user.getDataValue("email"),
                });
            } else {
                return res.status(404).json({ message: "User not found!" });
            }
        }
    } catch (error) {
        logger.error("Error deleting a user:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Verify a user to be an seller
export const seller = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findByPk(req.user._id);

            if (user) {
                if (user.getDataValue("role") === "seller") {
                    return res.status(409).json({
                        message: "This user already is a seller!",
                    });
                }

                await mailSender(
                    user.getDataValue("email"),
                    "Hello " +
                        user.getDataValue("username") +
                        ",\n\n" +
                        "Please verify your account by clicking the link: \nhttp://" +
                        req.headers.host +
                        "/user/confirmation/" +
                        user.getDataValue("email") +
                        "/" +
                        "\n\nThank You!\n"
                );

                return res.status(201).json({
                    message:
                        "A verification email has been sent to " +
                        user.getDataValue("email"),
                });
            } else {
                return res.status(404).json({ message: "User not found!" });
            }
        }
    } catch (error) {
        logger.error(
            "Error upgrading a user to be a seller:",
            (error as Error).message
        );
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Confirm the verification
export const confirmUser = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (req.user) {
            const user = await User.findByPk(req.user._id);
            if (user) {
                if (user.getDataValue("role") === "seller") {
                    return res.status(409).json({
                        message: "This user already is a seller!",
                    });
                }
                await User.update(
                    { role: "seller" },
                    { where: { id: req.user._id } }
                );
                return res.status(201).json({
                    message: "BINGO, You are a seller now!",
                });
            } else {
                return res.status(404).json({ message: "User not found!" });
            }
        }
    } catch (error) {
        logger.error(
            "Error confirm upgrading user to a seller:",
            (error as Error).message
        );
        return res.status(500).json({ error: "An error occurred" });
    }
};
