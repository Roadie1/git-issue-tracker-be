export class GithubError {
    readonly status: number;
    readonly message: string;
    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}