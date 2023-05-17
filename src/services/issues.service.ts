import { Issue } from "../models/issue.model";

function getIssuesByParams (user: string, repository: string): Issue[] {
    return [{id: '1', name: 'temp'}];
}

export {
    getIssuesByParams
}