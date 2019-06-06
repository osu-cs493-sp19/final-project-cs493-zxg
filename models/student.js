
const { ObjectId } = require('mongodb');

const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

const {
  CoursesSchema,
  getCoursesPage,
  getCourseById,
  updateCourseById,
  insertNewCourse,
  deleteCourseById
} = require('../models/course');

const StudentSchema = {
  studentId: { required: true },
  courseId: { required: true },

};
exports.UserSchema = StudentSchema;

exports.getStudentsPage = async function (page) {
  const db = getDBReference();
  const collection = db.collection('students');
  const count = await collection.countDocuments();

  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(start)
    .limit(pageSize)
    .toArray();

  const pageStudents= results.slice(start, end);
  const links = {};
  if (page < lastPage) {
    links.nextPage = `/students?page=${page + 1}`;
    links.lastPage = `/students?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/students?page=${page - 1}`;
    links.firstPage = '/students?page=1';
  }

  return {
    students: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
    links: links
  };
};


exports.getStudentsbyId = async function(id){
  const db = getDBReference();
  const collection = db.collection('students');
  const findcourse = await getCourseById(id);
  console.log(findcourse);
  if(!findcourse){
    console.log("error");
    return null;
  } else {
    const result = await collection
      .find({'studentId.$id': new ObjectId(id)})
      .toArray();
    console.log(result);
    return result[0];
  }
}
