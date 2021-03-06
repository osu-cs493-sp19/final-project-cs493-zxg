
const fs = require('fs');
const { ObjectId, GridFSBucket } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
/*
 * Schema describing required/optional fields of a assignment object.
 */
const AssignmentsSchema = {
  courseId: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true }
};
exports.AssignmentsSchema = AssignmentsSchema;

/*
 * Schema describing required/optional fields of a submission object.
 */
const SubmissionSchema = {
  assignmentId: { required: true },
  studentId: { required: true },
  timestamp: { required: true },
  file: { required: true }
};
exports.SubmissionSchema = SubmissionSchema;

exports.getAssignmentsPage = async function (page) {
  const db = getDBReference();
  const collection = db.collection('assignments');
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

  const pageAssignments= results.slice(start, end);
  const links = {};
  if (page < lastPage) {
    links.nextPage = `/assignments?page=${page + 1}`;
    links.lastPage = `/assignments?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/assignments?page=${page - 1}`;
    links.firstPage = '/assignments?page=1';
  }

  return {
    assignments: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
    links: links
  };
};

/*
 * Executes a DB query to insert a new assignment into the database.
 */
 async function insertNewAssignment(assignment) {
  assignment = extractValidFields(assignment, AssignmentsSchema);
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}
exports.insertNewAssignment = insertNewAssignment;

/*
 * Executes a DB query to fetch a single specified assignment based on its ID.
 */
 async function getAssignmentById(id) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getAssignmentById = getAssignmentById;

async function updateAssignmentById(id, assignment) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  const assignmentValues = {
    courseId: assignment.courseId,
    title: assignment.title,
    points: assignment.points,
    due: assignment.due
  };

  const result = await collection.replaceOne(
    { _id: new ObjectId(id) },
    assignmentValues
  );
  return result.matchedCount > 0;
}
exports.updateAssignmentById = updateAssignmentById;

async function deleteAssignmentById(id) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });
  return result.deletedCount > 0;
}
exports.deleteAssignmentById = deleteAssignmentById;

exports.saveSubmissionFile = function (id, submission) {
  return new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, { bucketName: 'submissions' });

    const metadata = {
      timestamp: new Date().toString(),
      contentType: submission.contentType,
      studentId: submission.studentId,
      assignmentId: id,
      url:`/assignments/submissions/${submission.filename}`
    };

    const uploadStream = bucket.openUploadStream(
      submission.filename,
      { metadata: metadata }
    );

    fs.createReadStream(submission.path)
      .pipe(uploadStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', (result) => {
        resolve(result._id);
      });
  });
};

exports.getDownloadStreamByFilename = function (filename) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'submissions' });
  return bucket.openDownloadStreamByName(filename);
};

async function getSubmissionsByAssignmentId(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'submissions' });
  if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await bucket
      .find({ 'metadata.assignmentId': id })
      .toArray();
    return results;
  }
}
exports.getSubmissionsByAssignmentId = getSubmissionsByAssignmentId;

async function getAssignmentDetailsById(id) {
  const assignment = await getAssignmentById(id);
  if (assignment) {
    assignment.submissions = await getSubmissionsByAssignmentId(id);
  }
  return assignment;
}
exports.getAssignmentDetailsById = getAssignmentDetailsById;

async function getAssignmentsByCourseId(id) {
 const db = getDBReference();
 const collection = db.collection('assignments');
 if (!ObjectId.isValid(id)) {
   return [];
 } else {
   const results = await collection
     .find({ 'courseId.$id': new ObjectId(id) })
     .toArray();
   return results[0];
 }
}
exports.getAssignmentsByCourseId = getAssignmentsByCourseId;

exports.getCoursebyAssignmentId = async function (id) {
  const assignment = await getAssignmentById(id);
  //console.log(assignment);
  if (assignment) {
    const courseId = assignment.courseId.oid;
    //onsole.log("==courseId: ",courseId);
    const db = getDBReference();
    const collection = db.collection('courses');
    if (!ObjectId.isValid(courseId)) {
      return null;
    } else {
      const results = await collection
        .find({ _id: new ObjectId(courseId) })
        .toArray();
      return results[0];
    }
  }
}

exports.checkStudentId = async function (cid, sid) {
  const db = getDBReference();
  const collection = db.collection('students');
  const result = await collection
    .find({
      $and: [
        {'studentId.$id': new ObjectId(sid)},
        {'courseId.$id': new ObjectId(cid)}
      ]
    })
    .toArray();
    console.log(result[0]);
  return result[0];
}
