
const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  CoursesSchema,
  getCoursesPage,
  getCourseById,
  updateCourseById,
  insertNewCourse,
  deleteCourseById
} = require('../models/course');

const {
  StudentSchema,
  getStudentsPage,
  getStudentsbyId,
  insertStudentbyId,
  findStudentsInfo
} = require('../models/student');

const {
  getAssignmentsPage
} = require('../models/assignment')


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
 * Route to create a new business.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, CoursesSchema)) {
    // const userid = await ;
    const userid = 1;
    if(userid == 1){
      try {
        const id = await insertNewCourse(req.body);
        res.status(201).send({
          id: id
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
 router.put('/:id',  async (req, res, next) => {
   if (validateAgainstSchema(req.body, CoursesSchema)) {
     // const userid = await ;
     const userid = 1;
     if(userid == 1){
       try {
         const updatecourse = await updateCourseById(req.params.id, req.body);
         console.log(updatecourse);
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
 router.delete('/:id',  async (req, res, next) => {
   // const userid = await ;
   const userid =  1;
   if(userid == 1 ){
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

 /*
  * Fetch a list of the students enrolled in the Course.
  */
router.get('/:id/students',  async (req, res, next) => {
  // const userid = await ;
  const userid = 1;
  if(useid = 1 ){
    try {
      const studentList = await getStudentsbyId(req.params.id);
      if (studentList){
        res.status(200).send(studentList);
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

/*
 * Update enrollment for a Course
 */

 // error here
 router.post('/:id/students',  async (req, res, next) => {
   if(validateAgainstSchema(req.body, StudentSchema)){
     // const userid = await ;
     const userid = 1;
     if(userid == 1){
       try {
        const addStudentToCourse = await insertStudentbyId(req.params.id, req.body);
        console.log(addStudentToCourse);
         if(addStudentToCourse){
           res.status(200).send(addStudentToCourse);
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
   } else {
     res.status(400).send({
       error: "The request body was either not present or did not contain the fields described above."
     });
   }
 });

/*
* Fetch a CSV file containing list of the students enrolled in the Course.
*/
router.get('/:id/roster',  async (req, res, next) => {
  // const userid = await ;
  const userid = 1;
  if(userid == 1 ){
    try{
      const getRosterById = await findStudentsInfo(req.params.id);
    //  console.log("gettttttttttttttttttt", getRosterById);
      if (getRosterById) {
        res.status(200).send(getRosterById);
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


//get all course Assignments
router.get('/assignments/list', async (req, res) => {
  try {
    const assignmentspage = await getAssignmentsPage(parseInt(req.query.page) || 1);
    res.status(200).send(assignmentpage);
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
    // const assignments = await ;
    if (assignment) {

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
