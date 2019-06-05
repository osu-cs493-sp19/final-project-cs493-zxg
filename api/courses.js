
const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  CoursesSchema
} = require('../models/course');

/*
 * Route to return a paginated list of courses.
 */
router.get('/', async (req, res) => {
  try {

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
router.post('/',requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, CoursesSchema)) {
    const userid = await ;
    if(useid相符){
      try {


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
     const course = await ;
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
  router.put('/:id', requireAuthentication, async (req, res, next) => {
    try {
      const course = await ;
      if (course) {
        if (validateAgainstSchema(req.body, CoursesSchema)) {
          const userid = await ;
          if(useid相符){
            try {

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
 * Remove a specific Course from the database.
 */
 router.delete('/:id', requireAuthentication, async (req, res, next) => {
   const userid = await ;
   if(useid相符){
     try {
       const deleteSuccessful = await ;
       if (deleteSuccessful) {
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
 }

 /*
  * Fetch a list of the students enrolled in the Course.
  */
  router.get('/:id/students', requireAuthentication, async (req, res, next) => {
    const userid = await ;
    if(useid相符){
      try {
        const studentList = await ;
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
  }

/*
 * Update enrollment for a Course
 */
 router.post('/:id/students', requireAuthentication, async (req, res, next) => {
   if(validateAgainstSchema(req.body, )){
     const userid = await ;
     if(useid相符){
       try {
         const addStudentToCourse = await ;
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
 }

/*
* Fetch a CSV file containing list of the students enrolled in the Course.
*/
router.get('/:id/roster', requireAuthentication, async (req, res, next) => {
  const userid = await ;
  if(useid相符){
    try{
      const getRosterById = await ;
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
}

/*
 * Fetch a list of the Assignments for the Course.
 */
router.get('/:id/assignments', async (req, res, next) => {
  try {
    const assignments = await ;
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
}

module.exports = router;
