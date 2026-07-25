const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    customId: "application",

    async execute(interaction) {
        console.log("🎵 Заявка отправлена");

        await interaction.reply({ 
            content: "⏳ Создаю тикет...",
            ephemeral: true 
        });

        try {
            const age = interaction.fields.getTextInputValue("age");
            const reason = interaction.fields.getTextInputValue("reason");
            const families = interaction.fields.getTextInputValue("families") || "Не указано";
            const prime = interaction.fields.getTextInputValue("prime");
            const dm = interaction.fields.getTextInputValue("dm");

            // ========== КОНФИГ (ВСТАВЬ СВОЙ ID!) ==========
            const config = {
                categoryId: "1528743527616614501",
                roleModer: [
                    "1527718171652653056",
                    "1527789195169370183",
                    "1527790489527386262"
                ],
                roleAcademy: "1527795907733491844",
                roleObzvon: "1528823662009127053",
                logChannel: "1528750299550974054"
            };

            const guild = interaction.guild;
            const member = interaction.member;

            const category = guild.channels.cache.get(config.categoryId);
            if (!category) {
                throw new Error("Категория не найдена!");
            }

            // ======== ПРАВА ========
            const permissionOverwrites = [
                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                {
                    id: member.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles
                    ]
                }
            ];

            const roleIds = Array.isArray(config.roleModer) ? config.roleModer : [config.roleModer];
            for (const roleId of roleIds) {
                permissionOverwrites.push({
                    id: roleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageMessages,
                        PermissionFlagsBits.AttachFiles
                    ]
                });
            }

            // ======== СОЗДАЁМ ТИКЕТ ========
            const ticketChannel = await guild.channels.create({
                name: `🎫-${member.user.username}`,
                type: ChannelType.GuildText,
                parent: config.categoryId,
                permissionOverwrites: permissionOverwrites,
                topic: `Заявка от ${member.user.tag} | ${new Date().toLocaleString()}`
            });

            // ======== EMBED ========
            const embed = new EmbedBuilder()
                .setColor(0x2B2D31)
                .setTitle("🎵 ЗАЯВКА В UNPLUGGED")
                .setDescription(`**Статус:** 🟡 На рассмотрении`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: "📅 Возраст", value: `\`${age}\``, inline: true },
                    { name: "🕐 Обзвон", value: `\`${prime}\``, inline: true },
                    { name: "🏛️ Семьи", value: families, inline: false },
                    { name: "💀 Причина", value: reason || "Не указано", inline: false },
                    { name: "⚔️ Откат DM", value: dm || "Не указано", inline: false }
                )
                .setFooter({ 
                    text: `Unplugged • ${new Date().toLocaleString()}`,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            // ======== КНОПКИ В ТИКЕТЕ ========
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`accept_${member.id}_${Date.now()}`)
                    .setLabel("✅ Принять")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`obzvon_${member.id}_${Date.now()}`)
                    .setLabel("📞 Обзвон")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`reject_${member.id}_${Date.now()}`)
                    .setLabel("❌ Отказать")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`close_${member.id}_${Date.now()}`)
                    .setLabel("🔒 Закрыть тикет")
                    .setStyle(ButtonStyle.Secondary)
            );

            const roleMentions = roleIds.map(id => `<@&${id}>`).join(" ");

            await ticketChannel.send({
                content: `<@${member.id}> ${roleMentions}`,
                embeds: [embed],
                components: [row]
            });

            const pinMsg = await ticketChannel.send("📌 **Тикет создан!** Ожидайте проверяющего.");
            await pinMsg.pin();

            // ======== ЛОГИ ========
            const logEmbed = new EmbedBuilder()
                .setColor(0x2B2D31)
                .setTitle("📥 Новый тикет")
                .setDescription(`**Кандидат:** ${member.user.tag}`)
                .addFields(
                    { name: "Канал", value: ticketChannel.toString(), inline: true },
                    { name: "Возраст", value: `\`${age}\``, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: "Unplugged" });

            const logChannel = await guild.channels.fetch(config.logChannel).catch(() => null);
            if (logChannel) {
                await logChannel.send({ embeds: [logEmbed] });
            }

            await interaction.editReply({
                content: `✅ Тикет создан: ${ticketChannel}`,
                ephemeral: true
            });

            console.log(`✅ Тикет создан: ${ticketChannel.name}`);

        } catch (error) {
            console.error("❌ ОШИБКА:", error);
            await interaction.editReply({
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true
            });
        }
    }
};