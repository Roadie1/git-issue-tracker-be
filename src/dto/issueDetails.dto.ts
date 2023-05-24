import { GithubIssueDTO, IssueLabelInfo, IssueUserInfo } from "./issue.dto";

export interface IssueDetailsDTO {
    htmlUrl: string;
    id: string;
    number: number;
    title: string;
    user: IssueUserInfo;
    labels: IssueLabelInfo[];
    locked: boolean;
    createdAt: string;
    body: string;
    state: string;
    assignees: IssueUserInfo[];
}

export function toIssueDetailsDTO(issue: GithubIssueDTO): IssueDetailsDTO {
    const labels = issue.labels.map((label) => ({
        name: label.name,
        color: label.color,
        description: label.description
    }));

    const assignees = issue.assignees.map((assignee) => ({
        login: assignee.login,
        avatarUrl: assignee.avatar_url,
        htmlUrl: assignee.html_url
    }));

    return {
        htmlUrl: issue.html_url,
        id: issue.id,
        number: issue.number,
        title: issue.title,
        user: {
            login: issue.user.login,
            avatarUrl: issue.user.avatar_url,
            htmlUrl: issue.user.html_url
        },
        labels,
        locked: issue.locked,
        createdAt: issue.created_at,
        body: issue.body,
        state: issue.state,
        assignees
    }
}