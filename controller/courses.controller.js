const Course = require('../models/course.model')

const { validationResult } = require('express-validator')

const asyncWrapper = require('../middleware/asyncWrapper')

const appError = require('../utils/appError')

const getAllCourses = asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
        res.json({ status: "success", data: { courses } });
    })

const getSingleCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseId)
        if (!course) {
            const error = appError.create('course not found', 404, "FAIL")
            return next(error)
            // return res.status(404).json({ status: "Fail", data: "course not found " });
        }
        return res.json({ status: "success", data: { course } });
    }
)

const createCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, "fail")
            return next(error);
            // return res.status(400).json({ status: "fail", data: errors.array() });
        }
        const newCourse = new Course(req.body)
        await newCourse.save()
        res.status(201).json({ status: "success", data: { course: newCourse } });
    }
)

const updateCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, "fail")
        return next(error);
        // return res.status(400).json({ status: "fail", data: errors.array() });
    }
    const courseId = req.params.courseId;
    const updatedCourse = await Course.updateOne({ _id: courseId }, { $set: { ...req.body } })
    return res.status(200).json({ status: "success", data: { course: updatedCourse } });

}
)
const deleteCourse = asyncWrapper(
    async (req, res, next) => {
        const courseId = req.params.courseId;
        const course = await Course.findById({ _id: courseId })
        if (!course) {
            const error = appError.create('course not found', 404, "FAIL")
            return next(error)
            //return res.status(404).json({ status: "fail", msg: "course not found " });
        }
        await Course.deleteOne({ _id: courseId });
        return res.status(200).json({ status: "success", data: null });
    });

module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse
}