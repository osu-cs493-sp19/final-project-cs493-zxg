const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  AssignmentsSchema,
  SubmissionSchema
} = require('../models/assignment');

/*
 * Create a new Assignment.
 */
router.post('/', requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, AssignmentsSchema)) {
    // const userid = await ;
    if(useid ){
      try{
        // const id = await ;
        res.status(201).send({
          id: id
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
    // const assignment = await ;
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
 router.put('/:id', requireAuthentication, async (req, res, next) => {
   if(validateAgainstSchema(req.body, AssignmentsSchema)){
     // const userid = await ;
     if(useid ){
       try {
         // const id = await ;
         if (assignment) {
           res.status(200).send({
             id: id,
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
  router.delete('/:id', requireAuthentication, async (req, res, next) => {
    // const userid = await ;
    if(useid ){
      try {
        // const deleteSuccessful = await ;
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
   if(useid ){
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
    if(useid ){
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
