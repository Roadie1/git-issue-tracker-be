import { PaginationInfo } from "./";

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

interface IssueResponseUserInfo {
    login: string;
    id: string;
    avatar_url: string;
    html_url: string;
}

export interface IssueResponse {
    repository_url: string;
    html_url: string;
    id: string;
    number: number;
    title: string;
    user: IssueResponseUserInfo;
    labels: IssueLabelInfo[];
    state: string;
    locked: boolean;
    created_at: string;
    closed_at: string;
    pull_request?: IssuePullRequestInfo;
    body: string;
}

export interface Issue {
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

export interface IssuePayload {
    issues: Issue[];
    pagination: PaginationInfo;
}