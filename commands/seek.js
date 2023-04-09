const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const { logId } = require("../ids");

module.exports.data = new SlashCommandBuilder()
  .setName("seek")
  .setDescription("trouver un donjon dans le lieu.");

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  function children(id) {
    return interaction.guild.channels.cache.filter((c) => c.parentId === id);
  }

  let d = Math.random();

  let channelId = interaction.channel.id;
  let parentId = interaction.channel.parentId;
  let logchannel = await interaction.guild.channels.fetch(logId);

  if (
    channelId === "1049028357565710408" ||
    channelId === "1049293722203979876"
  ) {
    if (d < 0.5) {
      for (let [child_id, child] of children(parentId)) {
        if (child.name.includes("❓")) {
          child.permissionOverwrites.create(interaction.member, {
            ViewChannel: true,
          });

          logchannel.send(
            `${interaction.member} a trouvé un donjon ! <#${child.id}>`
          );

          interaction.reply({
            content: `Vous avez trouvé un donjon ! <#${child.id}>`,
            flags: ["Ephemeral"],
          });
        }
      }
    } else
      interaction.reply({
        content: "Vous avez cherché un donjon, mais rien trouvé...",
        flags: ["Ephemeral"],
      });
  } else if (
    parentId === "1049023999671279648" ||
    channelId === "1049294467498250310"
  ) {
    if (d < 0.4) {
      for (let [child_id, child] of children(parentId)) {
        if (child.name.includes("❓")) {
          child.permissionOverwrites.create(interaction.member, {
            ViewChannel: true,
          });

          logchannel.send(
            `${interaction.member} a trouvé un donjon ! <#${child.id}>`
          );

          interaction.reply({
            content: `Vous avez trouvé un donjon ! <#${child.id}>`,
            flags: ["Ephemeral"],
          });
        }
      }
    } else
      interaction.reply({
        content: "Vous avez cherché un donjon, mais rien trouvé...",
        flags: ["Ephemeral"],
      });
  } else if (!(parentId === "1049027478611566653")) {
    if (d < 0.15) {
      for (let [child_id, child] of children(parentId)) {
        if (child.name.includes("❓")) {
          child.permissionOverwrites.create(interaction.member, {
            ViewChannel: true,
          });

          logchannel.send(
            `${interaction.member} a trouvé un donjon ! <#${child.id}>`
          );

          interaction.reply({
            content: `Vous avez trouvé un donjon ! <#${child.id}>`,
            flags: ["Ephemeral"],
          });
        }
      }
    } else
      interaction.reply({
        content: "Vous avez cherché un donjon, mais rien trouvé...",
        flags: ["Ephemeral"],
      });
  }
};
