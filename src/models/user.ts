import { DataTypes } from "sequelize";
import { v4 } from "uuid";
import { sequelize } from "../config/database";
import Joi from "joi";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => v4(),
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "buyer",
    },
});

User.sync();

const schema = Joi.object({
    email: Joi.string().email().min(7).max(255).required(),
    username: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(4).max(25).required(),
});
/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: abc12345-1234-1234-1234-abcdeffedcba
 *        username:
 *          type: string
 *          minLength: 3
 *          maxLength: 15
 *          example: john_doe
 *        email:
 *          type: string
 *          format: email
 *          minLength: 7
 *          maxLength: 255
 *          example: john@example.com
 *        password:
 *          type: string
 *          minLength: 4
 *          maxLength: 25
 *          example: Password123
 *        role:
 *          type: string
 *          default: buyer
 *      required:
 *        - username
 *        - email
 *        - password
 *
 *    UserResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          value: New user created successfully!
 *        data:
 *          $ref: '#/components/schemas/UserResponseData'
 *
 *    UpdateUserResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          example: User updated successfully!
 *        data:
 *          $ref: '#/components/schemas/UserResponseData'
 *
 *    GetUserResponse:
 *      type: object
 *      properties:
 *        data:
 *          $ref: '#/components/schemas/UserResponseData'
 *
 *    UserResponseData:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          example: john@example.com
 *        username:
 *          type: string
 *          example: john_doe
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: '2023-06-12T12:34:56Z'
 *
 *    UpdateUser:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          minLength: 7
 *          maxLength: 255
 *          example: john2@example.com
 *        username:
 *          type: string
 *          minLength: 3
 *          maxLength: 15
 *          example: john_doe2
 *        password:
 *          type: string
 *          minLength: 4
 *          maxLength: 25
 *          example: Password321
 *
 *    DeleteUser:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          example: This user has been deleted successfully!
 *        email:
 *          type: string
 *          format: email
 *          minLength: 7
 *          maxLength: 255
 *          example: john2@example.com
 *
 *    securitySchemes:
 *       jwtToken:
 *         type: apiKey
 *         schema: apiKey
 *         in: header
 *         name: x-auth-token
 */

export { User, schema as userValidator };
