

const { ObjectId } = require('mongodb');
const { getDBReference } = require('../lib/mongo');

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  CoursesSchema,
  getCoursesPage,
  getCourseById,
  updateCourseById,
  insertNewCourse,
  deleteCourseById,
  //getCourseDetailById
  //getInstructorbyCourseId
} = require('../models/course');

const {
  getInstructorbyCourseId
} = require('../models/user');

const {
  StudentSchema,
  getStudentsPage,
  getStudentsbyId,
  insertStudentbyId,
  findStudentsInfo,
  getAssignmentsByCourseId
} = require('../models/student');

const {
  getAssignmentsPage,
} = require('../models/assignment')

const { getUserByEmail } = require('../models/user');

/*
 * Route to return a paginated list of courses.
 */
router.get('/', async (req, res) => {
  try {
    const coursespage = await getCoursesPage(parseInt(req.query.page) || 1);
    res.status(200).send(coursespage);
  } catch (err) {
  console.error(err);
  res.status(500).send({
    error: "Error fetching courses list.  Please try again later."
  });
}
});

/*
 * Route to create a new course.
 {
    "subject": "Computer Science",
    "number": "101",
    "title": "COMPUTERS: APPS & IMPLICATIONS",
    "term": "Fall 2019",
    "instructorId": {
        "$ref": "users",
        "$id": " ",
        "$db": ""
    }
}
 */
router.post('/', requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, CoursesSchema)) {
    const userid = await getUserByEmail(req.user);
    console.log(req.body.instructorId.$id);
    if(userid.role == 0){
      try {
        const id = await insertNewCourse(req.body);
        res.status(201).send({
          id: id,
          links:{
            course:`/courses/${id}`
          }
        });

      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting course into DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
    }
  } else {
    res.status(400).send({
      error: "The request body was either not present or did not contain a valid Course object."
    });
  }
});

/*
 * Route to fetch info about a specific course.
 */
 router.get('/:id', async (req, res, next) => {
   try {
    const course = await getCourseById(req.params.id);
     if (course) {
       res.status(200).send(course);
     } else {
       res.status(404).send({
         error: "Specified Course `id` not found."
       });
     }
   } catch (err) {
   console.error(err);
   res.status(500).send({
     error: "Unable to fetch course.  Please try again later."
   });
  }
});

/*
 * Update data for a specific Course.
 */
  router.put('/:id', requireAuthentication,  async (req, res, next) => {
    if (validateAgainstSchema(req.body, CoursesSchema)) {
      const userid = await getUserByEmail(req.user);
      if((userid._id == req.body.instructorId.$id && userid.role == 2) || userid.role == 0){
        try {
          const updatecourse = await updateCourseById(req.params.id, req.body);
          const originalcourse = await getCourseById(req.params.id);

              if (updatecourse) {
                res.status(200).send({
                  updated: updatecourse
                });
              } else {
                res.status(404).send({
                  error: "Specified Course `id` not found."
                });
              }

        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Unable to update specified course.  Please try again later."
          });
        }
      } else {
        res.status(403).send({
          error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
        });
      }
    } else {
      res.status(400).send({
        error: "The request body was either not present or did not contain a valid Course object."
      });
    }
  });


/*
 * Remove a specific Course from the database.
 */
 router.delete('/:id', requireAuthentication,  async (req, res, next) => {
   // const userid = await ;
   const userid = await getUserByEmail(req.user);
   if(userid.role == 0){
     try {
       const deleteSuccessful = await deleteCourseById(req.params.id);

       if (deleteSuccessful) {
         console.log("Delete successful");
         res.status(204).end();
       } else {
         res.status(404).send({
           error: "Specified Course `id` not found."
         });
       }
     } catch (err) {
       console.error(err);
       res.status(500).send({
         error: "Unable to fetch course.  Please try again later."
       });
     }
   } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
    }
 });

//get all students course information

 router.get('/students/list', async (req, res) => {
   try {
     const studentspage = await getStudentsPage(parseInt(req.query.page) || 1);
     res.status(200).send(studentspage);
   } catch (err) {
   console.error(err);
   res.status(500).send({
     error: "Error fetching students list.  Please try again later."
   });
 }
});


