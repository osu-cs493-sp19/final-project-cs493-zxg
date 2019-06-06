const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  CoursesSchema,
  getCoursesPage,
  getCourseById,
  updateCourseById,
  insertNewCourse,
  deleteCourseById
} = require('../models/student');
