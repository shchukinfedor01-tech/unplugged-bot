const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    customId: "apply",

    async execute(interaction) {
        console.log("🎵 Заявка открыта");

        const modal = new ModalBuilder()
            .setCustomId("application")
            .setTitle("🎵 Заявка в Unplugged");

        const age = new TextInputBuilder()
            .setCustomId("age")
            .setLabel("📅 Ваш возраст (от 16)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Например: 18")
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(3);

        const reason = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("💀 Причина вступления")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Почему вы хотите вступить в Unplugged?")
            .setRequired(true)
            .setMaxLength(500);

        const families = new TextInputBuilder()
            .setCustomId("families")
            .setLabel("🏛️ Прошлые семьи")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Перечислите семьи, если были")
            .setRequired(false)
            .setMaxLength(200);

        const prime = new TextInputBuilder()
            .setCustomId("prime")
            .setLabel("🕐 Удобное время для обзвона")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Например: 18:00 - 22:00")
            .setRequired(true)
            .setMaxLength(50);

        const dm = new TextInputBuilder()
            .setCustomId("dm")
            .setLabel("⚔️ Откат DM с пятерки (12к+)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Вставьте ссылку на откат")
            .setRequired(true)
            .setMaxLength(200);

        modal.addComponents(
            new ActionRowBuilder().addComponents(age),
            new ActionRowBuilder().addComponents(reason),
            new ActionRowBuilder().addComponents(families),
            new ActionRowBuilder().addComponents(prime),
            new ActionRowBuilder().addComponents(dm)
        );

        await interaction.showModal(modal);
    }
};