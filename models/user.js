
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

const {
  getCourseById,
} = require('../models/course');

const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: {required: false}
};
exports.UserSchema = UserSchema;

exports.getUsersPage = async function (page) {
  const db = getDBReference();
  const collection = db.collection('users');
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

  const pageUsers= results.slice(start, end);

   const links = {};
   if (page < lastPage) {
     links.nextPage = `/users?page=${page + 1}`;
     links.lastPage = `/users?page=${lastPage}`;
   }
   if (page > 1) {
     links.prevPage = `/users?page=${page - 1}`;
     links.firstPage = '/users?page=1';
   }

  return {
    users: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
    links: links
  };
};

async function getUserById(id, includePassword) {
  const db = getDBReference();
  const collection = db.collection('users');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const projection = includePassword ? {} : { password: 0 };
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .project(projection)
      .toArray();
    return results[0];
  }
};
exports.getUserById = getUserById;

exports.insertNewUser = async function (user) {
  const userToInsert = extractValidFields(user, UserSchema);
  const db = getDBReference();
  const collection = db.collection('users');

  const passwordHash = await bcrypt.hash(userToInsert.password, 8);
  userToInsert.password = passwordHash;

  const result = await collection.insertOne(userToInsert);
  return result.insertedId;
};

exports.getUserByEmail = async function (email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection
    .find({ email: email })
    .toArray();
  return results[0];
};

exports.validateUser = async function (id, password) {
  const user = await getUserById(id, true);
  const authenticated = user && await bcrypt.compare(password, user.password);
  return authenticated;
};

exports.getCoursesByStudentId = async function(id){
  const db = getDBReference();
  const collection = db.collection('students');
  const finduser = await getUserById(id);
  if (finduser == null) {
    return null;
  } else {
    const students = await collection
      .find({'studentId.$id': new ObjectId(id)})
      .project({'courseId.$id': new ObjectId()})
      .toArray();

    console.log("studentssssssssssss",students);

    var i;
    var results = {};
    for( i = 0; i < students.length; i++){
      const course = students[i].courseId.oid;
      results[i] = course;
    }
    console.log("coursesssssssssssss", results);

    // for( i = 0; i < students.length; i++){
    //   const course = await getCourseById(students[i].courseId.oid);
    //   results[i] = course;
    // }




    return results;
  }

}


exports.getCoursesByInstructorId = async function(id){
  const db = getDBReference();
  const collection = db.collection('courses');
  const finduser = await getUserById(id);
  if (finduser == null) {
    return null;
  } else {
    const instructors = await collection
      .find({'instructorId.$id': new ObjectId(id)})
      .project({_id: new ObjectId()})
      .toArray();

    return instructors;
    //
    // var i;
    // var results = [];
    // for( i = 0; i < students.length; i++){
    //   const course = await getCourseById(students.[i].courseId.oid);
    //   results[i] = course;
    // }
    // console.log("coursesssssssssssss", results);
    // return results;
  }

}


exports.getInstructorbyCourseId = async function(id){
  const db = getDBReference();
  const collection = db.collection('courses');
  const findcourse = await getCourseById(id);
  if (findcourse == null) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}
