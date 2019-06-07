
/*
 * Schema describing required/optional fields of a assignment object.
 */
const AssignmentsSchema = {
  assignmentId: { required: true },
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
