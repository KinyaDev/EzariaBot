const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

require("dotenv").config();

module.exports.data = new SlashCommandBuilder()
  .setName("suggest")
  .setDescription("Suggérer")
  .addStringOption((option) =>
    option.setName("suggestion").setDescription("Suggestion").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("about").setDescription("A propos de...")
  );

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  if (interaction.channelId === process.env.SUGGEST_ID) {
    interaction.channel.send({
      embeds: [
        {
          author: {
            name: interaction.user.username,
            icon_url: interaction.user.avatarURL(),
          },

          title: `${interaction.user.username} suggère pour le bot...`,
          thumbnail: { url: interaction.user.avatarURL() },
          description: `${interaction.options.get("suggestion").value}`,
          footer: {
            text: interaction.options.get("about")
              ? `A propos de: ${interaction.options.get("about").value}`
              : ".",
          },
        },
      ],
    });
  }
  if (interaction.channelId === process.env.SUGGEST_ID2) {
    interaction.channel.send({
      embeds: [
        {
          author: {
            name: interaction.user.username,
            icon_url: interaction.user.avatarURL(),
          },
          title: `${interaction.user.username} suggère pour le serveur...`,
          thumbnail: { url: interaction.user.avatarURL() },
          description: `${interaction.options.get("suggestion").value}`,
          footer: {
            text: interaction.options.get("about")
              ? `A propos de: ${interaction.options.get("about").value}`
              : ".",
          },
        },
      ],
    });
  }

  interaction.reply({
    content: "Merci d'avoir envoyé une suggestion!",
    flags: ["Ephemeral"],
  });
};
