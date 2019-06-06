
const { ObjectId } = require('mongodb');

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

exports.getUserById = async function (id) {
  const db = getDBReference();
  const collection = db.collection('users');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}

exports.insertNewUser = async function (user) {
  const db = getDBReference();
  const collection = db.collection('users');
  const result = await collection.insertOne(user);
  return result.insertedId;
};
