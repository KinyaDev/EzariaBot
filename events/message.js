require("dotenv").config();
const { Message } = require("discord.js");

/**
 *
 * @param {Message} message
 */
module.exports = async (message) => {
  message.client.user.setUsername(message.author.username + "- Ezariabot");
};
