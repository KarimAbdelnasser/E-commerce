import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user";

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "uncompleted",
    },
});

Order.belongsTo(User, { foreignKey: "userId" });
Order.sync();

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "12345"
 *         totalAmount:
 *           type: number
 *           example: 49.99
 *         status:
 *           type: string
 *           example: "uncompleted"
 *
 *     OrderDetail:
 *       type: object
 *       properties:
 *         productName:
 *           type: string
 *           example: "Product 1"
 *         productCategory:
 *           type: string
 *           example: "Electronics"
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 19.99
 *
 *     OrderRequest:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *       required:
 *         - products
 *
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Product 1"
 *         category:
 *           type: string
 *           example: "Electronics"
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Order'
 *
 *     CreateOrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: New order created successfully! or New order created successfully, and there were some out of stock products!
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "12345-2313-5k555"
 *
 *     GetOrderResponse:
 *       type: object
 *       properties:
 *         orderInformation:
 *           $ref: '#/components/schemas/Order'
 *         orderInDetail:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderDetail'
 *
 *     DeleteOrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: This order has been deleted successfully!
 *         data:
 *           $ref: '#/components/schemas/Order'
 *
 *     ArrivedOrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Your order has arrived!
 *         orderInformation:
 *           $ref: '#/components/schemas/Order'
 *         orderInDetail:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderDetail'
 *
 *     ConfirmOrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: You have confirm the complete of the delivery process successfully!
 *         data:
 *           $ref: '#/components/schemas/Order'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "An error occurred"
 *
 *     BadRequestResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid or empty products array"
 *
 *     UnauthorizedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Unauthorized"
 */

export default Order;
