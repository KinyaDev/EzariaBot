const { accessId, verifiyId } = require("../ids");
module.exports = async (reaction, user) => {
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
        author.roles.remove(role);
        reaction.message.channel.send(
          `<@${author.id}>, votre vérifiction a été annulé`
        );
      } else if (realCount < 8) {
        author.roles.remove(role);
        reaction.message.channel.send(
          `<@${author.id}>, votre vérifiction a été annulé`
        );
      }
    }
  }
};
