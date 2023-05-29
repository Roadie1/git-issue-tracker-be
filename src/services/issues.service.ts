import fetch, { Response } from 'node-fetch';
import { MemoryCache } from 'memory-cache-node';
import { IssueDTO, GithubIssueDTO, DTOtoIssue, Issue } from "../dto";
import { IssueDetailsQuery, IssueQuery } from '../types';
import { cacheMiddleware } from '../middlewares';
import { IssueDetailsDTO, toIssueDetailsDTO } from '../dto';
import { GithubError } from '../util/errorHandling';

class IssuesService {
    private readonly issuesCache: MemoryCache<string, Issue[]>;
    private readonly issueDetailsCache: MemoryCache<string, IssueDetailsDTO>;
    constructor() {
        this.issuesCache = cacheMiddleware.createCache<Issue[]>(600, 100000);
        this.issueDetailsCache = cacheMiddleware.createCache<IssueDetailsDTO>(60, 100000);
    }

    private GIT_URL = process.env.GIT_URL;

    private getIssuesUrl(user: string, repository: string, page: number, size: number): string {
        return this.GIT_URL + `/repos/${user}/${repository}/issues?page=${page}&per_page=${size}`;
    }

    private getIssueDetailsUrl(user: string, repository: string, number: string): string {
        return this.GIT_URL + `/repos/${user}/${repository}/issues/${number}`;
    }

    private getTotalPages(header: string): number {
        const lastLink = header.split(', ').find((link) => link.includes('rel="last"'));
        if(!lastLink) return 0;
        const indexStart = lastLink.indexOf('page=');
        const indexEnd = lastLink.indexOf('&per_page=');
        return Number(lastLink.slice(indexStart + 5, indexEnd));
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
            const json = await response.json() as Error;
            throw new GithubError(response.status, json.message);
        }
        return response;
    }

    private async fetchNextIssues(url: string):  Promise<GithubIssueDTO[]> {
        const result = await this.fetchFromGitApi(url);
        const issues = await result.json() as GithubIssueDTO[];
        return issues;
    }

    private async getAllIssues(user: string, repository: string): Promise<Issue[]> {
        const result = await this.fetchFromGitApi(this.getIssuesUrl(user, repository, 1, 100));
        const issues = await result.json() as GithubIssueDTO[];
        if (!issues) {
            return [];
        }
        const totalPages = this.getTotalPages(result.headers.get('link'));
        const promises: Promise<GithubIssueDTO[]>[] = [];
        for (let i = 2; i<= totalPages; i++) {
            promises.push(this.fetchNextIssues(this.getIssuesUrl(user, repository, i, 100)));
        }
        const issueArrays = await Promise.all(promises);
        const newIssues = issueArrays.reduce((acc, issuesArray) => {
            acc = [...acc, ...issuesArray];
            return acc; 
        }, []);
        return [...issues, ...newIssues].filter((issue => !issue.pull_request)).map(DTOtoIssue).sort((a, b) => {
            if(a.createdAt > b.createdAt) return -1;
            return 1;
        });
    }


    public async getIssuesByParams(query: IssueQuery): Promise<IssueDTO> {
        const { user, repository, size, page, forced } = query;
        const pageNumber = isNaN(Number(page)) || !page ? 1 : Number(page);
        const sizeNumber = isNaN(Number(size)) || !size ? 10 : Number(size);
        const cacheKey = `issues-${user}-${repository}`;

        let allIssues = this.issuesCache.retrieveItemValue(cacheKey);

        if (forced === 'true' || !allIssues) {
            allIssues = await this.getAllIssues(user, repository);
            this.issuesCache.storeExpiringItem(cacheKey, allIssues, 3600);
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
            const resultJson = await result.json() as GithubIssueDTO;
            issue = resultJson ? toIssueDetailsDTO(resultJson) : null;
            this.issueDetailsCache.storeExpiringItem(cacheKey, issue, 60);
        }
        return issue;
    }
}

export default new IssuesService();