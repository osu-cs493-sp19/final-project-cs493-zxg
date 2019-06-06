const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  AssignmentsSchema,
  SubmissionSchema,
  insertNewAssignment,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById
} = require('../models/assignment');

/*
 * Create a new Assignment.
 */
router.post('/',  async (req, res) => {
  if (validateAgainstSchema(req.body, AssignmentsSchema)) {
    const userid = 1 ;
    if(userid == 1){
      try{
        const id = await insertNewAssignment(req.body);
        res.status(201).send({
          id: id,
          links: {
            assignment: `/assignments/${id}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting assignment into DB.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
    }
  } else {
    res.status(400).send({
      error: "The request body was either not present or did not contain a valid Assignment object."
    });
  }
});

/*
 * Fetch data about a specific Assignment.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      res.status(404).send({
        error: "Specified Assignment `id` not found."
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }
});

/*
 * Update data for a specific Assignment.
 */
 router.put('/:id',  async (req, res, next) => {
   if(validateAgainstSchema(req.body, AssignmentsSchema)){
     const userid = 1;
     if(userid == 1){
       try {
         const assignment = await updateAssignmentById(req.params.id, req.body);
         if (assignment) {
           res.status(200).send({
             links:{
               assignment: `/assignments/${req.params.id}`
             }
           });
         } else {
           res.status(404).send({
             error: "Specified Assignment `id` not found."
           });
         }
       } catch (err) {
         console.error(err);
         res.status(500).send({
           error: "Unable to fetch assignment.  Please try again later."
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
 * Remove a specific Assignment from the database.
 */
  router.delete('/:id',  async (req, res, next) => {
    const userid = 1 ;
    if(userid==1 ){
      try {
        const deleteSuccessful = await deleteAssignmentById(req.params.id);
        if (deleteSuccessful) {
          res.status(204).end();
        } else {
          res.status(404).send({
            error: "Specified Assignment `id` not found."
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to delete assignment.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
    }
  });

/*
 * Fetch the list of all Submissions for an Assignment.
 */
 router.get('/:id/submissions', requireAuthentication, async (req, res, next) => {
   // const userid = await ;
   if(userid ){
     try {
       // const submissions = await ;
       if (submissions) {
         res.status(200).send(submissions);
       } else {
         res.status(404).send({
           error: "Specified Assignment `id` not found."
         });
       }
     } catch (err) {
       console.error(err);
       res.status(500).send({
         error: "Unable to delete assignment.  Please try again later."
       });
     }
   } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
   }
 });

/*
 * Create a new Submission for an Assignment.
 */
router.post('/:id/submissions', requireAuthentication, async (req, res, next) => {
  if (validateAgainstSchema(req.body, SubmissionSchema)) {
    // const userid = await ;
    if(userid ){
      try {
        // const id = await ;
        if(submission) {
          res.status(201).send({
            id: id
          });
        } else {
          res.status(404).send({
            error: "Specified Assignment `id` not found."
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to delete assignment.  Please try again later."
        });
      }
    } else {
      res.status(403).send({
        error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
    }
  } else {
    res.status(400).send({
      error: "The request body was either not present or did not contain a valid Submission object."
    });
  }
});

module.exports = router;
