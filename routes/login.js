const router = require("express-promise-router")();
const login = require("../controllers/login");
const { upload } = require("../helpers/multer");
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
/**
 * @swagger
 * /login/geojsonFiles:
 *  post:
 *    summary: geojson
 *    tags:
 *      - login
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - name: geojson
 *        in: formData
 *        description: The uploaded file data
 *        required: true
 *        type: file
 *      - name: type
 *        in: formData
 *        description:  Y - Country, S - State
 *        required: true
 *        schema:
 *          type: string
 *          enum:
 *            - Y
 *            - S
 *      - name: geoJsonParameterName
 *        in: formData
 *        description: name for geoJson parameter
 *        required: true
 *        type: string
 *      - name: parent_id
 *        in: formData
 *        description: if type:S then parent id is required
 *        type: integer
 *    responses:
 *      '200':
 *        description: OK
 *      '400':
 *        description: Bad Request
 *      '500':
 *        description: Server Error
 */
router.route("/geojsonFiles").post(
  upload.fields([
    {
      name: "geojson",
      maxCount: 1,
    },
  ]),
  login.geoJsonFiles
);

router.route("/fetcPost").post(login.sharedPost);
router.route("/sharedPostdata").post(login.sharedPostdata);
router.route("/addPost").post(login.addPost);
router.route("/fetchPost").post(login.fetchPost);
module.exports = router;
