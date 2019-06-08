
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');


const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: {required: false}
};
exports.UserSchema = UserSchema;

exports.getUsersPage = async function (page) {
  const db = getDBReference();
  const collection = db.collection('users');
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

  const pageUsers= results.slice(start, end);

   const links = {};
   if (page < lastPage) {
     links.nextPage = `/users?page=${page + 1}`;
     links.lastPage = `/users?page=${lastPage}`;
   }
   if (page > 1) {
     links.prevPage = `/users?page=${page - 1}`;
     links.firstPage = '/users?page=1';
   }

  return {
    users: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
    links: links
  };
};

async function getUserById(id, includePassword) {
  const db = getDBReference();
  const collection = db.collection('users');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const projection = includePassword ? {} : { password: 0 };
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .project(projection)
      .toArray();
    return results[0];
  }
};
exports.getUserById = getUserById;

exports.insertNewUser = async function (user) {
  const userToInsert = extractValidFields(user, UserSchema);
  const db = getDBReference();
  const collection = db.collection('users');

  const passwordHash = await bcrypt.hash(userToInsert.password, 8);
  userToInsert.password = passwordHash;

  const result = await collection.insertOne(userToInsert);
  return result.insertedId;
};

exports.getUserByEmail = async function (email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection
    .find({ email: email })
    .toArray();
  return results[0];
};

exports.validateUser = async function (id, password) {
  const user = await getUserById(id, true);
  const authenticated = user && await bcrypt.compare(password, user.password);
  return authenticated;
};
