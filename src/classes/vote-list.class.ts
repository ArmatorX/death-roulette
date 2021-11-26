import {Vote} from "./vote.class";
import {NULL_VOTE, USER_VOTES} from "../global.constants";

export class VoteList {
    private _votes: Vote[];

    constructor() {
        this._votes = [];
    }

    get votes(): Vote[] {
        return this._votes;
    }

    set votes(value: Vote[]) {
        this._votes = value;
    }

    get length(): number {
        return this._votes.length;
    }

    get isEmpty(): boolean {
        return this._votes.filter(v => !v.hasBeenWatched).length === 0;
    }

    clear() {
        this._votes = [];
    }

    clearIfEmpty() {
        if (this.isEmpty) {
            this.clear();
        }
    }

    removeUnusedVotesFromUser(userId: string) {
        this._votes = this._votes.filter(v => !(v.userId === userId && !v.hasBeenWatched));
    }

    findVoteById(id: number): Vote {
        const vote = this._votes.find(v => v.id === id);
        return vote ? vote : NULL_VOTE;
    }

    add(vote: Vote) {
        this._votes.push(vote);
    }

    getNumberOfVotesForMovie(movieName: string): number {
        return this._votes.filter(v => v.movieName === movieName).length;
    }

    getNumberOfVotesLeftForUser(userId: string): number {
        return USER_VOTES - this._votes.filter(v => v.userId === userId).length;
    }

    canUserVote(userId: string): boolean {
        return this.getNumberOfVotesLeftForUser(userId) > 0;
    }

    getMoviesWithVotes() {
        const linesWithDupplicates = this.votes
            .sort((fv1, fv2) => this.getNumberOfVotesForMovie(fv1.movieName) > this.getNumberOfVotesForMovie(fv2.movieName) ? -1 : 1)
            .map(v => v.getMovieLine(this.getNumberOfVotesForMovie(v.movieName)));

        return [...new Set(linesWithDupplicates)];
    }

    pickRandomMovie(): Vote {
        const index = Math.floor(Math.random() * this._votes.length);
        const vote = this._votes[index];
        this.markMovieAsWatched(vote.movieName);
        return vote;
    }

    markMovieAsWatched(movieName: string) {
        this._votes.forEach(v => {
            if (v.movieName === movieName) {
                v.hasBeenWatched = true;
            }
        });
    }
}