import {NULL_VOTE} from "../global.constants";

export class Vote {
    private _id: number;
    private _userId: string;
    private _movieName: string;
    private _hasBeenWatched: boolean;

    constructor(id: number, userId: string, movieName: string, hasBeenWatched: boolean = false) {
        this._id = id;
        this._userId = userId;
        this._movieName = movieName;
        this._hasBeenWatched = hasBeenWatched;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get movieName(): string {
        return this._movieName;
    }

    set movieName(value: string) {
        this._movieName = value;
    }

    get hasBeenWatched(): boolean {
        return this._hasBeenWatched;
    }

    set hasBeenWatched(value: boolean) {
        this._hasBeenWatched = value;
    }

    get isNull(): boolean {
        return (this._id === NULL_VOTE.id &&
            this._hasBeenWatched === NULL_VOTE.hasBeenWatched &&
            this._userId === NULL_VOTE.userId &&
            this._movieName === NULL_VOTE.movieName);
    }

    getMovieLine(numberOfVotes: number) {
        return ` ${this._id}. **${this._movieName}**: ${numberOfVotes} voto${numberOfVotes === 1 ? '' : 's'}.`;
    }
}