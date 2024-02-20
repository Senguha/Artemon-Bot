const { Events } = require("discord.js");

const EmojiArr = [
    "1150692529528918086",
    "1150870705823567872",
    "1150838168040505414",
    "1150715764572172298",
    "1150692857271820288",
    "1150692726707322910",
    "1150692604812476468",
    "1150838169932144680",
    "1150870694989660220",
    "1150870709225127978",
    "🐷",
    "🐖",
  ];
 
const HoholArr = [
    "Иди нахуй хохол 🐻🐻🐻",
    "Хохол чё с ебалом?",
    "Хрю, уииииииии",
    "Хрюкни, порось",
    "Я твоего ребёнка в унитазе утопил",
  ];

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot) return;
    if (message.member.roles.cache.some((role) => role.name === "HOHOL"))
      message.reply(HoholArr[Math.floor(Math.random() * HoholArr.length)]);
    if (Math.floor(Math.random() * (100 - 0 + 1)) + 0 <= 25)
      message.react(EmojiArr[Math.floor(Math.random() * EmojiArr.length)]);
  },
};
