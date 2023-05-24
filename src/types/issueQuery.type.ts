export interface IssueQuery {
    user: string;
    repository: string;
    page: string;
    size: string;
    forced: string;
}

export interface IssueDetailsQuery {
    user: string;
    repository: string;
    number: string;
}