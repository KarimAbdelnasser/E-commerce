import { Request, Response } from "express";
import Order from "../models/order";
import { Product } from "../models/product";
import OrderItem from "../models/orderItem";
import mailSender from "../utilities/mailSender";
import { User } from "../models/user";
import { logger } from "../utilities/logger";

type UserType = {
    _id: string;
};

//Create a new order
export const create = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res
                .status(400)
                .json({ message: "Invalid or empty products array" });
        }

        let outOfStockProducts: any[] = [];
        let inStockProducts: any[] = [];
        let totalAmount = 0;

        for (const product of products) {
            if (!product.name || !product.category) {
                return res
                    .status(400)
                    .json({ message: "Invalid product data" });
            }

            const existingProduct = await Product.findOne({
                name: product.name,
                category: product.category,
            });

            if (!existingProduct) {
                outOfStockProducts.push({
                    name: product.name,
                    wantedQuantity: product.quantity,
                    available: false,
                });
            } else {
                let requestedQuantity = product.quantity;
                const availableQuantity = Math.min(
                    existingProduct.count,
                    requestedQuantity
                );

                if (availableQuantity < requestedQuantity) {
                    if (availableQuantity === 0) {
                        outOfStockProducts.push({
                            name: product.name,
                            availableQuantity: availableQuantity,
                            wantedQuantity: product.quantity,
                        });
                    } else {
                        const remainingQuantity =
                            requestedQuantity - availableQuantity;
                        outOfStockProducts.push({
                            name: product.name,
                            availableQuantity: availableQuantity,
                            wantedQuantity: product.quantity,
                            remainingQuantity: remainingQuantity,
                        });
                        inStockProducts.push({
                            name: existingProduct.name,
                            category: existingProduct.category,
                            quantity: availableQuantity,
                            productId: existingProduct._id,
                            price: existingProduct.price,
                        });
                        totalAmount +=
                            existingProduct.price * availableQuantity;
                    }
                } else {
                    inStockProducts.push({
                        name: existingProduct.name,
                        category: existingProduct.category,
                        quantity: availableQuantity,
                        productId: existingProduct._id,
                        price: existingProduct.price,
                    });
                    totalAmount += existingProduct.price * availableQuantity;
                }
            }
        }
        if (inStockProducts.length === 0) {
            return res.status(400).json({
                message: "All products are out of stock.",
                outOfStockProducts,
            });
        }

        const newOrder = await Order.create({
            products: inStockProducts,
            totalAmount,
            userId,
        });

        for (const product of inStockProducts) {
            await OrderItem.create({
                orderId: newOrder.getDataValue("id"),
                productId: product.productId.toString(),
                productName: product.name,
                productCategory: product.category,
                quantity: product.quantity,
                price: product.price,
            });
        }

        const updatePromises = inStockProducts.map(async (product) => {
            const existingProduct = await Product.findById(product.productId);
            if (existingProduct) {
                existingProduct.count -= product.quantity;
                await existingProduct.save();
            }
        });

        await Promise.all([...updatePromises]);

        if (outOfStockProducts.length === 0) {
            return res.status(201).json({
                message: "New order created successfully!",
                data: newOrder.getDataValue("id"),
            });
        } else {
            return res.status(201).json({
                message:
                    "New order created successfully, and there were some out of stock products!",
                data: newOrder.getDataValue("id"),
                outOfStock: outOfStockProducts,
            });
        }
    } catch (error) {
        logger.error("Error creating an order:", (error as Error).message);
        return res.status(500).json({ error: (error as Error).message });
    }
};

//Get an exist order
export const getOne = async (
    req: Request,
    res: Response
): Promise<void | Response> => {
    try {
        const products = await Order.findByPk(req.params.id, {
            attributes: {
                exclude: ["updatedAt", "userId"],
            },
        });
        const orderItems = await OrderItem.findAll({
            where: { orderId: req.params.id },
            attributes: {
                exclude: ["id", "updatedAt", "orderId", "createdAt"],
            },
        });
        return res
            .status(200)
            .json({ orderInformation: products, orderInDetail: orderItems });
    } catch (error) {
        logger.error(
            "Error getting an existing order:",
            (error as Error).message
        );
        res.status(500).json({ error: (error as Error).message });
    }
};

//The order has arrived to the customer
export const arrived = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const order = await Order.findByPk(req.params.id, {
            attributes: {
                exclude: ["updatedAt", "userId"],
            },
        });

        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        const user = await User.findByPk(order.getDataValue("userId"));

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const orderItems = await OrderItem.findAll({
            where: { orderId: req.params.id },
            attributes: {
                exclude: ["id", "updatedAt", "orderId", "createdAt"],
            },
        });

        await mailSender(
            user.getDataValue("email"),
            "Hello " +
                user.getDataValue("username") +
                ",\n\n" +
                "Your order has been arrived to your address please complete the process and then confirm that all good by go to this link to confirm the process : \nhttp://" +
                req.headers.host +
                "/order/confirmation/" +
                order.getDataValue("id") +
                "/" +
                "\n\nThank You!\n"
        );
        return res.status(200).json({
            message: "Your order has arrived!",
            orderInformation: order,
            orderInDetail: orderItems,
        });
    } catch (error) {
        logger.error(
            "Error sending a mail to a user to mention that the order has been arrived:",
            (error as Error).message
        );
        res.status(500).json({ error: (error as Error).message });
    }
};

//Confirm the arrived order
export const confirm = async (
    req: Request & { user?: UserType },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }
        if (!(order.getDataValue("user_id") === req.user._id)) {
            return res.status(401).send("Unauthorized!");
        }
        const completedOrder = await order.update({ status: "completed" });
        return res.status(200).json({
            message:
                "You have confirm the complete of the delivery process successfully!",
            data: completedOrder,
        });
    } catch (error) {
        logger.error(
            "Error confirm the completion of the delivery process:",
            (error as Error).message
        );
        res.status(500).json({ error: (error as Error).message });
    }
};

//Delete an exist order
export const deleteOrder = async (
    req: Request & { user?: any },
    res: Response
): Promise<void | Response> => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            if (!order.getDataValue("user_id") === req.user._id) {
                return res.status(401).send("Unauthorized!");
            }
            const deletedOrder = await order.destroy();
            return res.status(200).json({
                message: "This order has been deleted successfully!",
                data: deletedOrder,
            });
        }
    } catch (error) {
        logger.error(
            "Error deleting an existing order:",
            (error as Error).message
        );
        res.status(500).json({ error: (error as Error).message });
    }
};
