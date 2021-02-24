
function showMatchScoreForm() {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = wkb.getSheetByName(SHEET_DRAW);
    if (wkb.getActiveSheet().getName() != sheet.getName()) {
        SpreadsheetApp.getUi().alert(MSG_NO_MATCH);
        return;
    }

    let cellRow = sheet.getCurrentCell().getRowIndex();
    let match = new Matches(wkb).getMatchByAddress(cellRow);
    if (!match) {
        SpreadsheetApp.getUi().alert(MSG_NO_MATCH);
        return;
    }
    else if (match.homeTeam.length == 0 || match.awayTeam.length == 0 ) {
        SpreadsheetApp.getUi().alert(MSG_NO_TEAMS);
        return;
    }

    if (match.matchDate.toString() == ''||  match.matchTime.toString() == '' || match.place == '') {
        SpreadsheetApp.getUi().alert(MSG_NO_MATCH_INFO);
        showMatchInfoForm();
        return;
    }

    let template = HtmlService.createTemplateFromFile('uiMatchResult');
    let formattedInfo = Utilities.formatDate(match.matchDate, match.dateZoneString, "d MMM yyyy") + ' ' +
                        Utilities.formatDate(match.matchTime, match.timeZoneString, "H:mm") + ' ' + match.place;
    template.matchInfo = formattedInfo;
    template.homeTeam = match.homeTeam;
    template.awayTeam = match.awayTeam;
    template.score = ["S", 0, 1, 2, 3];

    let html = template.evaluate().setHeight(450);;
    SpreadsheetApp.getUi().showModalDialog(html, "Zadej výsledek zápasu")
}

function validateScore(data) {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = wkb.getSheetByName(SHEET_DRAW);
    let rIndex = sheet.getCurrentCell().getRowIndex();

    Logger.log(data[0] + ":" + data[1]);
    sheet.getRange(rIndex, HOME_SCORE_COL).setValue(data[0]);
    sheet.getRange(rIndex, AWAY_SCORE_COL).setValue(data[1]);

    try {
        doNotRunEvent = true;
        new TableBuilder(wkb).buildTable();
    } catch (error) {
        doNotRunEvent = false;
    }
}