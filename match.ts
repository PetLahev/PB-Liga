/**
 * A string literal that represents a withdrawal of a match.
 */
const WITHDRAWAL_STRING: string = "S";

/**
 * Stores information about one match (one row).
 */
class Match {
    matchFirstCol: string;
    matchOrder: string;
    round: string;
    matchDate: Date;
    matchTime: Date;
    place: string;
    homeTeam: string;
    homeTeamScore: number = -1;
    awayTeam: string;
    awayTeamScore: number = -1;
    score: string;
    sets: number[];

    /**
     * Processes the match info and stores relevant information.
     * @param matchRow the information about the match as an array of information
     */
    constructor(matchRow: any[], matchAddress: string) {
        this.matchFirstCol = matchAddress;
        this.matchOrder = matchRow[0];
        this.round = matchRow[1];
        this.matchDate = matchRow[2];
        this.matchTime = matchRow[3];
        this.place = matchRow[4];
        this.homeTeam = matchRow[5];
        this.awayTeam = matchRow[7];
        this.score = matchRow[8] + ':' + matchRow[10];
        this.homeTeamScore = this.validateScore(matchRow[8]);
        this.awayTeamScore = this.validateScore(matchRow[10]);

        this.sets = [];
        for (let index = 12; index < 21; index += 2) {
            if (matchRow[index] != "" && !isNaN(matchRow[index])) {
                this.sets.push(Number(matchRow[index]));
            }
        }
    }

    get firstColumnAddress(): string {
        return this.matchFirstCol;
    }

    private validateScore(value: any): number {
        if ((value != '' || value == 0) && !isNaN(value)) {
            return Number(value);
        }
        else if (value == WITHDRAWAL_STRING) {
            return 0; // for calculations of sets
        }
        return -1;
    }

    /**
     * Returns true if the given team is set as a home team otherwise false (away team)
     * @param teamName name of the team to find
     */
    isHomeTeam(teamName: string): boolean {
        return this.homeTeam == teamName;
    }

    /**
     * Returns true if the given team is part of the match
     * @param teamName name of the team to find
     */
    isTeamIncluded(teamName: string): boolean {
        return this.homeTeam == teamName || this.awayTeam == teamName;
    }

    /**
     * Returns true if at least one team withdrawn the match.
     */
    isWithdrawal(): boolean {
        return this.score.includes(WITHDRAWAL_STRING);
    }

    /**
     * Returns true if the home team withdrawn the match.
     */
    hasHomeWithdrawal(): boolean {
        return this.score[0] == WITHDRAWAL_STRING;
    }

    /**
     * Returns true if both teams withdrawn the match.
     */
    hasBothTeamsWithdrawal(): boolean {
        return this.score[0] == WITHDRAWAL_STRING && this.score[2] == WITHDRAWAL_STRING;
    }

    /**
     * Returns true if scores for both teams is written down including withdrawal.
     */
    isFinished(): boolean {
        return this.homeTeamScore >= 0 && this.awayTeamScore >= 0;
    }

    /**
     * Returns true if the home team won the match.
     */
    hasHomeWon(): boolean {
        return this.isFinished() && this.homeTeamScore > this.awayTeamScore;
    }
}