const router = require("express-promise-router")();
const controller = require("../controllers");

/**
 * @swagger
 * /_health:
 *  get:
 *    summary: Use to check if server is running properly
 *    tags:
 *      - Tests
 *    responses:
 *      '200':
 *        description: OK
 *      '500':
 *        description: Server is Down
 */
router.route("/_health").get(controller.health);

module.exports = router;
