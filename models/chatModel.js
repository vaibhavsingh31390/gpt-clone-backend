const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Chat = sequelize.define(
  "Chat",
  {
    conversationId: {
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Chat.sync({ force: false })
  .then(() => {
    console.log("Chat table created");
  })
  .catch((err) => {
    console.error("Error creating Chat table:", err);
  });

module.exports = Chat;
