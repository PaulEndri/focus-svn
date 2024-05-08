import commands from "../commands/index.js";

const content = [];

commands.forEach(command => {
    if (command.command.indexOf('branchNumber') >= 0) {
        command.builder.branch.alias = ['branchNumber'];
    }
    if (command.command.indexOf('targetDir') >= 0) {
        command.builder.target.alias = ['targetDir'];
    }

    const info = [
        '---',
        `### ${command.command}`,
        `#### ${command.describe}`,
        command.aliases && Array.isArray(command.aliases) ? `*Aliases: ${command.aliases.join(', ')}*` : '',
        '| Argument Name | Alias | Type | Description | Default |',
        '| ------------- | ----- | ---- | ----------- | ------- |'
    ];

    Object.entries(command.builder).forEach(([argName, arg]) => {
        info.push(`| ${argName} | ${arg.aliases ? arg.aliases.join(', ') : '-'} | ${arg.type} | ${arg.describe} | ${arg.default ? arg.default : ''} |`);
    });

    content.push(...info);
})

console.log(content.join('\n'));