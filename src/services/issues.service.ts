import fetch, { Response } from 'node-fetch';
import { IssueDTO, GithubIssueDTO, DTOtoIssue, Issue } from "../dto";
import { IssueDetailsQuery, IssueQuery } from '../types';
import { issuesCache, issueDetailsCache } from '../middlewares';
import { IssueDetailsDTO, toIssueDetailsDTO } from '../dto';

const { GIT_URL } = process.env;

function getIssuesUrl(user: string, repository: string, page: number, size: number): string {
    return GIT_URL + `/repos/${user}/${repository}/issues?page=${page}&per_page=${size}`;
}


function getIssueDetailsUrl(user: string, repository: string, number: string): string {
    return GIT_URL + `/repos/${user}/${repository}/issues/${number}`;
}

function getNextPage(header: string): string {
    const nextLink = header?.split(', ').find((link) => link.includes('rel="next"'));
    if(!nextLink) return '';
    return nextLink.slice(1, nextLink.indexOf('>'));
}

async function fetchFromGitApi(url: string): Promise<Response> {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }
    return fetch(url, options);
}

async function fetchIssues(url:string): Promise<GithubIssueDTO[]> {
    const result = await fetchFromGitApi(url);
    let issues = await result.json() as GithubIssueDTO[];
    const nextLink = getNextPage(result.headers.get('link'));
    if(nextLink) {
        const nextIssues = await fetchIssues(nextLink);
        issues = [...issues, ...nextIssues];
    }
    return issues;
}

async function getAllIssues(user: string, repository: string): Promise<Issue[]> {
    const issues = await fetchIssues(getIssuesUrl(user, repository, 1, 100));
    if(!issues) {
        return [];
    }
    return issues.filter((issue => !issue.pull_request)).map(DTOtoIssue);
}

export async function getIssuesByParams(query: IssueQuery): Promise<IssueDTO> {
    const { user, repository, size, page, forced } = query;
    const pageNumber = isNaN(Number(page)) || !page ? 1 : Number(page);
    const sizeNumber = isNaN(Number(size)) || !size ? 10 : Number(size);
    const cacheKey = `issues-${user}-${repository}`;

    let allIssues = issuesCache.retrieveItemValue(cacheKey);

    if (forced === 'true' || !allIssues) {
        allIssues = await getAllIssues(user, repository);
        issuesCache.storeExpiringItem(cacheKey, allIssues, 600);
    }
    return {
        issues: allIssues.slice((pageNumber - 1) * sizeNumber, pageNumber * sizeNumber),
        metadata: {
            totalCount: allIssues.length,
            page: pageNumber,
            size: sizeNumber,
            user,
            repository
        }
    }
}

export async function getIssueDetails(query: IssueDetailsQuery): Promise<IssueDetailsDTO> {
    const { user, repository, number } = query;
    const cacheKey = `issue-${user}-${repository}-${number}`;

    let issue = issueDetailsCache.retrieveItemValue(cacheKey);

    if(!issue) {
        const result = await (await fetchFromGitApi(getIssueDetailsUrl(user, repository, number))).json();
        issue = result ? toIssueDetailsDTO(result) : null;
        issueDetailsCache.storeExpiringItem(cacheKey, issue, 60);
    }
    return issue
}
