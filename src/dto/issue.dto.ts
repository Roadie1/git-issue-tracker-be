import { Metadata } from "../types";

interface IssueUserInfo {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
}

interface IssueLabelInfo {
    name: string;
    color: string;
    description: string;
}

interface IssuePullRequestInfo {
    url: string;
    html_url: string;
    merged_aT: string;
}

interface GithubIssueUserInfo {
    login: string;
    id: string;
    avatar_url: string;
    html_url: string;
}

export interface IssueDTO {
    htmlUrl: string;
    id: string;
    number: number;
    title: string;
    user: IssueUserInfo;
    labels: IssueLabelInfo[];
    locked: boolean;
    createdAt: string;
    body: string;
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
}

export interface IssuePayload {
    issues: IssueDTO[];
    metadata: Metadata;
}

export function toIssueDTO(issue: GithubIssueDTO): IssueDTO {
        const labels = issue.labels.map((label) => ({
            name: label.name,
            color: label.color,
            description: label.description
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
            body: issue.body
        }
}