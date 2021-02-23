
/**
 * Displays a form for specifying date and time and place of a match.
 */
function showMatchInfoForm() {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = wkb.getSheetByName(SHEET_DRAW);
    if (wkb.getActiveSheet().getName() != sheet.getName()) {
        SpreadsheetApp.getUi().alert("Nejdříve vyberte zápas!");
        return;
    }

    let cellRow = sheet.getCurrentCell().getRowIndex();
    let match = new Matches(wkb).getMatchByAddress(cellRow);
    if (!match) {
        SpreadsheetApp.getUi().alert("Nejdříve vyberte zápas!");
        return;
    }

    let template = HtmlService.createTemplateFromFile('uiMatchInfo');
    template.matchTeams = match.homeTeam + ' - ' + match.awayTeam;

    if (match.matchDate) {
        try {
            template.matchDate = Utilities.formatDate(match.matchDate, match.dateZoneString, "d MMM yyy");
        } catch (error) {
            template.matchDate = "";
        }
    }
    else {
        template.matchDate = "";
    }
    if (match.matchTime) {
        try {
            template.matchTime = Utilities.formatDate(match.matchTime, match.timeZoneString, "H:mm");
        } catch (error) {
            template.matchTime = null;
        }
    }
    else {
        template.matchTime = null;
    }
    template.matchPlace = match.place;
    let html = template.evaluate().setHeight(550);
    SpreadsheetApp.getUi().showModalDialog(html, "Zadej info o zápase")
}

function insertDateTimeAndPlace(data) {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = wkb.getSheetByName(SHEET_DRAW);
    let rIndex = sheet.getCurrentCell().getRowIndex();

    // works only for date in the same format as the spreadsheet (eg. EN to CZ doesn't work)
    sheet.getRange(rIndex, 3).setValue(data[0]).setNumberFormat("d MMM");
    sheet.getRange(rIndex, 4).setValue(data[1]);
    sheet.getRange(rIndex, 5).setValue(data[2]);
}