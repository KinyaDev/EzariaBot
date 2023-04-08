const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

const fs = require("fs");

require("dotenv").config();

module.exports.data = new SlashCommandBuilder()
  .setName("log")
  .setDescription("Convertir la conversation en fichier texte dans les logs")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

/**
 * @param {CommandInteraction} interaction
 */
module.exports.run = async (interaction) => {
  let logchannel = await interaction.guild.channels.fetch(
    process.env.LOG_CHANNEL_ID
  );

  let parsedtext = ``;

  let messages = await interaction.channel.messages.fetch({ limit: 100 });

  messages.reverse().forEach((msg) => {
    let createdAt = msg.createdAt;
    parsedtext += `[${createdAt.getDate()}/${
      createdAt.getMonth() + 1
    }/${createdAt.getFullYear()}] ${msg.author.username} (${
      msg.author.id
    }): ${msg.content.replace(new RegExp("\n", "g"), "\\n")}\n`;
  });

  let logpath = `./logs/${interaction.channelId}.txt`;

  fs.writeFileSync(logpath, `${parsedtext}`, "utf-8");

  if (logchannel && logchannel.isTextBased()) {
    logchannel
      .send({
        content: `Voici la sauvegarde de ${interaction.channel.name} (${interaction.channelId})`,
        files: [logpath],
      })
      .then(() => {
        fs.rmSync(logpath);
        interaction.reply({
          content: "Le salon a bien été conservé.",
          flags: "Ephemeral",
        });
      });
  }
};
