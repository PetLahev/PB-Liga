
/**
 * A defined name that stores all teams and their groups.
 */
const TEAMS: string = "Tymy";
/**
 * A defined name that points to the draw of matches.
 */
const DRAW: string = "Zapasy";

/**
 * Prefix of a defined name for a table. The group letter must be added
 */
const TABLE_PREFIX: string = "Tabulka";

/**
 * Performs all required steps to build a result table.
 */
class TableBuilder {

    private groups: string[] = [];
    private teams: Team[] = [];
    private matches: Match[];
    private wkb: any;
    private initError: boolean = false;

    /**
     * Collects teams and their groups from the setting sheet and creates array of
     * teams with necessary properties.
     * @param workbook a reference to the active workbook
     */
    constructor(workbook: any) {
        let teamsRng: any;
        this.wkb = workbook;
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
            if (!this.groups.includes(teamInfo[2])) {
                this.groups.push(teamInfo[2]);
            }
            let team = new Team(teamInfo[0], teamInfo[1], teamInfo[2]);
            this.teams.push(team);
        }
    }

    /**
     * Parses all the matches and stores all required information about each team
     * and its result. Then performs calculation to determine position of each team
     * in a table.
     */
    buildTable(): void {

        if (this.initError) return;
        let error: boolean = false;
        try {
            let draw = this.wkb.getRangeByName(DRAW).getValues();
            this.matches = [];
            for (let index = 0; index < draw.length; index++) {
                this.matches.push(new Match(draw[index]));
            }
        } catch (ex) {
            Logger.log('CHYBA: Nelze parsovat rozpis zapasu!');
            error = true;
        }
        if (error) return;

        // collect info for each team
        this.collectTeamsInfo();

        // get team for each group
        this.groups.forEach(group => {
            var teamsForGroup = this.teams.filter(t => t.group == group);
            this.calculateTeamsPosition(teamsForGroup);

            // build the array that will be inserted to the sheet
            let table = this.buildTableArray(group, teamsForGroup);

            let tableTopCell = this.wkb.getRangeByName(TABLE_PREFIX + group);
            let tblLastColIndex = tableTopCell.getLastColumn();
            let tblSheet = tableTopCell.getSheet();
            tblSheet.getRange(tableTopCell.getRow(), tableTopCell.getColumn(), table.length, table[0].length).setValues(table);
            tblSheet.hideColumns(tblLastColIndex + 2, 3);
        });
    }

    /**
     * THIS IS VERY IMPORTANT - make sure you know what you do
     * Calculates the position of each team in a table.
     * First sort it according to points for each team
     * @param teamsForGroup result of all teams of one group
     */
    private calculateTeamsPosition(teamsForGroup: Team[]) {
        //TODO: finish the full calculation for all table cases
        /*e.g. mini table of matches between teams with same points
               if there are more than two teams with the same amount of points
               build a mini-table of those teams and compare their points then
               difference between sets then number of won sets in their face to face matches
               if the above cannot decide then compare difference between wins and loses in WHOLE group
               then number of wins in WHOLE group then sets difference in WHOLE group then number
               of winning sets in WHOLE group then who was registered earlier
        */
        teamsForGroup.sort((a, b) => b.setsDifference - a.setsDifference);
        teamsForGroup.sort((a, b) => b.points - a.points);
    }

    private buildTableArray(group: string, teamsForGroup: Team[]): string[] {

        // build the array that will be inserted to the sheet
        let tableTopCell: any;
        let error: boolean = false;
        try {
            tableTopCell = this.wkb.getRangeByName(TABLE_PREFIX + group);
        } catch (error) {
            Logger.log('CHYBA: Tabulka skupiny ' + group + ' neexistuje!');
            error = true;
        }
        if (error) return;

        let tblFirstRowIndex = tableTopCell.getRow();
        let tblLastColIndex = tableTopCell.getLastColumn();
        let tblRows = [];;
        let i: number = 0;
        let tablePosition: number = 1;
        teamsForGroup.forEach(team => {
            let tblCols: any = [];
            tblCols.push(tablePosition);
            tblCols.push(team.name);
            tblCols.push(team.matches);
            tblCols.push(team.points);
            tblCols.push(team.wins);
            tblCols.push(team.loses);
            tblCols.push(team.wonSets);
            tblCols.push(team.lostSets);
            tblCols.push(team.setsDifference);
            tblCols.push(team.withdrawals);
            this.ensureTeamFormData(team);
            tblCols.push(this.createSparklineFormula(tblFirstRowIndex + i, tblLastColIndex + 2));
            tblCols.push(team.form[team.form.length - 3]);
            tblCols.push(team.form[team.form.length - 2]);
            tblCols.push(team.form[team.form.length - 1]);
            tblRows.push(tblCols);
            tablePosition++; i++;
        });
        return tblRows;
    }

    /**
     * Iterates through teams and for each of them collect their matches
     * and then calls method for collecting team results.
     */
    private collectTeamsInfo(): void {

        this.teams.forEach(team => {
            Logger.log('Prochazim vysledku tymu:' + team.name);
            let teamMatches = this.matches.filter(t => t.homeTeam == team.name || t.awayTeam == team.name);
            if (teamMatches.length <= 0) return;
            this.collectTeamMatchesInfo(team, teamMatches);
        });
    }

    /**
     * Iterates through each match of the team and collects information and calculate points for the team.
     * Handles withdrawals, wins, loses
     * @param team the team to get results for
     * @param teamMatches all matches of the given team
     */
    private collectTeamMatchesInfo(team: Team, teamMatches: Match[]): void {

        teamMatches.forEach(match => {
            if (!match.isFinished()) return;

            let isHomeTeam = match.isHomeTeam(team.name);
            let hasTeamLost = isHomeTeam !== match.hasHomeWon(); // XOR in Javascript
            Logger.log('Zapas: ' + match.homeTeam + "-" + match.awayTeam + ' ' + match.homeTeamScore + ':' + match.awayTeamScore);

            if (!match.isWithdrawal()) {
                team.matches += 1;
                team.setTeamForm(hasTeamLost ? -1 : 1);
                team.wins += hasTeamLost ? 0 : 1;
                team.loses += hasTeamLost ? 1 : 0;
                team.wonSets += isHomeTeam ? match.homeTeamScore : match.awayTeamScore;
                team.lostSets += isHomeTeam ? match.awayTeamScore : match.homeTeamScore;
                team.points += this.calculatePoints(false, !hasTeamLost, Math.abs(match.homeTeamScore - match.awayTeamScore));
            }
            else {
                // withdrawal
                team.matches += 1;
                let thisTeamWithdrawn: boolean;
                if (match.hasBothTeamsWithdrawal()) {
                    thisTeamWithdrawn = true;
                }
                else {
                    thisTeamWithdrawn = !(isHomeTeam !== match.hasHomeWithdrawal());
                }
                team.withdrawals += thisTeamWithdrawn ? 1 : 0;
                team.setTeamForm(thisTeamWithdrawn ? -1 : 1);
                team.wins += thisTeamWithdrawn ? 0 : 1;
                team.loses += thisTeamWithdrawn ? 1 : 0;
                team.wonSets += thisTeamWithdrawn ? 0 : 3;
                team.lostSets += thisTeamWithdrawn ? 3 : 0;
                team.points += this.calculatePoints(thisTeamWithdrawn, !thisTeamWithdrawn, Math.abs(match.homeTeamScore - match.awayTeamScore));
            }
            Logger.log('Z:' + team.matches + ',Body:' + team.points + ",V:" + team.wins + ',P:' + team.loses + ',SV:' + team.wonSets + ',SP:' + team.lostSets + ',S:' + team.withdrawals);
        });
    }

    /**
     * Returns number of points based on the state of the match (won/loss) and the
     * difference between sets. It the team for which it calculates the point has
     * withdrawn from the match the result is always same.
     * TODO: Read the allocated points for each difference from setting sheet.
     * @param isWithdrawal true if the team withdrawn from the match
     * @param teamWon true if the team won the match
     * @param scoreDifference a absolute difference between sets
     */
    private calculatePoints(isWithdrawal: boolean, teamWon: boolean, scoreDifference: number): number {
        if (isWithdrawal) return -6;
        if (teamWon) {
            switch (scoreDifference) {
                case 3:
                    return 7;
                case 2:
                    return 6;
                case 1:
                    return 5;
            }
        }
        else {
            switch (scoreDifference) {
                case 3:
                    return 0;
                case 2:
                    return 1;
                case 1:
                    return 2;
            }
        }
        return 0;
    }

    /**
     * Ensures that the given team has at least three last matches stored.
     * If not a '0' (zero) will be added to the array so the internal logic will work.
     * @param team the team for which to ensure data in the form array
     */
    private ensureTeamFormData(team: Team): void {
        // if there are not three matches yet, fill it with zeros
        let numOfFormRecords = team.form.length;
        if (numOfFormRecords < 3) {
            let steps = 3 - numOfFormRecords;
            for (let index = 0; index < steps; index++) {
                team.setTeamForm(0);
            }
        }
    }

    /**
     * Returns a string that represents 'SPARKLINE' formula in Google Spreadsheet
     * with the 'winloss' chart. Assumes the data are stored in three columns at the same row.
     * @param rowIndex the index of row where the formula will be placed
     * @param firstSparklineColIndex the first column where the sparkline data starts.
     *                               It assumes that just three values will be part of the formula.
     *                               If formula will be inserted to A1, the value of this parameter must be >1
     */
    private createSparklineFormula(rowIndex: number, firstSparklineColIndex: number): string {
        let formula = "=SPARKLINE([address]; {\"charttype\"\\\"winloss\"; \"negcolor\"\\\"red\"; \"color\"\\\"green\"})";
        let lastColIndex = firstSparklineColIndex + 2;
        let address = "R" + rowIndex + "C" + firstSparklineColIndex + ":R" + rowIndex + "C" + lastColIndex;
        formula = formula.replace("[address]", address);
        return formula;
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