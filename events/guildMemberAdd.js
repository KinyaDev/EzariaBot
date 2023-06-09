// Welcome message

const { GuildMember, ChannelType } = require("discord.js");
const { welcomeId } = require("../ids");

/**
 *
 * @param {GuildMember} member
 */
module.exports = async (member) => {
  let welcomeChannel = await member.guild.channels.fetch(welcomeId);
  if (welcomeChannel && welcomeChannel.type === ChannelType.GuildText) {
    welcomeChannel.send({
      embeds: [
        {
          title: `Bienvenue ${member.user.username} !`,
          description: `Merci d'être venu! Nous sommes maintenant ${member.guild.memberCount}`,
          thumbnail: { url: member.user.avatarURL() || member.avatarURL() },
          author: {
            name: member.user.username,
            icon_url: member.user.avatarURL() || member.avatarURL(),
          },
        },
      ],
    });
  }
};
