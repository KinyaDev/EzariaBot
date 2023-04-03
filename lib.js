const { ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports.celebrateButton = new ButtonBuilder()
  .setCustomId("celebratebtn")
  .setEmoji("🎉")
  .setLabel("Célébrer")
  .setStyle(ButtonStyle.Primary);
