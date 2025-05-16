import JiraApi from "jira-client";

export class JiraService {
	projectId = null;
	auth = null;
	jira = null;
	host = null;

	get versionRegex() {
		return new RegExp(/-r(\d+)\:HEAD/gm);
	}

	constructor(config) {
		const { jiraUserName, jiraToken, jiraHost } = config;

		if (!jiraUserName || !jiraToken || !jiraHost) {
			if (config.verbose) {
				console.warn('Unable to set up JIRA integration, check all set up is configured');
			}
		} else {
			this.auth = Buffer.from(
				`${config.jiraUsername}:${config.jiraToken}`,
			).toString("base64");
			this.host = config.jiraHost;
			this.projectId = config.jiraProject;
			this.jira = new JiraApi({
				protocol: "https",
				host: config.jiraHost,
				//bearer: Buffer.from(`${config.jiraUserName}:${config.jiraToken}`).toString('base64'),
				username: config.jiraUserName,
				password: config.jiraToken,
				apiVersion: "2",
			});
		}
	}

	integrationActive() {
		return !!this.auth;
	}

	async getBranchName(branchName) {
		const returnData = { branchName, error: "", missing: false };
		if (!this.auth) {
			return returnData;
		}

		try {
			// Parse branch number for Jira lookup
			const branchParts = branchName.split("-");
			if (branchParts.length === 2) {
				const ticketInfo = await jira.getTicketInfo(branchParts[1]);
				if (ticketInfo?.branchName) {
					returnData.branchName = ticketInfo.branchName;
				} else {
					returnData.missing = true;
				}
			}
		} catch (e) {
			returnData.error = e?.message;
		}

		returnData;
	}

	async updateBranch(project, ticketNumber, branchName) {
		if (!this.auth) {
			return;
		}

		try {
			// Format the issue key (e.g., PROJ-123)
			const issueKey = `${project}-${ticketNumber}`;

			// Update the issue's branch name
			await this.jira.updateIssue(issueKey, {
				fields: {
					customfield_10102: branchName,
				},
			});
		} catch (error) {
			throw new Error(
				`Failed to update branch name for ${project}-${ticketNumber}: ${error.message}`,
			);
		}
	}
	/**
	 * Get Jira ticket information
	 * @param {string|number} ticketNumber - The ticket number
	 * @returns {Promise<Object>} Ticket information
	 */
	async getTicketInfo(ticketNumber) {
		if (!this.auth) {
			return;
		}

		try {
			// Format the issue key (e.g., PROJ-123)
			const issueKey = `${this.projectId}-${ticketNumber}`;

			// Get the issue details
			const issue = await this.jira.findIssue(issueKey);

			// Return relevant ticket information
			return {
				id: issue.id,
				key: issue.key,
				summary: issue.fields.summary,
				description: issue.fields.description,
				status: issue.fields.status.name,
				assignee: issue.fields.assignee?.displayName,
				reporter: issue.fields.reporter?.displayName,
				created: issue.fields.created,
				updated: issue.fields.updated,
				priority: issue.fields.priority?.name,
				branchName: issue.fields?.customfield_10102,
				revision: issue.fields?.customfield_13541?.match(
					this.versionRegex,
				)?.[1],
			};
		} catch (error) {
			console.log(error);
			throw new Error(
				`Failed to get ticket info for ${this.projectId}-${ticketNumber}: ${error.message}`,
			);
		}
	}
}

export default JiraService;
