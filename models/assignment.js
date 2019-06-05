
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
