
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  let menu = ui.createMenu("PB Liga");
  menu.addItem("Zobraz všechny zápasy", "showAllMatches");
  menu.addItem("Filtruj zápasy", "filterMatches");
  menu.addSeparator();
  menu.addItem("Zadej místo a datum zápasu", "showMatchInfoForm");
  menu.addItem("Zadej výsledek", "showMatchInfoForm");
  menu.addToUi();
}

function showAllMatches() {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = wkb.getSheetByName("Rozlosování");
  sheet.activate();
  let drawRange = wkb.getRangeByName(DRAW);
  sheet.showRows(drawRange.getRow(), drawRange.getLastRow() - drawRange.getRow() + 1);
}

function filterMatches() {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = wkb.getSheetByName("Rozlosování");
  sheet.activate();
  let tmp = new TableBuilder(wkb);
  const teams = [];
  tmp.allTeams.forEach(team => {
    teams.push(team.name);
  });
  let template = HtmlService.createTemplateFromFile("uiSelectTeam");
  template.teams = teams;
  let html = template.evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "Vyberte tým");
}

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

  let sheet = wkb.getSheetByName("Rozlosování");
  let drawRange = wkb.getRangeByName(DRAW);
  sheet.hideRows(drawRange.getRow(), drawRange.getLastRow() - drawRange.getRow() + 1);
  matchAddresses.forEach(address => {
    const rng = sheet.getRange(address);
    sheet.unhideRow(rng);
  });
}

function showMatchInfoForm() {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = wkb.getSheetByName("Rozlosování");
  if (wkb.getActiveSheet().getName() != sheet.getName()) {
    SpreadsheetApp.getUi().prompt("Nejdříve vyberte zápas!");
    return;
  }

  let cellRow = sheet.getCurrentCell().getRowIndex();
  let match = new Matches(wkb).getMatchByAddress(cellRow);
  if (!match) {
    SpreadsheetApp.getUi().prompt("Nejdříve vyberte zápas!");
    return;
  }

  let template = HtmlService.createTemplateFromFile('uiMatchInfo');
  template.matchTeams = match.homeTeam + ' - ' + match.awayTeam;
  // don't understand why +2:00
  if (match.matchDate) {
    template.matchDate = Utilities.formatDate(match.matchDate, "GMT+2:00", "d MMM yyy");
  }
  else {
    template.matchDate = "";
  }
  if (match.matchTime) {
    template.matchTime = Utilities.formatDate(match.matchTime, "GMT+1:00", "H:mm");
  }
  else {
    template.matchTime = null;
  }
  template.matchPlace = match.place;
  template.matchPlace = match.place;
  let html = template.evaluate().setHeight(550);
  SpreadsheetApp.getUi().showModalDialog(html, "Zadej info o zápase")
}



function appendData(data) {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = wkb.getSheetByName("Tabulka");
  let range = sheet.getRange(25, 1);
  range.setValue(data[0]);
  range.offset(1, 0).setValue(data[1]);
  range.offset(2, 0).setValue(data[2]);
}

function test() {
  var builder = new TableBuilder(SpreadsheetApp.getActiveSpreadsheet());
  builder.buildTable();
}