import { Router } from "express";
import * as userControllers from "../controllers/users.controller";
import { validateUser } from "../middleware/validateUser";
import auth from "../middleware/auth";
const router = Router();

router.route("/").post(validateUser, userControllers.create);

/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             example1:
 *               value:
 *                 username: john_doe
 *                 email: user@example.com
 *                 password: password123
 *             example2:
 *               value:
 *                 username: john Cent
 *                 email: cent@example.com
 *                 password: pass123
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             examples:
 *               example1:
 *                 value:
 *                   message: New user created successfully!
 *                   data:
 *                     email: john@example.com
 *                     username: john_doe
 *                     createdAt: '2023-06-12T12:34:56Z'
 *               example2:
 *                 value:
 *                   message: New user created successfully!
 *                   data:
 *                     email: cent@example.com
 *                     username: john Cent
 *                     createdAt: '2023-06-12T12:34:56Z'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   example: "Not valid user data"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   example: An error occurred
 */

router.route("/me").get(auth, userControllers.getUser);

/**
 * @openapi
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user details
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUserResponse'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token!"
 *       '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Access denied, no token provided!
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred
 */

router.route("/update").put(auth, userControllers.update);

/**
 * @openapi
 * /user/update:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user's data
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '400':
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Invalid fields provided or Invalid token!
 *       '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Access denied, no token provided!
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
 *       '409':
 *          description: Conflict
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: The new password cannot match the old password
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred
 */

router.route("/seller").get(auth, userControllers.seller);

/**
 * @openapi
 * /user/seller:
 *   get:
 *     tags:
 *       - User
 *     summary: Verify user as a seller
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A verification email has been sent to john@example.com
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token!"
 *       '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Access denied, no token provided!
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
 *       '409':
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already a seller!
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred
 */

router.route("/confirmation/:email").put(auth, userControllers.confirmUser);

/**
 * @openapi
 * /user/confirmation/{email}:
 *   put:
 *     tags:
 *       - User
 *     summary: Confirm user verification
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         description: The user token
 *         required: true
 *         schema:
 *            type: string
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: BINGO, You are a seller now!
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token!"
 *       '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Access denied, no token provided!
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
 *       '409':
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already a seller!
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred
 */

router.route("/delete").delete(auth, userControllers.deleteUser);

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete an existing user
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         schema:
 *            type: string
 *         description: The user token
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUser'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token!"
 *       '401':
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Access denied, no token provided!
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred
 */

export { router as usersRouter };
