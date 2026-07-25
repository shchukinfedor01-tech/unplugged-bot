const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("панель")
        .setDescription("Отправить панель подачи заявок"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setAuthor({
                name: "UNPLUGGED",
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTitle("🎯 Заявка в семью")
            // ⬇️⬇️⬇️ МАЛЕНЬКИЙ ЛОГО (круглый, справа сверху) ⬇️⬇️⬇️
            .setThumbnail("https://media.discordapp.net/attachments/1488587061090062338/1527782867026055429/373CFAE1-8B34-400D-8002-1F1E360A5A0A.png?ex=6a65cd6c&is=6a647bec&hm=eae9b43ff2ad850e460114ecde580a66f43c498328fdafaee0ff3ded1d200077&=&format=webp&quality=lossless&width=1376&height=917")
            // ⬇️⬇️⬇️ БОЛЬШАЯ КАРТИНКА-ЛОГОТИП (во всю ширину) ⬇️⬇️⬇️
            .setImage("https://media.discordapp.net/attachments/1495077791966826709/1530518665177600000/ChatGPT_Image_25_._2026_._13_13_26.png?ex=6a65de15&is=6a648c95&hm=b6b5274e741e3c46bfbddbd9bfe861861c2e062697e5236454476b9e68a02124&=&format=webp&quality=lossless&width=1376&height=917")
            .setDescription(
                "Нажмите кнопку ниже, чтобы открыть форму заявки в семью.\n\n" +
                "---\n\n" +
                "**📋 Критерии подачи заявки:**\n" +
                "• Откат с арены – от 13к урона\n" +
                "• Возраст 16+\n\n" +
                "---\n" +
                "*Unplugged*"
            )
            .setFooter({ 
                text: "Unplugged • 2026", 
                iconURL: interaction.client.user.displayAvatarURL() 
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("apply")
                .setLabel("🎟 Подать заявку")
                .setStyle(ButtonStyle.Success)
                .setEmoji("🎟️")
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};