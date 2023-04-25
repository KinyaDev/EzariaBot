const { Message } = require("discord.js");
const { accessId } = require("../ids");

/**
 *
 * @param {Message} message
 */
module.exports = async (message) => {
  // Whenever a user send a message in the verification channel,
  // it transforms it into message where the moderator and users can react to accept or not
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

  // Whenever a moderator send a message in the announce channel, it is replaced by the bot.
  if (message.channel.id === "1049037836743094282" && !message.author.bot) {
    message.delete();
    message.channel.send(
      message.content.replace(
        "/ev",
        "<@" + message.guild.roles.everyone.id + ">"
      )
    );
  }
};
