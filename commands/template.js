// Simply copy paste to create a new command
const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports.data = new SlashCommandBuilder()
  .setName("template")
  .setDescription("Template command, do not use");

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {};
