
function showMatchScoreForm() {
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

    let template = HtmlService.createTemplateFromFile('uiMatchResult');
    template.homeTeam = match.homeTeam;
    template.awayTeam = match.awayTeam;
    template.score = ["S", 0,1,2,3];

    let html = template.evaluate();
    SpreadsheetApp.getUi().showModalDialog(html, "Zadej výsledek zápasu")
}

function validateScore(data) {
    let wkb = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = wkb.getSheetByName(SHEET_DRAW);
    let rIndex = sheet.getCurrentCell().getRowIndex();

    Logger.log(data[0] + ":" + data[1]);
    sheet.getRange(rIndex, 9).setValue(data[0]);
    sheet.getRange(rIndex, 11).setValue(data[1]);
  }