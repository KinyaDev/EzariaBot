const { Message } = require("discord.js");
const { accessId } = require("../ids");

/**
 *
 * @param {Message} message
 */
module.exports = async (message) => {
  if (message.channel.id === accessId && !message.author.bot) {
    message.delete();
    message.channel
      .send({
        embeds: [
          {
            author: {
              name: message.author.username,
              icon_url: message.author.avatarURL(),
            },
            title: `Fiche de ${message.author.username}`,
            description: message.content,
            footer: { text: message.author.id },
          },
        ],
      })
      .then((msg) => {
        msg.react("✅");
        msg.react("❌");
      });
  }
};
