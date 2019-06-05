

const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: {required: false}
};
exports.UserSchema = UserSchema;
