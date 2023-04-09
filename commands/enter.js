const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const { accessId } = require("../ids");
function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

module.exports.data = new SlashCommandBuilder()
  .setName("enter")
  .setDescription("Envoyer votre fiche de personnage")
  .addStringOption((option) =>
    option.setName("url").setDescription("Lien vers la fiche").setRequired(true)
  );

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  let url = interaction.options.get("url").value;
  let channel = await interaction.guild.channels.fetch(accessId);

  if (isValidHttpUrl(url)) {
    if (channel && channel.isTextBased())
      channel
        .send({
          embeds: [
            {
              author: {
                name: interaction.user.username,
                icon_url: interaction.user.avatarURL(),
              },
              title: `Fiche de ${interaction.user.username}`,
              url: url,
              description: url,
              footer: { text: interaction.user.id },
            },
          ],
        })
        .then((msg) => {
          msg.react("✅");
          msg.react("❌");
        });
  } else if (interaction.member.kickable) {
    interaction.member.kick("Invalide lien");
    interaction.reply(`:x: ${interaction.user.username} a une fiche invalide`);
  }
};
