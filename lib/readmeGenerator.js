import commands from "../commands/index.js";

const content = [
	"# focus-svn\n",
	"SVN cli tool to facilitate daily tasks in SVN using git-like commands and shortcuts\n",
	"## Command List",
	...commands.map(command => {
		const short = command.command.split(' ')[0];

		return `- [${short}](#${short})`;
	}),
	'### Command Details',
];

commands.forEach(command => {
    if (command.command.indexOf('branchNumber') >= 0) {
        command.builder.branch.alias = ['branchNumber'];
    }
    if (command.command.indexOf('targetDir') >= 0) {
        command.builder.target.alias = ['targetDir'];
    }

		const short = command.command.split(' ')[0];
    const info = [
        '---',
        `### ${short}`,
				`> ${command.command}\n`,
				`${command.describe}\n`,
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