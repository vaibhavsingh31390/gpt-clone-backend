// Define the User model
const { DataTypes } = require("sequelize");
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
