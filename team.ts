/**
 * Stores information about a single team
 */
class Team {

    id: string;
    name: string;
    group: string;

    private _matches: number = 0;
    private _points: number = 0;
    private _wins: number = 0;
    private _loses: number = 0;
    private _wonSets: number = 0;
    private _lostSets: number = 0;
    private _withdrawals: number = 0;
    private _form: number[] = [];

    constructor(theId: string, theName: string, theGroup: string) {
        this.id = theId;
        this.name = theName;
        this.group = theGroup;
    }

    get matches(): number {
        return this._matches;
    }
    set matches(val: number) {
        this._matches = val;
    }

    get points(): number {
        return this._points;
    }
    set points(val: number) {
        this._points = val;
    }

    get wins(): number {
        return this._wins;
    }
    set wins(val: number) {
        this._wins = val;
    }

    get loses(): number {
        return this._loses;
    }
    set loses(val: number) {
        this._loses = val;
    }

    get wonSets(): number {
        return this._wonSets;
    }
    set wonSets(val: number) {
        this._wonSets = val;
    }

    get lostSets(): number {
        return this._lostSets;
    }
    set lostSets(val: number) {
        this._lostSets = val;
    }

    get withdrawals(): number {
        return this._withdrawals;
    }
    set withdrawals(val: number) {
        this._withdrawals = val;
    }

    get form(): number[] {
        return this._form;
    }
    setTeamForm(val: number) {
        this._form.push(val);
    }

    get setsDifference(): number {
        return this.wonSets - this.lostSets;
    }

    isInGroup(group: string): boolean {
        return this.group.toLowerCase().trim() === group.toLowerCase().trim();
    }
}