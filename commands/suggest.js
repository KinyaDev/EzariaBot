const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const { suggestId } = require("../ids");

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
  if (suggestId.includes(interaction.channelId)) {
    interaction.channel.send({
      embeds: [
        {
          author: {
            name: interaction.user.username,
            icon_url: interaction.user.avatarURL(),
          },

          title: `${interaction.user.username} suggère pour...`,
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
