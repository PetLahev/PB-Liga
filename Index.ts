function showForm() {
  let template =  HtmlService.createTemplateFromFile('uiform');
  let html = template.evaluate();
  html.setTitle("PB Liga");
  SpreadsheetApp.getUi().showSidebar(html);
}

function appendData(data) {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = wkb.getSheetByName("Tabulka");
  let range = sheet.getRange(25,1);
  range.setValue(data[0]);
  range.offset(1,0).setValue(data[1]);
  range.offset(2,0).setValue(data[2]);
}

function testMatch() {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let matches = wkb.getRangeByName('Zapasy').getValues();
  let m: Match[] = [];
  for (let index = 0; index < matches.length; index++) {
    const element = matches[index];
    let cosik = new Match(element);
    m.push(cosik);
  }
  let builder = new TableBuilder(wkb);
  builder.buildTable();
  Logger.log('Both Teams withdrawal? ' + m[0].hasBothTeamsWithdrawal());
  Logger.log('Is Withdrawal? ' + m[0].isWithdrawal());
  Logger.log('Has home team withdrawal? ' + m[0].hasHomeWithdrawal());
  Logger.log('Finished? ' + m[0].score);
  Logger.log('Finished? ' + m[0].isFinished());
  Logger.log('Home team won? ' + m[0].hasHomeWon());
}

function testFunction() {
  let wkb = SpreadsheetApp.getActiveSpreadsheet();
  let teams = wkb.getRangeByName('Tymy');
  let sheet = teams.getSheet();
  let numOfTeams: number = 100;
  let data:any[][] = sheet.getRange(teams.getRow(),teams.getColumn(), numOfTeams).getValues();
  if (data[numOfTeams - 1].toString() != "") {
    Logger.log('Mame vic jak 100 tymu');
    numOfTeams = 200;
  }
  for(var i = 0; i< numOfTeams; i++) {
    if (data[i].toString() == "") {
      Logger.log('Mame ' + i + ' tymu.');
      break;
    }
  }

}

function test() {
  var builder = new TableBuilder(SpreadsheetApp.getActiveSpreadsheet());
}