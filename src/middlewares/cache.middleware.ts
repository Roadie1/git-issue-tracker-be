
import { MemoryCache } from 'memory-cache-node';
import { IssueDTO } from '../dto';

const issuesCache = new MemoryCache<string, IssueDTO[]>(600, 1000000);
export { issuesCache }