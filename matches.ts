
class Matches {

    private wkb: any;
    private _matches: Match[];
    private initError: boolean = false;

    constructor(workbook: any) {
        this.wkb = workbook;
        try {
            let drawRange = this.wkb.getRangeByName(DRAW);
            let draw = drawRange.getValues();
            this._matches = [];
            for (let index = 0; index < draw.length; index++) {
                this._matches.push(new Match(draw[index], drawRange.offset(index, 0, 1, 1).getA1Notation()));
            }
        } catch (ex) {
            Logger.log('CHYBA: Nelze parsovat rozpis zapasu!');
            this.initError = true;
        }
        if (this.initError) return;
    }

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

    getMatchByAddress(rowIndex: number) {
        let a1Address = 'A' + rowIndex.toString();
        let matchOnTheSameRow = this._matches.find(x => x.firstColumnAddress == a1Address);
        if (matchOnTheSameRow) {
            return matchOnTheSameRow;
        }
        else {
            return null;
        }
    }
}