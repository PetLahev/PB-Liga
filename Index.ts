
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