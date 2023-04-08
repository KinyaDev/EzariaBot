const { GuildMember, ActionRowBuilder, ChannelType } = require("discord.js");
const { celebrateButton } = require("../lib");
const hrpChannels = [
  "1042757971895128105",
  "1049303180317569105",
  "1049037836743094282",
  "1049294575157653564",
  "1049295564690432050",
  "1049023959053639782",
];

/**
 *
 * @param {GuildMember} member
 */
module.exports = async (member) => {
  if (process.env.VERIF === "true") {
    let channels = (await member.guild.channels.fetch())
      .filter((h) => !hrpChannels.includes(h.id))
      .filter((h) => !h.parent);

    function children(id) {
      return member.guild.channels.cache.filter((c) => c.parentId === id);
    }

    channels.forEach((ch) => {
      ch.edit({
        permissionOverwrites: [{ id: member, deny: "ViewChannel" }],
      });

      for (let [child_id, child] of children(ch.id)) {
        child.edit({
          permissionOverwrites: [{ id: member, deny: "ViewChannel" }],
        });
      }
    });
  }

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
