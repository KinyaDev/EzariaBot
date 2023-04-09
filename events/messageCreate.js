const { Message } = require("discord.js");
const { accessId } = require("../ids");

/**
 *
 * @param {Message} message
 */
module.exports = async (message) => {
  if (message.channel.id === accessId && !message.author.bot) {
    message.delete();
  }
};
