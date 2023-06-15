import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";

interface ProductDocument extends Document {
    name: string;
    price: number;
    description: string;
    category: string;
    count: number;
    user_id: string;
}

const productSchema = new Schema<ProductDocument>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String, required: true },
        count: {
            type: Number,
            min: 0,
            default: 0,
        },
        user_id: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Product = mongoose.model<ProductDocument>("Product", productSchema);

const productValidationSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string(),
    category: Joi.string().required(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: "Product Name"
 *         price:
 *           type: number
 *           example: 29.99
 *         description:
 *           type: string
 *           example: "Product description"
 *         category:
 *           type: string
 *           example: "Electronics"
 *         count:
 *           type: number
 *           example: 10
 *         user_id:
 *           type: string
 *       required:
 *         - name
 *         - price
 *         - category
 *
 *     ProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Product Name"
 *           required: true
 *         price:
 *           type: number
 *           example: 29.99
 *           required: true
 *         description:
 *           type: string
 *           example: "Product description"
 *         category:
 *           type: string
 *           example: "Electronics"
 *           required: true
 *         count:
 *           type: number
 *           example: 10
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ProductResponseData'
 *
 *     CreateProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: New product created successfully!
 *         data:
 *           $ref: '#/components/schemas/ProductResponseData'
 *
 *     IncrementCreateProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Product count incremented successfully!
 *         data:
 *           $ref: '#/components/schemas/ProductResponseData'
 *
 *     UpdateProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Product updated successfully!
 *         data:
 *           $ref: '#/components/schemas/ProductResponseData'
 *
 *     DeleteProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: This product has been deleted successfully!
 *         data:
 *           $ref: '#/components/schemas/ProductResponseData'
 *
 *     ProductResponseData:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 123456...
 *         name:
 *           type: string
 *           example: "Product Name"
 *         price:
 *           type: number
 *           example: 29.99
 *         description:
 *           type: string
 *           example: "Product description"
 *         category:
 *           type: string
 *           example: "Electronics"
 *         count:
 *           type: number
 *           example: 10
 *
 *     ProductsByCategoryResponse:
 *       type: object
 *       properties:
 *         Products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               description:
 *                 type: string
 *                 example: "Product description"
 *               stockAvailability:
 *                 type: string
 *           description: List of products
 */

export { Product, productValidationSchema };
