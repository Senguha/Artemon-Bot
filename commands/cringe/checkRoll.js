const { SlashCommandBuilder, Collection } = require("discord.js");
const rollCooldown = require("../../events/interactionCreate.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rollcheck")
    .setDescription("Проверяет таймер на кнопке ролла ролей у пользователя.")
    .addUserOption((option) =>
      option
        .setName("targetuser")
        .setDescription("Пользователь которому нужно проверить таймер.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("targetuser");
    const now = Date.now();
    const expTime =
            rollCooldown.rollCooldown.get(user.id) + rollCooldown.cooldownAmount;
    const expTimestamp = Math.round(expTime / 1000);
    
    if (rollCooldown.rollCooldown.has(user.id)){
      await interaction.reply(`У пользователя ${user} есть КД на ROLL. Он кончится <t:${expTimestamp}:R>`);
      await wait(60000);
      await interaction.deleteReply();
    }
      

    else {
      await interaction.reply(`У пользователя ${user} нету КД на ROLL`);
      await wait(60000);
      await interaction.deleteReply();
    }
  },
};
