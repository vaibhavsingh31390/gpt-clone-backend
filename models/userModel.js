// Define the User model
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../dbConfig");
const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    age: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    forgetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed("password")) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
    },
  }
);

User.sync({ force: false })
  .then(() => {
    console.log("User table created");
  })
  .catch((err) => {
    console.error("Error creating User table:", err);
  });

module.exports = User;
