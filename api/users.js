
const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken,  requireAuthentication, requireAdministration } = require('../lib/auth');
const {
  UserSchema,
  getUserById,
  getUsersPage,
  insertNewUser,
  getUserByEmail,
  validateUser,
  getCoursesByStudentId,
  getCoursesByInstructorId
} = require('../models/user');

/*
 * Get all users
 */
router.get('/users/info', async(req, res) => {
  try {
    const userspage = await getUsersPage(parseInt(req.query.page) || 1);
    res.status(200).send(userspage);
  } catch (err) {
    res.status(500).send({
      error: "Error fetching users.  Try again later."
    });
  }
});

/*
 * Fetch data about a specific User.
 */
router.get('/:id', requireAuthentication, async (req, res, next) => {
  //console.log(req.user);
  const userid = await getUserByEmail(req.user);
  //console.log(userid);
  if (req.params.id == userid._id || userid.role == 0) {
    try {
      const user = await getUserById(req.params.id);
      if (user) {
        if (userid.role == 1 || userid.role == 0){
          const student = await getCoursesByStudentId(req.params.id);
          Object.assign(user, student);
          res.status(200).send( user);
        }
        else if (userid.role == 2 || userid.role == 0 ){
          const instructor = await getCoursesByInstructorId(req.params.id);
          Object.assign(user, instructor);
          res.status(200).send( user);
        }

      } else {
        res.status(404).send({
          error: "Specified User `id` not found."
        });
      }
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error fetching user.  Try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Create a new User.
 {
  "name": "xxxx",
	"email": "stxx@qq.com",
	"password": "hunter2",
  "role": 1
 }
 */
router.post('/', requireAdministration, async(req,res,next) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    try {
      if(req.body.role == 1 || req.body.role == 2 || typeof req.body.role === 'undefined'){
        const id = await insertNewUser(req.body);
        res.status(201).send({
          _id: id
        });
      } else if(req.body.role == 0){
        const userid = await getUserByEmail(req.user);
        if(typeof userid === 'undefined' || userid.role == 1 || req.body.role == 2 ){
          res.status(401).send({
            error: "Invalid authentication token provided, only admin user can create another admin"
          });
        } else {
          const id = await insertNewUser(req.body);
          console.log("id is---------------------: ", id);
          res.status(201).send({
            _id: id
          });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Failed to insert user.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      err: "Request body does not contain a valid user."
    });
  }
});

/*
 * Log in a User.
 {
	"email": "st1@qq.com",
	"password": "hunter2"
}
{
	"email": "admin@qq.com",
	"password": "hunter2"
}
{
	"email": "in1@qq.com",
	"password": "hunter2"
}
 */
router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const user = await getUserByEmail(req.body.email);
      if (user) {
        const authenticated = await validateUser(user._id, req.body.password);
        if (authenticated) {
          const token = generateAuthToken(req.body.email);
          res.status(200).send({
            token: token,
            link: `/users/${user._id}`
          });
        } else {
          res.status(401).send({
            error: "The specified credentials were invalid."
          });
        }
      } else {
        res.status(401).send({
          error: "The specified credentials were invalid."
        });
      }
    } catch (err) {
      res.status(500).send({
        error: "Error validating user.  Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "The request body was either not present or did not contain all of the required fields."
    });
  }
});


module.exports = router;
