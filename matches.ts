/**
 * Collects all matches from the sheet and performs all required functions.
 */
class Matches {

    private _matches: Match[];
    private wkb: any;
    private firstColIndex: number;
    private initError: boolean = false;

    constructor(workbook: any) {
        this.wkb = workbook;
        try {
            let drawRange = this.wkb.getRangeByName(DRAW);
            let draw = drawRange.getValues();
            this._matches = [];
            this.firstColIndex = drawRange.offset(0, 0, 1, 1).getColumn();
            for (let index = 0; index < draw.length; index++) {
                this._matches.push(new Match(draw[index], drawRange.offset(index, 0, 1, 1).getA1Notation()));
            }
        } catch (ex) {
            Logger.log('CHYBA: Nelze parsovat rozpis zapasu!');
            this.initError = true;
        }
        if (this.initError) return;
    }

    /**
     * Returns all matches
     */
    get matches(): Match[] {
        return this._matches;
    }

    /**
     * Returns first column addresses (e.g. A7) for each match where given team is drawn
     * @param team the team for which to return match addresses
     */
    getTeamMatchesAddress(team: Team): string[] {
        let retVal: string[] = [];
        this._matches.forEach(match => {
            if (match.isTeamIncluded(team.name)) {
                retVal.push(match.firstColumnAddress);
            }
        });
        return retVal;
    }

    /**
     * Returns a match that is on given row in a sheet.
     * @param rowIndex the index of row of the match to find
     */
    getMatchByAddress(rowIndex: number) {
        if (this.firstColIndex > 25) {
            Logger.log("DEVELOPER NOTE: Handle this");
            return;
        }
        let colLetter = String.fromCharCode(64 + this.firstColIndex);
        let a1Address = colLetter + rowIndex.toString();
        let matchOnTheSameRow = this._matches.find(x => x.firstColumnAddress == a1Address);
        if (matchOnTheSameRow) {
            return matchOnTheSameRow;
        }
        else {
            return null;
        }
    }
}