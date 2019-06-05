
const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken,   requireAdministration } = require('../lib/auth');
const {
  UserSchema
} = require('../models/user');

/*
 * Create a new User.
 */
 router.post('/', requireAdministration, async(req,res,next) => {

 });

/*
 * Log in a User.
 */
router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      // const authenticated = await validateUser(req.body.email, req.body.password);
      if (authenticated) {
        // const token = generateAuthToken(req.body.email);
        res.status(200).send({
          token: token
        });
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

/*
 * Fetch data about a specific User.
 */
router.get('/:id',   async (req, res, next) => {
  // const userid = await ;
  if (req.params.id == userid.id || userid.role == 1) {
    try {
      // const user = await ;
      if (user) {
        res.status(200).send(user);
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
module.exports = router;
