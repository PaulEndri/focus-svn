# focus-svn

SVN cli tool to facilitate daily tasks in SVN using git-like commands and shortcuts

## Command List
- [checkout](#checkout)
- [config](#config)
- [createBranch](#createBranch)
- [merge](#merge)
- [getMergeString](#getMergeString)
- [jiraInfo](#jiraInfo)
- [rebase](#rebase)
- [remove](#remove)
- [switch](#switch)
### Command Details
---
### checkout
> checkout [branchNumber] [targetDir]

checkout branch into current directory, with Jira integration

*Aliases: co, clone*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | undefined | branch name or jira number |  |
| target | - | string | directory to checkout branch into (optional) |  |
| b | - | boolean | set to true to create branch if it does not exist |  |
---
### config
> config

change tool default variables


| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| activeTrunk | - | undefined | set this to change the default trunk version to use as tool |  |
| root | - | undefined | configure svn root |  |
| branchPrefix | - | string | set the default branch prefix |  |
| output | - | string | svn output type |  |
| verbose | - | boolean | undefined |  |
| silent | - | boolean | undefined |  |
| jiraHost | - | string | jira source url |  |
| jiraUserName | - | string | jira username |  |
| jiraToken | - | string | jira api key |  |
| branchDir | - | string | svn branch directory |  |
| extract | - | boolean | echo out the config json |  |
---
### createBranch
> createBranch [branchName]

create a branch

*Aliases: cp, copy, branch*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | undefined | branch name or jira number |  |
| switchBranch | - | boolean | also switch active directory to branch (optional) |  |
| prefix | - | string | branch prefix (default: NULL, optional) |  |
---
### merge
> merge [branch]

merge specified branch into active or target branch

*Aliases: m*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branchName | - | string | branch to merge |  |
| target | - | string | branch to merge into (optional) | ./ |
---
### getMergeString
> getMergeString [branch]

spit out a copy/paste ready merge string for local branch

*Aliases: ms*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branchName | - | string | branch to get a merge string for (default: working branch, optional) |  |
| branchSource | - | string | Use this as url base instead of automatically generated root (default: svn root) |  |
---
### jiraInfo
> jiraInfo [branchName]

get jira information

*Aliases: jira*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name/number to switch current working directory to |  |
---
### rebase
> rebase

create a new branch off the chosen trunk and merge the target branch into it


| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| target | - | string | branch name to rebase into |  |
| source | - | string | source branch name |  |
| branch | - | string | branch name/number |  |
| resolve | - | string | resolve option for merge | p |
---
### remove
> remove [branchName]

remove a branch from svn

*Aliases: rm, delete*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name/number to delete |  |
---
### switch
> switch [branchName]

switch current directory branch

*Aliases: s*
| Argument Name | Alias | Type | Description | Default |
| ------------- | ----- | ---- | ----------- | ------- |
| branch | - | string | branch name/number to switch current working directory to |  |
