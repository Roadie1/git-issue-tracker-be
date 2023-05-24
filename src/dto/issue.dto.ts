import { Metadata } from "../types";

export interface IssueUserInfo {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
}

export interface IssueLabelInfo {
    name: string;
    color: string;
    description: string;
}

interface IssuePullRequestInfo {
    url: string;
    html_url: string;
    merged_at: string;
}

interface GithubIssueUserInfo {
    login: string;
    id: string;
    avatar_url: string;
    html_url: string;
}

export interface Issue {
    id: string;
    number: number;
    title: string;
    user: IssueUserInfo;
    labels: IssueLabelInfo[];
    createdAt: string;
}

export interface GithubIssueDTO {
    repository_url: string;
    html_url: string;
    id: string;
    number: number;
    title: string;
    user: GithubIssueUserInfo;
    labels: IssueLabelInfo[];
    state: string;
    locked: boolean;
    created_at: string;
    closed_at: string;
    pull_request?: IssuePullRequestInfo;
    body: string;
    assignees: GithubIssueUserInfo[];

}

export interface IssueDTO {
    issues: Issue[];
    metadata: Metadata;
}

export function DTOtoIssue(issue: GithubIssueDTO): Issue {
        const labels = issue.labels.map((label) => ({
            name: label.name,
            color: label.color,
            description: label.description
        }));

        return {
            id: issue.id,
            number: issue.number,
            title: issue.title,
            user: {
                login: issue.user.login,
                avatarUrl: issue.user.avatar_url,
                htmlUrl: issue.user.html_url
            },
            labels,
            createdAt: issue.created_at,
        }
}