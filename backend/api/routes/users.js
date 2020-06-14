/* User model routes, connecting routes and controllers */
const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

// attach routes with controllers
router.get('/', UsersController.get_all_users);
router.get('/customers', UsersController.get_all_customers);
router.post('/email', UsersController.check_email_taken);
router.get('/:userId', UsersController.get_user);
router.post('/', UsersController.create_user);
router.post('/login', UsersController.login_user);
router.delete('/:userId', UsersController.delete_user);
router.patch('/:userId', UsersController.update_user);

module.exports = router;
