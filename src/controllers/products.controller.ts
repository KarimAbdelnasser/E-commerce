import { Request, Response } from "express";
import { Product } from "../models/product";
import { logger } from "../utilities/logger";

type User = {
    _id: string;
};

//Create a new product
export const create = async (req: Request & { user?: User }, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, category } = req.body;
        let existingProduct = await Product.findOne({
            name: name,
            category: category,
        }).select("-user_id -createdAt -updatedAt");

        if (existingProduct) {
            existingProduct.count += 1;
            await existingProduct.save();
            return res.status(200).json({
                message: "Product count incremented successfully!",
                data: existingProduct,
            });
        } else {
            existingProduct = await Product.create({
                ...req.body,
                user_id: req.user._id,
                count: 1,
            });
            return res.status(201).json({
                message: "New product created successfully!",
                data: existingProduct,
            });
        }
    } catch (error) {
        logger.error((error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Get all products by category
export const getByCategory = async (req: Request, res: Response) => {
    try {
        const category = req.query.category;
        console.log(category, typeof category);

        const products = await Product.find({
            category: { $regex: new RegExp(`^${category}$`, "i") },
        });
        if (products.length !== 0) {
            const formattedProducts = products.map((product) => ({
                name: product.name,
                description: product.description,
                stockAvailability:
                    product.count > 0 ? "Available" : "Out of stock",
            }));
            return res.status(200).json({ Products: formattedProducts });
        } else {
            return res.status(404).json({
                message: "There isn't any product with the given category!",
            });
        }
    } catch (error) {
        logger.error((error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Get products with name
export const getByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.query;

        const products = await Product.find({
            name: { $regex: new RegExp(name as string, "i") },
        });

        if (products.length === 0) {
            return res.status(404).json({ error: "Products not found" });
        }

        res.status(200).json({ productsInfo: products });
    } catch (error) {
        console.error(
            "Error searching for products by name:",
            (error as Error).message
        );
        res.status(500).json({ error: "An error occurred" });
    }
};

//Get a product with its ID
export const getOne = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id).select(
            "-user_id -createdAt -updatedAt"
        );
        if (product) {
            return res.status(200).json({ data: product });
        } else {
            return res.status(404).json({
                message: "There isn't any product with the given ID!",
            });
        }
    } catch (error) {
        logger.error(
            "Error searching for products by id:",
            (error as Error).message
        );
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Update an existing product
export const update = async (
    req: Request & { user?: any },
    res: Response
): Promise<void | Response> => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                message: "Make sure to add the product's ID in the params!",
            });
        }

        const ownership = await Product.findById(req.params.id);
        if (!ownership) {
            return res.status(404).json({
                message: "Product not found!",
            });
        }

        if (ownership.user_id !== req.user._id) {
            return res.status(401).json({
                message: "Unauthorized!",
            });
        }

        const allowedFields = [
            "name",
            "price",
            "description",
            "category",
            "count",
        ];
        const updatedFields = Object.keys(req.body);

        const invalidFields = updatedFields.filter(
            (field) => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: "Invalid fields provided",
                invalidFields,
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, select: "-user_id" }
        );

        return res.status(200).json({
            message: "Product updated successfully!",
            data: updatedProduct,
        });
    } catch (error) {
        logger.error("Error updating a product:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};

//Delete a product
export const deleteProduct = async (
    req: Request & { user?: any },
    res: Response
): Promise<void | Response> => {
    try {
        const ownership = await Product.findById(req.params.id);
        if (ownership) {
            if (!ownership.user_id === req.user._id) {
                return res.status(401).send("Unauthorized!");
            }
            const deletedProduct = await Product.findByIdAndDelete(
                req.params.id,
                { select: "-user_id" }
            );
            return res.status(201).json({
                message: "This product has been deleted successfully!",
                data: deletedProduct,
            });
        }
    } catch (error) {
        logger.error("Error deleting a product:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred" });
    }
};
