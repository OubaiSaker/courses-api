const express = require('express')

const router = express.Router()

const coursesController = require('../controller/courses.controller')

const { validationSchema } = require('../middleware/validation Schema');

const verifyToken = require('../middleware/verifyToken')

const userRole = require('../utils/user-roles')

const allowedTo = require('../middleware/allowodTo')


router.route('/')
    .get(coursesController.getAllCourses)
    .post(verifyToken, validationSchema(), allowedTo(userRole.MANAGER), coursesController.createCourse)
router.route('/:courseId')
    .get(coursesController.getSingleCourse)
    .patch(validationSchema(), coursesController.updateCourse)
    .delete(verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), coursesController.deleteCourse)

module.exports = router;