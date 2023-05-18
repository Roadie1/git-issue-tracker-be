import { Issue, IssuePayload, IssueResponse } from "../types";
import fetch from 'node-fetch';

const { GIT_URL } = process.env;

function getIssuesUrl(user: string, repository: string, page: number, size: number): string {
    return GIT_URL + `/repos/${user}/${repository}/issues?page=${page}&per_page=${size}`;
}

function getTotalPages(header: string, page: number): number {
    const lastLink = header.split(', ').find((link) => link.includes('rel="last"'));
    if(!lastLink) return page;
    const indexStart = lastLink.indexOf('page=');
    const indexEnd = lastLink.indexOf('&per_page=');
    return Number(lastLink.slice(indexStart + 5, indexEnd));
}

export async function getIssuesByParams(user: string, repository: string, page: string, size: string): Promise<IssuePayload> {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }

    const pageNumber = Number(page);
    const sizeNumber = Number(size);
    const result = await fetch(getIssuesUrl(user, repository, pageNumber, sizeNumber), options);
    const totalPages = getTotalPages(result.headers.get('link'), pageNumber);
    const allIssues = await result.json() as IssueResponse[];
    const issueSelection: Issue[] = allIssues.filter((issue => !issue.pull_request)).map((issue) => {
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
    });

    return {
        issues: issueSelection,
        pagination: {
            total: totalPages * sizeNumber,
            page: pageNumber,
            totalPages
        }
    };
}
