const { ButtonInteraction, ActionRowBuilder } = require("discord.js");
const { celebrateButton } = require("../lib");

/**
 * @param {ButtonInteraction} interaction
 */
module.exports = (interaction) => {
  let count =
    parseInt(interaction.message.embeds[0].data.footer.text.split(" ")[0]) || 0;

  let embed = interaction.message.embeds[0].data;
  interaction.message.edit({
    embeds: [
      {
        thumbnail: { url: embed.thumbnail.url },
        author: {
          name: embed.author.name,
          icon_url: embed.author.icon_url,
        },
        title: embed.title,
        description: embed.description,
        footer: { text: `${count + 1} célèbrent votre venue!` },
      },
    ],
    components: [
      new ActionRowBuilder().addComponents(celebrateButton).toJSON(),
    ],
  });

  interaction.reply({
    content: "Merci d'avoir souhaité la Bienvenue!",
    flags: ["Ephemeral"],
  });
};