// required function
// function getInstructorbyCourseId(id){
//   const db = getDBReference();
//   const collection = db.collection('courses');
//   const findcourse = getCourseById(id);
//   if (findcourse == null) {
//     return null;
//   } else {
//     const results = collection
//       .find({ _id: new ObjectId(id) })
//       .toArray();
//     console.log("resultsssssssssssss", results);
//     return results[0];
//   }
// }



 /*
  * Fetch a list of the students enrolled in the Course.
  */
  //老师教的或admin
  //
  // {
  //
  //     "studentId": {
  //         "$ref": "users",
  //         "$id": "5cfc4940dfe6941745f43ebas",
  //         "$db": ""
  //     },
  //     "courseId": {
  //         "$ref": "courses",
  //         "$id": "5cfc4940dfe6941745f43ec3",
  //         "$db": ""
  //     }
  // }


router.get('/:id/students', requireAuthentication,  async (req, res, next) => {
  const userid = await getUserByEmail(req.user);
  if(userid.role == 2 || userid.role == 0){
    try {

      const findinstructor = await getInstructorbyCourseId(req.params.id);
      const a = findinstructor.instructorId.oid;
      const b = userid._id;

      if( a == b || userid.role == 0 ){
        const studentList = await getStudentsbyId(req.params.id);
        if (studentList){
          res.status(200).send(studentList);
        } else {
          res.status(404).send({
            error: "Specified Course `id` not found."
          });
        }
      } else {

          res.status(500).send({
            error: "This instructor does not teach this course."
          })
      }

    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch course.  Please try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
    });
  }
});

/*
 * Update enrollment for a Course
 */

 //老师教的或admin
 //
 // {
 //
 //     "studentId": {
 //         "$ref": "users",
 //         "$id": "5cfc4940dfe6941745f43ebas",
 //         "$db": ""
 //     },
 //     "courseId": {
 //         "$ref": "courses",
 //         "$id": "5cfc4940dfe6941745f43ec3",
 //         "$db": ""
 //     }
 // }

 router.post('/:id/students', requireAuthentication,  async (req, res, next) => {
   if(validateAgainstSchema(req.body, StudentSchema)){
     const userid = await getUserByEmail(req.user);
     if(userid.role == 2 || userid.role == 0){
       try {

         const findinstructor = await getInstructorbyCourseId(req.params.id);
         const a = findinstructor.instructorId.oid;
         const b = userid._id;

         if( a == b|| userid.role == 0 ){
            const addStudentToCourse = await insertStudentbyId(req.params.id, req.body);
            console.log(addStudentToCourse);
             if(addStudentToCourse){
               res.status(200).send(addStudentToCourse);
             } else {
               res.status(404).send({
                 error: "Specified Course `id` not found."
               });
             }
          } else {
            res.status(500).send({
              error: "This instructor does not teach this course."
            })
          }

       } catch (err) {
         console.error(err);
         res.status(500).send({
           error: "Unable to fetch course.  Please try again later."
         });
       }
     } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
     }
   } else {
     res.status(400).send({
       error: "The request body was either not present or did not contain the fields described above."
     });
   }
 });

/*
* Fetch a CSV file containing list of the students enrolled in the Course.
*/
router.get('/:id/roster', requireAuthentication,  async (req, res, next) => {
  const userid = await getUserByEmail(req.user);
  if( userid.role == 2 || userid.role == 0 ){
    try{

      const findinstructor = await getInstructorbyCourseId(req.params.id);
      const a = findinstructor.instructorId.oid;
      const b = userid._id;

      if( a == b || userid.role == 0 ){
            const getRosterById = await findStudentsInfo(req.params.id);
          //  console.log("gettttttttttttttttttt", getRosterById);
            if (getRosterById) {
              res.status(200).send(getRosterById);
            } else {
              res.status(404).send({
                error: "Specified Course `id` not found."
              });
            }

      } else {
        res.status(500).send({
          error: "This instructor does not teach this course."
        })
      }

    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch course.  Please try again later."
      });
    }
  } else {
    res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
    });
  }
});


//get all course Assignments
router.get('/assignments/list', async (req, res) => {
  try {
    const assignmentspage = await getAssignmentsPage(parseInt(req.query.page) || 1);
    res.status(200).send(assignmentspage);
  } catch (err) {
  console.error(err);
  res.status(500).send({
    error: "Error fetching assignments list.  Please try again later."
  });
}
});



/*
 * Fetch a list of the Assignments for the Course.
 */
router.get('/:id/assignments', async (req, res, next) => {
  try {
    const assignments = await getAssignmentsByCourseId(req.params.id);
    console.log("aaaaaaaaaaa ", assignments);
    if (assignments) {
      res.status(200).send(assignments);
    } else {
      res.status(404).send({
        error: "Specified Course `id` not found."
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course.  Please try again later."
    });
  }
});

module.exports = router;
