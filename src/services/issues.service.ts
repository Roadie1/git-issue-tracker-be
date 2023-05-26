import fetch, { Response } from 'node-fetch';
import { IssueDTO, GithubIssueDTO, DTOtoIssue, Issue } from "../dto";
import { IssueDetailsQuery, IssueQuery } from '../types';
import { cacheMiddleware } from '../middlewares';
import { IssueDetailsDTO, toIssueDetailsDTO } from '../dto';
import { GithubError } from '../util/errorHandling';

class IssuesService {
    private readonly issuesCache;
    private readonly issueDetailsCache;
    constructor() {
        this.issuesCache = cacheMiddleware.createCache<Issue[]>(600, 100000);
        this.issueDetailsCache = cacheMiddleware.createCache<IssueDetailsDTO[]>(60, 100000);
    }

    private GIT_URL = process.env.GIT_URL;

    private getIssuesUrl(user: string, repository: string, page: number, size: number): string {
        return this.GIT_URL + `/repos/${user}/${repository}/issues?page=${page}&per_page=${size}`;
    }

    private getIssueDetailsUrl(user: string, repository: string, number: string): string {
        return this.GIT_URL + `/repos/${user}/${repository}/issues/${number}`;
    }

    private getNextPage(header: string): string {
        const nextLink = header?.split(', ').find((link) => link.includes('rel="next"'));
        if (!nextLink) return '';
        return nextLink.slice(1, nextLink.indexOf('>'));
    }

    private async fetchFromGitApi(url: string): Promise<Response> {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            const json = await response.json();
            throw new GithubError(response.status, json.message);
        }
        return response;
    }

    private async fetchIssues(url: string): Promise<GithubIssueDTO[]> {
        const result = await this.fetchFromGitApi(url);
        let issues = await result.json() as GithubIssueDTO[];
        const nextLink = this.getNextPage(result.headers.get('link'));
        if (nextLink) {
            const nextIssues = await this.fetchIssues(nextLink);
            issues = [...issues, ...nextIssues];
        }
        return issues;
    }
    private async getAllIssues(user: string, repository: string): Promise<Issue[]> {
        const issues = await this.fetchIssues(this.getIssuesUrl(user, repository, 1, 100));
        if (!issues) {
            return [];
        }
        return issues.filter((issue => !issue.pull_request)).map(DTOtoIssue);
    }


    public async getIssuesByParams(query: IssueQuery): Promise<IssueDTO> {
        const { user, repository, size, page, forced } = query;
        const pageNumber = isNaN(Number(page)) || !page ? 1 : Number(page);
        const sizeNumber = isNaN(Number(size)) || !size ? 10 : Number(size);
        const cacheKey = `issues-${user}-${repository}`;

        let allIssues = this.issuesCache.retrieveItemValue(cacheKey);

        if (forced === 'true' || !allIssues) {
            allIssues = await this.getAllIssues(user, repository);
            this.issuesCache.storeExpiringItem(cacheKey, allIssues, 600);
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
    public async getIssueDetails(query: IssueDetailsQuery): Promise<IssueDetailsDTO> {
        const { user, repository, number } = query;
        const cacheKey = `issue-${user}-${repository}-${number}`;

        let issue = this.issueDetailsCache.retrieveItemValue(cacheKey);

        if (!issue) {
            const result = await this.fetchFromGitApi(this.getIssueDetailsUrl(user, repository, number));
            const resultJson = await result.json();
            issue = resultJson ? toIssueDetailsDTO(resultJson) : null;
            this.issueDetailsCache.storeExpiringItem(cacheKey, issue, 60);
        }
        return issue;
    }
}

export default new IssuesService();