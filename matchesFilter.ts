
/**
 * Displays all rows for the draw named range.
 */
function showAllMatches() {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = wkb.getSheetByName(SHEET_DRAW);
    sheet.activate();
    let drawRange = wkb.getRangeByName(DRAW);
    sheet.showRows(drawRange.getRow(), drawRange.getLastRow() - drawRange.getRow() + 1);
}

/**
 * Displays a form where user can select a team to filter its matches.
 */
function filterMatches() {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    wkb.getSheetByName(SHEET_DRAW).activate();

    let template = HtmlService.createTemplateFromFile("uiSelectTeam");
    template.teams = new Teams(wkb).teamNames;
    let html = template.evaluate();
    SpreadsheetApp.getUi().showModalDialog(html, "Vyberte tým");
}

/**
 * A callback from the form to filter rows.
 * @param data contains name of the selected team or the default text
 */
function validateSelectedTeam(data) {
    let selectedItem = data[0].toString();
    Logger.log(selectedItem);
    if (selectedItem == "Vyberte tým") {
        throw "Vyberte tým!";
    }
    else if (!selectedItem) {
        Logger.log('Cancel');
        return;
    }

    Logger.log('Filtruji tym');
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let matches = new Matches(wkb);
    let team = new Team("N/A", selectedItem, "N/A");
    let matchAddresses = matches.getTeamMatchesAddress(team);
    if (matchAddresses.length == 0) return;

    let sheet = wkb.getSheetByName(SHEET_DRAW);
    let drawRange = wkb.getRangeByName(DRAW);
    sheet.hideRows(drawRange.getRow(), drawRange.getLastRow() - drawRange.getRow() + 1);
    matchAddresses.forEach(address => {
        const rng = sheet.getRange(address);
        sheet.unhideRow(rng);
    });
}