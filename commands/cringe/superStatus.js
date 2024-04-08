const {
  SlashCommandBuilder,
  Collection,
  PermissionFlagsBits,
  Guild,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

const SSduration = 3 * 60 * 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("superstatus")
    .setDescription("Запускает цикл выдачи супер-статуса")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const func = async () => {
      const fetchedMembers = await interaction.guild.members.fetch();
      const people = fetchedMembers.filter((member) => !member.user.bot);
      const SSroleId = "1226980533972500490";
      const SSrole = interaction.guild.roles.cache.get(SSroleId);
      const superStatuses = fetchedMembers.filter((member) =>
        member.roles.cache.has(SSroleId)
      );
      superStatuses.map((ssUser) => {
        ssUser.roles.remove(SSrole);
      });

      const person = people.random();

      person.roles.add(SSrole);

      const channel = interaction.guild.channels.cache.get(
        "1150712146167087186"
      );
      const now = Date.now();
      const expTime = Math.round((now + SSduration) / 1000);
      channel
        .send(
          `НИЩИЙ ${person.displayName} получает супер-статус. Он истекает <t:${expTime}:R>`
        )
        .then(async (message) => {
          await wait(SSduration);
          message.delete();
        });   
      setTimeout(func, SSduration);
    };
    interaction.reply("Цикл выдачи супер-статуса запущен");
    func();
  },
};
