const express = require("express");
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require ('../../config/roles_list');
const verifyRoles = require ('../../middleware/verifyRoles');



router.get('/getALL', employeesController.getAllEmployees);

router.post(
    '/Create',
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
);

router.put(
    '/update',
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
);

router.delete(
    '/delete',
    verifyRoles(ROLES_LIST.Admin),
    employeesController.deleteEmployee
);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;
