
function onOpen() {
  createMenu();
}

function createMenu() {
  let ui = SpreadsheetApp.getUi();
  let menu = ui.createMenu("PB Liga");
  menu.addItem("Zobraz všechny zápasy", "showAllMatches");
  menu.addItem("Filtruj zápasy", "filterMatches");
  menu.addSeparator();
  menu.addItem("Zadej místo a datum zápasu", "showMatchInfoForm");
  menu.addItem("Zadej výsledek", "showMatchScoreForm");
  menu.addToUi();
}

function onEdit(e) {

  if (doNotRunEvent) {
    Logger.log("Event not run due to setting");
  }

  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() != SHEET_DRAW) return;

  let rng = e.range;
  let editedRow = rng.getRowIndex();
  let editedCol = rng.getColumn();
  let drawRange = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(DRAW);
  let drawFirstRow = drawRange.getRowIndex();
  let drawLastRow = drawRange.getLastRow();

  if (editedRow < drawFirstRow || editedRow > drawLastRow ||
    (editedCol != HOME_SCORE_COL && editedCol != AWAY_SCORE_COL)) {
    return; // out of range
  }

  let homeScore = sheet.getRange(editedRow, HOME_SCORE_COL).getValue();
  let awayScore = sheet.getRange(editedRow, AWAY_SCORE_COL).getValue();

  if (homeScore = '' || awayScore == '' ) return;

  new TableBuilder(wkb).buildTable();
}