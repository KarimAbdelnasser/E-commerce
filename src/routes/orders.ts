import { Router } from "express";
import * as orderControllers from "../controllers/orders.controller";
import auth from "../middleware/auth";
import auditMiddleware from "../middleware/audit";
const router = Router();

router.route("/new").post(auth, auditMiddleware, orderControllers.create);

/**
 * @openapi
 * /order/new:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create a new order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *           example:
 *             products:
 *               - name: "Product 1"
 *                 category: "Electronics"
 *                 quantity: 2
 *               - name: "Product 2"
 *                 category: "Clothing"
 *                 quantity: 1
 *
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderResponse'
 *           example:
 *             message: "Order created successfully!"
 *             data:
 *               id: "12345"
 *               totalAmount: 49.99
 *               status: "uncompleted"
 *               userId: "user123"
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestResponse'
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.route("/:id").get(auth, auditMiddleware, orderControllers.getOne);

/**
 * @openapi
 * /order/{id}:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the order
 *         required: true
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *           type: string
 *         description: The user token
 *         required: true
 *
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetOrderResponse'
 *           example:
 *             orderInformation:
 *               id: "12345"
 *               totalAmount: 49.99
 *               status: "uncompleted"
 *             orderInDetail:
 *               - productName: "Product 1"
 *                 productCategory: "Electronics"
 *                 quantity: 2
 *                 price: 19.99
 *               - productName: "Product 2"
 *                 productCategory: "Clothing"
 *                 quantity: 1
 *                 price: 9.99
 *
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Invalid order ID"
 *
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: Unauthorized or Access denied, no token provided!
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   example: "An error occurred"
 */

router
    .route("/delete/:id")
    .delete(auth, auditMiddleware, orderControllers.deleteOrder);

/**
 * @openapi
 * /order/delete/{id}:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Delete an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the order to delete
 *         required: true
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *           type: string
 *         description: The user token
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteOrderResponse'
 *             example:
 *               message: "This order has been deleted successfully!"
 *               data:
 *                 id: "12345"
 *                 totalAmount: 49.99
 *                 status: "uncompleted"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Invalid order ID"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   example: "An error occurred"
 */

router.route("/arrived").get(auth, auditMiddleware, orderControllers.arrived);

/**
 * @openapi
 * /order/arrived:
 *   get:
 *     tags:
 *       - Order
 *     summary: Mark an order as arrived
 *     description: Marks the specified order as arrived and sends a confirmation email to the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrivedOrderResponse'
 *             example:
 *               message: "Your order has arrived!"
 *               orderInformation:
 *                 id: "12345"
 *                 totalAmount: 49.99
 *                 status: "arrived"
 *               orderInDetail:
 *                 - productId: "67890"
 *                   productName: "Product 1"
 *                   productCategory: "Category 1"
 *                   quantity: 2
 *                   price: 9.99
 *                 - productId: "54321"
 *                   productName: "Product 2"
 *                   productCategory: "Category 2"
 *                   quantity: 1
 *                   price: 29.99
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Order not found"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   example: "An error occurred"
 */

router
    .route("/confirmation/:id")
    .put(auth, auditMiddleware, orderControllers.confirm);

/**
 * @openapi
 * /order/confirmation/{id}:
 *   put:
 *     tags:
 *       - Order
 *     summary: Confirm completion of delivery process
 *     description: Confirms the completion of the delivery process for the specified order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfirmOrderResponse'
 *             example:
 *               message: "You have confirmed the completion of the delivery process successfully!"
 *               data:
 *                 id: "12345"
 *                 totalAmount: 49.99
 *                 status: "completed"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Order not found"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Unauthorized"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   example: "An error occurred"
 */

export { router as ordersRouter };
