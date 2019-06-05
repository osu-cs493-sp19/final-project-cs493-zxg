
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
