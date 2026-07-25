const { Client, GatewayIntentBits, REST, Routes, Collection } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const express = require('express');
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

console.log("📂 Загрузка Unplugged Bot...");

// Загрузка команд
try {
    const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        console.log(`   ✅ Команда: ${file}`);
    }
} catch (error) {
    console.log("   ❌ Нет команд");
}

// Загрузка кнопок
try {
    const buttonFiles = fs.readdirSync("./buttons").filter(f => f.endsWith(".js"));
    for (const file of buttonFiles) {
        const button = require(`./buttons/${file}`);
        client.buttons.set(button.customId, button);
        console.log(`   ✅ Кнопка: ${file}`);
    }
} catch (error) {
    console.log("   ❌ Нет кнопок");
}

// Загрузка модалок
try {
    const modalFiles = fs.readdirSync("./modals").filter(f => f.endsWith(".js"));
    for (const file of modalFiles) {
        const modal = require(`./modals/${file}`);
        client.modals.set(modal.customId, modal);
        console.log(`   ✅ Модалка: ${file}`);
    }
} catch (error) {
    console.log("   ❌ Нет модалок");
}

console.log(`\n📊 СТАТИСТИКА: ${client.commands.size} команд, ${client.buttons.size} кнопок, ${client.modals.size} модалок\n`);

// Регистрация команд
client.once("ready", async () => {
    console.log(`🎵 UNPLUGGED BOT ЗАПУЩЕН!`);
    console.log(`   🤖 ${client.user.tag}`);
    console.log(`   📡 На серверах: ${client.guilds.cache.size}`);
    
    try {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        const commands = [];
        for (const cmd of client.commands.values()) {
            commands.push(cmd.data.toJSON());
        }
        if (commands.length > 0) {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            console.log(`   ✅ Зарегистрировано ${commands.length} команд\n`);
        }
    } catch (error) {
        console.error("   ❌ Ошибка регистрации:", error);
    }
});

// Обработка взаимодействий
client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (cmd) await cmd.execute(interaction);
            return;
        }

        if (interaction.isButton()) {
            console.log(`🔘 Кнопка: ${interaction.customId}`);
            for (const [id, button] of client.buttons) {
                if (interaction.customId.startsWith(id)) {
                    await button.execute(interaction);
                    return;
                }
            }
            await interaction.reply({ content: "❌ Кнопка не найдена!", ephemeral: true });
            return;
        }

        if (interaction.isModalSubmit()) {
            console.log(`📝 Модалка: ${interaction.customId}`);
            for (const [id, modal] of client.modals) {
                if (interaction.customId.startsWith(id)) {
                    await modal.execute(interaction);
                    return;
                }
            }
            await interaction.reply({ content: "❌ Модалка не найдена!", ephemeral: true });
            return;
        }

    } catch (error) {
        console.error("❌ ОШИБКА:", error);
        if (!interaction.replied) {
            await interaction.reply({ 
                content: `❌ Ошибка: ${error.message}`,
                ephemeral: true 
            });
        }
    }
});

// ===== ВЕБ-СЕРВЕР ДЛЯ RENDER =====
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🎵 Unplugged Bot is running!');
});

app.listen(port, () => {
    console.log(`✅ Веб-сервер запущен на порту ${port}`);
});

// ===== ЗАПУСК БОТА =====
client.login(process.env.TOKEN);
console.log("🚀 Запуск Unplugged Bot...");
