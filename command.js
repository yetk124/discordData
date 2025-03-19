const { SlashCommandBuilder } = require('discord.js');


// commands.js는 봇이 지원하는 모든 슬래시 명령어를 정의하는 파일
// 즉, 봇이 어떤 명령어를 사용할 수 있는지 설정하는 곳

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    new SlashCommandBuilder()
        .setName('청소')
        .setDescription('Deletes a specified number of messages')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of messages to delete')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('병영수첩')
        .setDescription('서든어택 병영수첩에서 닉네임과 킬뎃 정보를 가져옵니다.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('조회할 서든어택 ID를 입력하세요.')
                .setRequired(true)
        )
].map(command => command.toJSON());

module.exports = commands;
