/**
 * Stores information about a single team
 */
class Team {
    name: string;
    group: string;
    private _matches: number = 0;
    private _points: number = 0;
    private _wins: number = 0;
    private _loses: number = 0;
    private _wonSets: number = 0;
    private _lostSets: number = 0;

    constructor(theName: string, theGroup: string) {
        this.name = theName;
        this.group = theGroup.toLowerCase().trim();
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

    get setDifference(): number {
        return this.wonSets - this.lostSets;
    }

    isInGroup(group: string): boolean {
        return this.group === group.toLowerCase().trim();
    }
}