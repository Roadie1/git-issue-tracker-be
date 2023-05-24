
import { MemoryCache } from 'memory-cache-node';
import { Issue, IssueDetailsDTO } from '../dto';

const issuesCache = new MemoryCache<string, Issue[]>(600, 1000000);
const issueDetailsCache = new MemoryCache<string, IssueDetailsDTO>(60, 1000000);
export { issuesCache, issueDetailsCache }