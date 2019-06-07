
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
