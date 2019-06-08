
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

const {
  UserSchema,
  getUserById,
  getUsersPage,
  insertNewUser
} = require('../models/user');

const StudentSchema = {
  studentId: { required: true },
  courseId: { required: true },
};
exports.StudentSchema = StudentSchema;

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
    console.log("fincourse == null", findcourse);
  if(findcourse == null){
    console.log("error");
    console.log("fincourse == null", findcourse);

    return null;
  } else {
    const result = await collection
      .find({'courseId.$id': new ObjectId(id)})
// add this code later, do not delete      .project({'studentId.$id': new ObjectId()})
      .toArray();
    console.log(result);
    return result;
  }
}

//
exports.insertStudentbyId = async function(id, student){
  const db = getDBReference();
  const collection = db.collection('students');
  const findcourse = await getCourseById(id);
  if(findcourse == null){
    console.log("error");
    return null;
  } else {
      const result = await collection.insertOne(student);
      return result.insertedId;
    }
}

exports.findStudentsInfo = async function (id){
  const db = getDBReference();

  const collectionst = db.collection('students');
  const findcourse = await getCourseById(id);
  console.log("findcoursessssssssssss:", findcourse);

  if(findcourse == null){
    return null;
  } else {
    const students = await collectionst
      .find({'courseId.$id': new ObjectId(id)})
      .project({'studentId.$id': new ObjectId()})
      .toArray();

    var i;
    var results = {};
    for( i = 0; i < students.length; i++){
      const user = await getUserById(students[i].studentId.oid);
      results[i] = user;
    }
    return results;

    // console.log("studntssssssssssss", students);
    // console.log("students: 1sssssssssss", students[0]);
    // console.log("student2ssssssssssss", students[1]);
    //
    // console.log("students1 id check:", students[0].studentId.oid);

    // var users = {};
    // users[0] = students[0].studentId.oid;

    //error check 1
    // const user = await collectionuser
    //   .find({_id: new ObjectId(students[0].studentId.oid)});
    // console.log("userrrrrrrrrrrr", user);
    // return user;


    //error check 2


    // const user = await getUserById(students[0].studentId.oid);
    // console.log("userrrrrrrrrrrr", user);
    //
    // return user;


    // var i;
    // var results = {};
    // for( i = 0; i < students.length; i++){
    //
    //   const user = await collectionuser
    //     .find({_id : {'students[i].studentId.$id': new ObjectId()}});
    //   results[i] = user;
    // }


    //
  }


}

exports.findAssignmentsInfo = async function (id) {
  const db = getDBReference();

  const collectionst = db.collection('assignments');
  const findcourse = await getCourseById(id);
  console.log("findcoursessssssssssss:", findcourse);

  if(findcourse == null){
    return null;
  } else {
    const assignments = await collectionst
      .find({'courseId.$id': new ObjectId(id)})
      .project({_id: new ObjectId()})
      .toArray();

    var i;
    var results = {};
    for( i = 0; i < assignments.length; i++){
      const user = await getUserById(assignments[i].studentId.oid);
      results[i] = user;
    }
    return results;
  }

}
