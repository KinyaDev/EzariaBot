const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
  .setName("nuke")
  .setDescription("réinitialiser un salon")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  interaction.channel.clone();
  interaction.channel.delete();
};
