
let doNotRunEvent = false;

/**
 * A defined name that stores information about all teams and their groups.
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
 * A string literal that represents a withdrawal of a match.
 */
const WITHDRAWAL_STRING: string = "S";

/**
 * A column index of the score of a HOME team on the draw sheet
 */
const HOME_SCORE_COL = 9;

/**
 * A column index of the score of a AWAY team on the draw sheet
 */
const AWAY_SCORE_COL = 11;


const MSG_NO_MATCH = "Nejdříve vyberte zápas!"
const MSG_NO_MATCH_INFO = "Nejdříve zadejte čas a místo konání zápasu!";
const MSG_NO_TEAMS = "Oba týmy musí být zadány!";

const SHEET_DRAW: string = "Rozlosování";
const SHEET_TABLE: string = "Tabulka";
const SHEET_SETTINGS: string = "Nastavení";