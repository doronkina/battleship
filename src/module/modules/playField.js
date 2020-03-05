export default class PlayField {
    constructor(cols, rows) {
        this._cols = cols;
        this._rows = rows;
        
        this._playField = this._createPlayField();
    }

    getState() {
        return {playField: this._playField}
    }
    
    _createPlayField() {
        const playField = [];

        for (let y = 0; y < this._rows; y++) {
            playField[y] = [];
            
            for (let x = 0; x < this._cols; x++) {
                playField[y][x] = 0;
            }            
        }

        return playField;
    }
}