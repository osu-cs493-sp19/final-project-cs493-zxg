// db.users create
var user1 = {
  "name": "Admin",
  "userid": "1",
  "email": "admin@qq.com",
  "password": "hunter2",
  "role": "0"
}

var user2 = {
  "name": "student1",
  "userid": "2",
  "email": "st1@qq.com",
  "password": "hunter2",
  "role": "1"
}

var user3 = {
  "name": "student3",
  "userid": "3",
  "email": "st3@qq.com",
  "password": "hunter2",
  "role": "1"
}

var user4 = {
  "name": "student4",
  "userid": "4",
  "email": "st4@qq.com",
  "password": "hunter2",
  "role": "1"
}

var user5 = {
  "name": "student5",
  "userid": "5",
  "email": "st5@qq.com",
  "password": "hunter2",
  "role": "1"
}

var user6 = {
  "name": "student6",
  "userid": "6",
  "email": "st6@qq.com",
  "password": "hunter2",
  "role": "1"
}

var user7 = {
  "name": "instructor1",
  "userid": "7",
  "email": "in1@qq.com",
  "password": "hunter2",
  "role": "2"
}

var user8 = {
  "name": "instructor2",
  "userid": "8",
  "email": "in2@qq.com",
  "password": "hunter2",
  "role": "2"
}

var user9 = {
  "name": "instructor3",
  "userid": "9",
  "email": "in3@qq.com",
  "password": "hunter2",
  "role": "2"
}

db.users.save(user1);
db.users.save(user2);
db.users.save(user3);
db.users.save(user4);
db.users.save(user5);
db.users.save(user6);
db.users.save(user7);
db.users.save(user8);
db.users.save(user9);

//db.courses create

var course1 = {
  "subject": "Computer Science",
  "number": "101",
  "title": "COMPUTERS: APPS & IMPLICATIONS",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user7._id
  }]
}

var course2 = {
  "subject": "Computer Science",
  "number": "160",
  "title": "COMPUTER SCIENCE ORIENTATION",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user7._id
  }]
}

var course3 = {
  "subject": "Computer Science",
  "number": "161",
  "title": "INTRO TO COMPUTER SCIENCE I",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user7._id
  }]
}

var course4 = {
  "subject": "Computer Science",
  "number": "162",
  "title": "INTRO TO COMPUTER SCIENCE II",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user8._id
  }]
}

var course5 = {
  "subject": "Computer Science",
  "number": "175",
  "title": "*SECURITY & SOCIAL MOVEMENTS",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user8._id
  }]
}

var course6 = {
  "subject": "Computer Science",
  "number": "175",
  "title": "*SECURITY & SOCIAL MOVEMENTS",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user8._id
  }]
}

var course7 = {
  "subject": "Computer Science",
  "number": "175",
  "title": "*SECURITY & SOCIAL MOVEMENTS",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user9._id
  }]
}

var course8 = {
  "subject": "Accounting",
  "number": "317",
  "title": "EXTERNAL REPORTING I",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user9._id
  }]
}

var course9 = {
  "subject": "Accounting",
  "number": "378",
  "title": "ACTG INFORMATION MANAGEMENT",
  "term": "Fall 2019",
  "instructorid":[{
    "$ref": "users",
    "$id": user9._id
  }]
}

db.courses.save(course1);
db.courses.save(course2);
db.courses.save(course3);
db.courses.save(course4);
db.courses.save(course5);
db.courses.save(course6);
db.courses.save(course7);
db.courses.save(course8);
db.courses.save(course9);


// db.users.insertMany([
//   {
//     "name": "Block 15",
//     "address": {
//       "street": "300 SW Jefferson Ave.",
//       "city": "Corvallis",
//       "state": "OR",
//       "zip": "97333"
//     },
//     "phone": "541-758-2077",
//     "category": "Restaurant",
//     "subcategory": "Brewpub",
//     "website": "http://block15.com"
//   },
//
// ])
