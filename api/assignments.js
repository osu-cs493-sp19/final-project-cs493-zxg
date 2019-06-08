const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  AssignmentsSchema,
  SubmissionSchema,
  insertNewAssignment,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  saveSubmissionFile,
  getDownloadStreamByFilename,
  getSubmissionsByAssignmentId
} = require('../models/assignment');
const { getUserByEmail } = require('../models/user');
/*
 * Create a new Assignment.
http://localhost:8000/assignments
{
 "courseId": {
        "$ref": "courses",
        "$id": " "
    },
 "title": "assignment 04",
 "points": "10",
 "due": "none"
}
 */

router.post('/', requireAuthentication,  async (req, res) => {
  if (validateAgainstSchema(req.body, AssignmentsSchema)) {
    const userid = await getUserByEmail(req.user);
    if(userid.role == 2 || userid.role == 0){
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
 {
	"courseId": {
        "$ref": "courses",
        "$id": "5cf985663012ad6dccce1bef"
    },
	"title": "assignment 04",
	"points": "10",
	"due": "none"
}
 */
 router.put('/:id',  async (req, res, next) => {
   if(validateAgainstSchema(req.body, AssignmentsSchema)){
     const userid = await getUserByEmail(req.user);
     if( userid.role == 2 || userid.role == 0 ){
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
  router.delete('/:id', requireAuthentication,  async (req, res, next) => {
    const userid = await getUserByEmail(req.user);
    if( userid.role == 2 || userid.role == 0 ){
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
 router.get('/:id/submissions',requireAuthentication,  async (req, res, next) => {
   const userid = await getUserByEmail(req.user);
   if( userid.role == 2 || userid.role == 0 ){
     try {
       const assignment = await getAssignmentById(req.params.id);
       if (assignment) {
         const submissions = await getSubmissionsByAssignmentId(req.params.id);
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
 const submissionTypes = {
   'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
   'application/pdf': 'pdf'
 };
 const upload = multer({
   storage: multer.diskStorage({
     destination: `${__dirname}/uploads`,
     filename: (req, file, callback) => {
       const basename = crypto.pseudoRandomBytes(16).toString('hex');
       const extension = submissionTypes[file.mimetype];
       callback(null, `${basename}.${extension}`);
     }
   }),
   fileFilter: (req, file, callback) => {
     //console.log(file.mimetype);
     callback(null, !!submissionTypes[file.mimetype])
   }
 });


function removeUploadedFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

router.post('/:id/submissions',requireAuthentication, upload.single('submission'), async (req, res, next) => {
  console.log("== req.file:", req.file);
  console.log("== req.body:", req.body);
  if (req.file && req.body && req.body.studentId) {
    const userid = await getUserByEmail(req.user);
    if( userid._id==req.body.studentId ){
      try {
        const submission = {
          path: req.file.path,
          filename: req.file.filename,
          contentType: req.file.mimetype,
          studentId: req.body.studentId
        };
        const assignment = await getAssignmentById(req.params.id);
        if(assignment) {
          const id = await saveSubmissionFile(req.params.id, submission);
          await removeUploadedFile(req.file);
          res.status(201).send({
            id: id,
            links: {
              submissions:`/assignments/submissions/${submission.filename}`
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
          error: "Unable to post submission.  Please try again later."
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

router.get('/submissions/:filename', (req, res, next) => {
  getDownloadStreamByFilename(req.params.filename)
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        next();
      } else {
        next(err);
      }
    })
    .on('file', (file) => {
      res.status(200).type(file.metadata.contentType);
    })
    .pipe(res);
});

module.exports = router;
