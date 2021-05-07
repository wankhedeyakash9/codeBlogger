const router = require("express-promise-router")();
const login = require("../controllers/login");

/**
 * @swagger
 * /Login/register:
 *      post:
 *          tags:
 *           - Login
 *          description: add new users
 *          parameters:
 *           - name: name
 *             description: name.
 *             in: formData
 *             required: true
 *             type: string
 *           - name: email
 *             description:  email
 *             in: formData
 *             required: true
 *           - name: password
 *             description:  password
 *             in: formData
 *             required: true
 *          responses:
 *              '200':
 *               description: OK
 *              '404':
 *               description: failed to inser and update
 *              '500':
 *               description: Server Error
 */

router.route("/register").post(login.register);
/**
 * @swagger
 * /Login/login:
 *      post:
 *          tags:
 *           - Login
 *          description: user login
 *          parameters:
 *           - name: email
 *             description:  email
 *             in: formData
 *             required: true
 *           - name: password
 *             description:  password
 *             in: formData
 *             required: true
 *          responses:
 *              '200':
 *               description: OK
 *              '404':
 *               description: failed to inser and update
 *              '500':
 *               description: Server Error
 */

router.route("/login").post(login.login);

module.exports = router;
