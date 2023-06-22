import { Router } from "express";
import * as productControllers from "../controllers/products.controller";
import auth from "../middleware/auth";
import checkSeller from "../middleware/seller";
import { validateProduct } from "../middleware/validateProduct";
import auditMiddleware from "../middleware/audit";
const router = Router();

router
    .route("/new")
    .post(
        auth,
        auditMiddleware,
        validateProduct,
        checkSeller,
        productControllers.create
    );

/**
 * @openapi
 * /product/new:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *           type: string
 *         description: The user token
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *           example:
 *             name: "Example Product"
 *             price: 19.99
 *             category: "Electronics"
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncrementCreateProductResponse'
 *           example:
 *             message:
 *               type: string
 *               example: "Product count incremented successfully!"
 *             data:
 *               name: "Example Product"
 *               price: 19.99
 *               description: "Example description"
 *               category: "Electronics"
 *               count: 1
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateProductResponse'
 *           example:
 *             message: "New product created successfully!"
 *             data:
 *               name: "Example Product"
 *               price: 19.99
 *               description: "Example description"
 *               category: "Electronics"
 *               count: 1
 *               user_id: "user123"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid token! or Not valid product
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized or Access denied, no token provided!
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: "Only sellers are allowed to add products"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred"
 */

router.route("/search").get(productControllers.getByName);

/**
 * @openapi
 * /product/search:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products by name
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Product name
 *         required: true
 *         example: "IPhone"
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsByCategoryResponse'
 *         example:
 *           ProductsInfo:
 *             - name: "Iphone 13"
 *               description: "Example description 1"
 *               stockAvailability: "Available"
 *             - name: "Iphone 13"
 *               description: "Example description 2"
 *               stockAvailability: "Out of stock"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Products not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred"
 */

router.route("/allByCat").get(productControllers.getByCategory);

/**
 * @openapi
 * /product/allByCat:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products by category
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Product category
 *         required: true
 *         example: "Electronics"
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsByCategoryResponse'
 *         example:
 *           Products:
 *             - name: "Example Product 1"
 *               description: "Example description 1"
 *               stockAvailability: "Available"
 *             - name: "Example Product 2"
 *               description: "Example description 2"
 *               stockAvailability: "Out of stock"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "There isn't any product with the given category!"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred"
 */

router.route("/:id").get(productControllers.getOne);

/**
 * @openapi
 * /product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Product ID
 *         required: true
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *         example:
 *           data:
 *             name: "Example Product"
 *             price: 19.99
 *             description: "Example description"
 *             category: "Electronics"
 *             count: 5
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "There isn't any product with the given ID!"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred"
 */

router
    .route("/update/:id")
    .put(auth, auditMiddleware, checkSeller, productControllers.update);

/**
 * @openapi
 * /product/update/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update an existing product
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *           type: string
 *         description: The user token
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Product ID
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *           example:
 *             name: "Updated Product"
 *             price: 29.99
 *             category: "Electronics"
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProductResponse'
 *         example:
 *           message: "Product updated successfully!"
 *           data:
 *             name: "Updated Product"
 *             price: 29.99
 *             description: "Example description"
 *             category: "Electronics"
 *             count: 5
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Make sure to add the product's ID in the params! or Invalid token!
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized! or Access denied, no token provided!
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: "Only sellers are allowed to add products"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               error: "Product not found!"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred"
 */

router
    .route("/delete/:id")
    .delete(
        auth,
        auditMiddleware,
        checkSeller,
        productControllers.deleteProduct
    );

/**
 * @openapi
 * /product/delete/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a product
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *           type: string
 *         description: The user token
 *         required: true
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Product ID
 *         required: true
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteProductResponse'
 *         example:
 *           message: "This product has been deleted successfully!"
 *           data:
 *             name: "Deleted Product"
 *             price: 9.99
 *             description: "Example description"
 *             category: "Electronics"
 *             count: 0
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token!"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized! or Access denied, no token provided!
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               error: "Only sellers are allowed to add products"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred"
 */

export { router as productsRouter };
