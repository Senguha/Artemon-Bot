const {
  SlashCommandBuilder,
  Collection,
  PermissionFlagsBits,
} = require("discord.js");

const wait = require('node:timers/promises').setTimeout;

function getRandom(x, y) {
  const range = y - x + 1;
  const rng = Math.floor(Math.random() * range);
  return rng + x;
}
const statusRevokeCooldown = new Collection();
const statusRevokeCooldownTime = 30 * 60;
const cooldownAmount = statusRevokeCooldownTime * 1000;

const deleteDelay = 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("statusrevoke")
    .setDescription(
      "Лишает статусного пользователя его роли с некоторым шансом."
    )
    .addUserOption((option) =>
      option
        .setName("targetuser")
        .setDescription("Пользователь которому нужно убрать статус.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const statusRole = interaction.guild.roles.cache.get("1150841738693447811");
    const hoholRole = interaction.guild.roles.cache.get("1150705209165762642");

    const karlik = interaction.member;
    const user = interaction.options.getUser("targetuser");
    const member = interaction.options.getMember("targetuser");

    if (
      (interaction.member.roles.cache.has("1150705209165762642") ||
        interaction.member.roles.cache.has("1150841738693447811")) &&
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return interaction.reply({
        content: "Отбирать статус могут только карлики",
        ephemeral: true,
      });
    }
    if (!member.roles.cache.has("1150841738693447811")) {
      return interaction.reply({
        content: `Вы не можете отбирать статус у пользователя ${user}, т.к. он им не обладает.`,
        ephemeral: true,
      });
    }
    const now = Date.now();
    if (statusRevokeCooldown.has(interaction.user.id)) {
      const expTime =
        statusRevokeCooldown.get(interaction.user.id) + cooldownAmount;
      if (now < expTime) {
        const expTimestamp = Math.round(expTime / 1000);
        return interaction.reply({
          content: `Ты на кд Вася, следующая попытка будет <t:${expTimestamp}:R>`,
          ephemeral: true,
        });
      }
    }
    statusRevokeCooldown.set(interaction.user.id, now);
    setTimeout(() => {
      statusRevokeCooldown.delete(interaction.user.id);
    }, cooldownAmount);

    const rolNum = getRandom(0, 100);

    if (rolNum > 95) {
      await interaction.reply({
        content: `Карлан ${karlik} попытался лишить статуса пользователя ${user}. За данный поступок он был опущен до уровня хохла.`,
      });
      karlik.roles.add(hoholRole);
      await wait(deleteDelay);
      await interaction.deleteReply();
    } else if (rolNum < 80) {
      await interaction.reply({
        content: `Карлан ${karlik} попытался лишить статуса пользователя ${user}, но вместо этого был защемлён в толчке.`,
      });
      await wait(deleteDelay);
      await interaction.deleteReply();
    } else {
      await interaction.reply({
        content: `Карлик ${karlik} лишил статуса пользователя ${user}.`,
      });
      member.roles.remove(statusRole);
      await wait(deleteDelay);
      await interaction.deleteReply();
    }
  },
};
