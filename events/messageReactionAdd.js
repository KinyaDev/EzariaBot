const { accessId, verifiyId } = require("../ids");

module.exports = async (reaction, user) => {
  function accept(bool, author, channel) {
    if (bool) {
      channel.send(`<@${author.id}>, vous avez été accepté dans le serveur`);
    } else {
      channel.send(`<@${author.id}> n'a pas été accepté`);
    }
  }

  let generalChannel = await reaction.message.guild.channels.fetch(
    "1042757971895128107"
  );

  if (reaction.message.channel.id === accessId && !user.bot) {
    let authorId = reaction.message.embeds[0].footer.text;
    let author = await reaction.message.guild.members.fetch(authorId);
    let guildReactor = await reaction.message.guild.members.fetch(user.id);
    let role = await reaction.message.guild.roles.fetch(verifiyId);
    let realCount = reaction.users.cache.has(authorId)
      ? reaction.count - 2
      : reaction.count - 1;

    if (reaction.emoji.name === "✅") {
      if (guildReactor.permissions.has("Administrator", true)) {
        author.roles.add(role);
        accept(true, author, generalChannel);
      } else if (realCount >= 8) {
        author.roles.add(role);
        accept(true, author, generalChannel);
      }
    }

    if (reaction.emoji.name === "❌") {
      if (guildReactor.permissions.has("Administrator", true)) {
        reaction.message.delete();
        accept(false, author, reaction.message.channel);
        if (author.kickable) author.kick("Pas accepté par les modérateurs");
      } else if (realCount >= 8) {
        reaction.message.delete();
        accept(false, author, reaction.message.channel);
        if (author.kickable) author.kick("Pas accepté par les modérateurs");
      }
    }
  }
};
