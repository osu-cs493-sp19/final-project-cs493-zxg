

const { ObjectId } = require('mongodb');

const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

/*
 * Schema describing required/optional fields of a course object.
 */
const CoursesSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true }
};
exports.CoursesSchema = CoursesSchema;

exports.getCoursesPage = async function (page) {
  const db = getDBReference();
  const collection = db.collection('courses');
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

  const pageCourses= results.slice(start, end);
  const links = {};
  if (page < lastPage) {
    links.nextPage = `/courses?page=${page + 1}`;
    links.lastPage = `/courses?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/courses?page=${page - 1}`;
    links.firstPage = '/courses?page=1';
  }

  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
    links: links
  };
};

exports.getCourseById = async function (id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}

exports.insertNewCourse= async function (course) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.insertOne(course);
  return result.insertedId;
};

exports.updateCourseById = async function (id, course) {
  const courseValues = {
    subject: course.subject,
    number: course.number,
    title: course.title,
    term: course.term,
    instructorId: course.instructorId
  };

  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.replaceOne(
    { _id: new ObjectID(id) },
    courseValues
  );
  return result.matchedCount > 0;


}
