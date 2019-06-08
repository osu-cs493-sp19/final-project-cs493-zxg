// db.users create
var user1 = {
  "name": "Admin",
  "email": "admin@qq.com",
  "password": "hunter2",
  "role": 0
}

var user2 = {
  "name": "student1",
  "email": "st1@qq.com",
  "password": "hunter2",
  "role": 1
}

var user3 = {
  "name": "student3",
  "email": "st3@qq.com",
  "password": "hunter2",
  "role": 1
}

var user4 = {
  "name": "student4",
  "email": "st4@qq.com",
  "password": "hunter2",
  "role": 1
}

var user5 = {
  "name": "student5",
  "email": "st5@qq.com",
  "password": "hunter2",
  "role": 1
}

var user6 = {
  "name": "student6",
  "email": "st6@qq.com",
  "password": "hunter2",
  "role": 1
}

var user7 = {
  "name": "instructor1",
  "email": "in1@qq.com",
  "password": "hunter2",
  "role": 2
}

var user8 = {
  "name": "instructor2",
  "email": "in2@qq.com",
  "password": "hunter2",
  "role": 2
}

var user9 = {
  "name": "instructor3",
  "email": "in3@qq.com",
  "password": "hunter2",
  "role": 2
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
  "title": "COMPUTERS: APPS  IMPLICATIONS",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user7._id
  }
}

var course2 = {
  "subject": "Computer Science",
  "number": "160",
  "title": "COMPUTER SCIENCE ORIENTATION",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user7._id
  }
}

var course3 = {
  "subject": "Computer Science",
  "number": "161",
  "title": "INTRO TO COMPUTER SCIENCE I",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user7._id
  }
}

var course4 = {
  "subject": "Computer Science",
  "number": "162",
  "title": "INTRO TO COMPUTER SCIENCE II",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user8._id
  }
}

var course5 = {
  "subject": "Computer Science",
  "number": "175",
  "title": "*SECURITY & SOCIAL MOVEMENTS",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user8._id
  }
}

var course6 = {
  "subject": "Computer Science",
  "number": "175",
  "title": "*SECURITY & SOCIAL MOVEMENTS",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user8._id
  }
}

var course7 = {
  "subject": "Computer Science",
  "number": "175",
  "title": "*SECURITY & SOCIAL MOVEMENTS",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user9._id
  }
}

var course8 = {
  "subject": "Accounting",
  "number": "317",
  "title": "EXTERNAL REPORTING I",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user9._id
  }
}

var course9 = {
  "subject": "Accounting",
  "number": "378",
  "title": "ACTG INFORMATION MANAGEMENT",
  "term": "Fall 2019",
  "instructorId":{
    "$ref": "users",
    "$id": user9._id
  }
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

//db.students Create
var student1 = {
  "studentId":{
    "$ref": "users",
    "$id": user2._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course1._id
  }
}

var student2 = {
  "studentId":{
    "$ref": "users",
    "$id": user2._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course2._id
  }
}

var student3 = {
  "studentId":{
    "$ref": "users",
    "$id": user2._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course3._id
  }
}

var student4 = {
  "studentId":{
    "$ref": "users",
    "$id": user3._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course4._id
  }
}

var student5 = {
  "studentId":{
    "$ref": "users",
    "$id": user3._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course5._id
  }
}

var student6 = {
  "studentId":{
    "$ref": "users",
    "$id": user3._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course6._id
  }
}

var student7 = {
  "studentId":{
    "$ref": "users",
    "$id": user4._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course7._id
  }
}

var student8 = {
  "studentId":{
    "$ref": "users",
    "$id": user5._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course8._id
  }
}

var student9 = {
  "studentId":{
    "$ref": "users",
    "$id": user6._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course9._id
  }
}

var student10 = {
  "studentId":{
    "$ref": "users",
    "$id": user6._id
  },
  "courseId":{
    "$ref": "courses",
    "$id": course1._id
  }
}

db.students.save(student1);
db.students.save(student2);
db.students.save(student3);
db.students.save(student4);
db.students.save(student5);
db.students.save(student6);
db.students.save(student7);
db.students.save(student8);
db.students.save(student9);
db.students.save(student10);

//db.assignments Create
var assignment1 = {
  "courseId": {
    "$ref": "courses",
    "$id": course1._id
  },
  "title": "assignment1",
  "points": 10,
  "due": "no due"
}

var assignment2 = {
  "courseId": {
    "$ref": "courses",
    "$id": course2._id
  },
  "title": "assignment2",
  "points": 10,
  "due": "no due"
}

var assignment3 = {
  "courseId": {
    "$ref": "courses",
    "$id": course3._id
  },
  "title": "assignment3",
  "points": 10,
  "due": "no due"
}

var assignment4 = {
  "courseId": {
    "$ref": "courses",
    "$id": course4._id
  },
  "title": "assignment4",
  "points": 10,
  "due": "no due"
}

var assignment5 = {
  "courseId": {
    "$ref": "courses",
    "$id": course5._id
  },
  "title": "assignment5",
  "points": 10,
  "due": "no due"
}

var assignment6 = {
  "courseId": {
    "$ref": "courses",
    "$id": course6._id
  },
  "title": "assignment6",
  "points": 10,
  "due": "no due"
}

var assignment7 = {
  "courseId": {
    "$ref": "courses",
    "$id": course7._id
  },
  "title": "assignment7",
  "points": 10,
  "due": "no due"
}

var assignment8 = {
  "courseId": {
    "$ref": "courses",
    "$id": course8._id
  },
  "title": "assignment8",
  "points": 10,
  "due": "no due"
}

db.assignments.save(assignment1);
db.assignments.save(assignment2);
db.assignments.save(assignment3);
db.assignments.save(assignment4);
db.assignments.save(assignment5);
db.assignments.save(assignment6);
db.assignments.save(assignment7);
db.assignments.save(assignment8);


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
