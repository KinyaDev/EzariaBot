const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports.data = new SlashCommandBuilder()
  .setName("nuke")
  .setDescription("reset channel message (alias: nuke)");

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  let role = await interaction.guild.roles.fetch(process.env.MODO_ROLE_ID);

  if (role.members.get(interaction.user.id)) {
    interaction.channel.clone().then((channel) => {
      channel.send("nuked");
    });

    interaction.channel.delete();
  } else {
    interaction.reply({
      content: "Tu n'es pas vérifié pour faire cela!",
      flags: ["Ephemeral"],
    });
  }
};
