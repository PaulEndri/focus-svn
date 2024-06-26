# Focus SVN Helper Tool
## Installation
`npm install -g focus-svn`
## Basic Usage
- `focus-svn config --root=(FOCUS ROOT) --branchPrefix=(JIRA PROJECT KEY) --branchDir=(SVN BRANCH DIR) --trunk=(ACTIVE TRUNK)`
-- set the base focus svn root and config details
- `focus-svn cp (JIRA NUMBER)`
-- Creates a new branch off the active trunk with the name FOCUS-(JIRA Number)
- `focus-svn co (JIRA NUMBER) --target=(dir)(optional)`
--  Checks out the specified branch off the active trunk to either the current directory or specified directory
- `focus-svn switch (JIRA NUMBER)`
-- Switches active directory to specified branch
- `focus-svn rebase --source=(JIRA NUMBER) --target=(branch number/name)`
-- Rebases the specified branch unto a new branch, branched off of trunk
- `focus-svn ms (JIRA NUMBER)(optional)`
-- Generates a merge command to use for the specified branch or current directory

### Notes
Jira Number can be anything so if there's a rebased branch you want to check out or use that's `3333-2` for example, that'll work just fine.
## Usage Examples
```
focus-svn config --root={{focus-root}} --trunk=6 --branchPrefix=JIRA --branchDir=dev
focus-svn cp 43303
focus-svn cp 42709 --switch #creates branch and switches active directory to that branch
focus-svn cp 31769 --fv=11 #creates a branch off of focus 12
focus-svn co 42632 --target=dev #checks out the specified branch to a dev directory
focus-svn co 48812-123
focus-svn co 31769 --fv=11 #checks out FOCUS-31769 from 11.0
focus-svn config --trunk=13 #changes default trunk to 13.0
focus-svn ms 31769 #spits out a string similar to "svn merge --accept p -r#####:HEAD {{root}}/{{branch-dir}}/{{trunk}}/dev/{{prefix}}-31769"
focus-svn rm 31769 #deletes 31769
```
## Commands
### getMergeString
#### spit out a copy/paste ready merge string for local branch
*Aliases: ms*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branchName | - | string | branch to get a merge string for (default: working branch, optional) |  |
| branchSource | - | string | Use this as url base instead of automatically generated root (default: focus svn root, optional) |  |
---
### checkout [branchNumber] [targetDir]
#### checkout branch in current directory
*Aliases: co*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name or jira number |  |
| target | - | string | directory to checkout branch into (optional) |  |
---
### rebase
#### create a new branch off the chosen trunk and merge the target branch into it

| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| target | - | string | branch name to rebase into |  |
| source | - | string | source branch name |  |
| branch | - | string | branch name/number |  |
---
### switch [branchName]
#### switch current directory branch
*Aliases: s*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name/number to switch current working directory to |  |
---
### cp [branchName]
#### create a branch
*Aliases: create, branch*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name or jira number |  |
| switchBranch | - | boolean | also switch active directory to branch (optional) |  |
| prefix | - | string | branch prefix (default: FOCUS, optional) |  |
---
### config
#### change tool default variables

| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| activeTrunk | - | string | set this to change the default trunk version to use as tool |  |
| root | - | string | configure focus svn root |  |
| branchPrefix | - | string | set the default branch prefix (default: FOCUS) |  |
| output | - | string | svn output type |  |
---
### remove
#### remove a branch from svn
*Aliases: rm*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name/number to delete |  |
