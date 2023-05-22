import fetch from 'node-fetch';
import { IssuePayload, GithubIssueDTO, toIssueDTO, IssueDTO } from "../dto";
import { IssueQuery } from '../types';
import { issuesCache } from '../middlewares';

const { GIT_URL } = process.env;

function getIssuesUrl(user: string, repository: string, page: number, size: number): string {
    return GIT_URL + `/repos/${user}/${repository}/issues?page=${page}&per_page=${size}`;
}

function getNextPage(header: string,): string {
    const nextLink = header.split(', ').find((link) => link.includes('rel="next"'));
    if(!nextLink) return '';
    return nextLink.slice(1, nextLink.indexOf('>'));
}

async function fetchIssues(url:string): Promise<GithubIssueDTO[]> {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }
    const result = await fetch(url, options);
    let issues = await result.json() as GithubIssueDTO[];
    const nextLink = getNextPage(result.headers.get('link'));
    if(nextLink) {
        const nextIssues = await fetchIssues(nextLink);
        issues = [...issues, ...nextIssues];
    }
    return issues;
}

async function getAllIssues(user: string, repository: string): Promise<IssueDTO[]> {
    const issues = await fetchIssues(getIssuesUrl(user, repository, 1, 100));
    return issues.filter((issue => !issue.pull_request)).map(toIssueDTO);
}

export async function getIssuesByParams(query: IssueQuery): Promise<IssuePayload> {
    const { user, repository, size, page, forced } = query;
    const pageNumber = isNaN(Number(page)) || !page ? 1 : Number(page);
    const sizeNumber = isNaN(Number(size)) || !size ? 10 : Number(size);
    const cacheKey = `issues-${user}-${repository}`;

    let allIssues = issuesCache.retrieveItemValue(cacheKey);

    if (forced || !allIssues) {
        allIssues = await getAllIssues(user, repository);
        issuesCache.storeExpiringItem(cacheKey, allIssues, 600);
    }
    return {
        issues: allIssues.slice((pageNumber - 1) * sizeNumber, pageNumber * sizeNumber),
        metadata: {
            totalCount: allIssues.length,
            totalPages: Math.ceil(allIssues.length / sizeNumber)
        }
    }
}
