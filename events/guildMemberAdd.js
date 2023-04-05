const { GuildMember, ActionRowBuilder } = require("discord.js");
const { celebrateButton } = require("../lib");

/**
 *
 * @param {GuildMember} member
 */
module.exports = async (member) => {
  let welcomeChannel = await member.guild.channels.fetch(
    process.env.WELCOME_CHANNEL_ID
  );
  if (welcomeChannel && welcomeChannel.type === ChannelType.GuildText) {
    welcomeChannel.send({
      embeds: [
        {
          title: `Bienvenue ${member.user.username} !`,
          description: `Merci d'être venu! Nous sommes maintenant ${
            member.guild.memberCount -
            member.guild.members.cache.filter((f) => f.user.bot).size
          }`,
          thumbnail: { url: member.user.avatarURL() || member.avatarURL() },
          author: {
            name: member.user.username,
            icon_url: member.user.avatarURL() || member.avatarURL(),
          },

          footer: { text: `0 célèbrent votre venue!` },
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(celebrateButton).toJSON(),
      ],
    });
  }
};