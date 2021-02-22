
/**
 *  Collects all teams and groups from the sheet and performs all required functions.
 */
class Teams {

    private _groups: string[] = [];
    private _teams: Team[] = [];
    private wkb: any;
    private initError: boolean = false;

    constructor(workbook: any) {
        this.wkb = workbook;
        let teamsRng: any;
        try {
            teamsRng = this.wkb.getRangeByName(TEAMS);
        } catch (ex) {
            Logger.log('CHYBA: Nexistuje pojmenovana oblast "Tymy"');
            this.initError = true;
        }
        if (this.initError) return;

        let sheet = teamsRng.getSheet();
        let numOfTeams = this.getNumOfTeams(teamsRng, sheet);
        let teamsRange = this.getTeamFullRange(teamsRng, sheet, numOfTeams);
        let teamsData: string[][] = teamsRange.getValues();
        for (let index = 0; index < teamsData.length; index++) {
            let teamInfo = teamsData[index];
            if (!this._groups.includes(teamInfo[2])) {
                this._groups.push(teamInfo[2]);
            }
            let team = new Team(teamInfo[0], teamInfo[1], teamInfo[2]);
            this._teams.push(team);
        }
    }

    /**
     * Returns all teams
     */
    get teams(): Team[] {
        return this._teams;
    }

    /**
     * Returns names of all teams
     */
    get teamNames(): string[] {
        let names: string[] = [];
        this.teams.forEach(team => {
            names.push(team.name);
        });
        return names;
    }

    /**
     * Returns all groups
     */
    get groups(): string[] {
        return this._groups;
    }

    private getNumOfTeams(teams: any, sheet: any): number {
        let numOfTeams: number = 100; // minimum number of teams to check
        let data: any[][] = sheet.getRange(teams.getRow(), teams.getColumn(), numOfTeams).getValues();
        if (data[numOfTeams - 1].toString() != "") {
            Logger.log('Mame vic jak 100 tymu!');
            numOfTeams = 200;
        }

        for (var i = 0; i < numOfTeams; i++) {
            if (data[i].toString() == "") {
                numOfTeams = i;
                Logger.log('Mame ' + numOfTeams + ' tymu.');
                break;
            }
        }
        return numOfTeams;
    }

    private getTeamFullRange(teams: any, sheet: any, numOfTeams: number): any {
        let firsRow = teams.getRow();
        let firstCol = teams.getColumn();
        let lastCol = teams.getLastColumn();
        let numOfCol = lastCol - firstCol + 1;
        return sheet.getRange(firsRow, firstCol, numOfTeams, numOfCol);
    }

}