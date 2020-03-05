import PlayField from './playField';
import Ships from './ships';

export default class Player {
    constructor(cols, rows, maxShipLength, autoLockShips) {
        this._cols = cols;
        this._rows = rows;
        this._maxShipLength = maxShipLength;

        this._player = this._createPlayer(autoLockShips);
    }

    getState() {
        return {player: this._player}
    }

    _createPlayer(autoLockShips) {
        const player = {};

        const playField = new PlayField(this._cols, this._rows);
        player.playField = playField.getState().playField;

        const ships = new Ships(player.playField, this._maxShipLength);
        player.ships = ships.getState().ships;

        player.hitShip = [];
        player.countKilledShips = 0;

        this._lockShips(player.playField, player.ships);

        return player;
    }

    _lockShips(playField, ships) {
        ships.forEach(ship => {
            ship.forEach( ( {x, y} ) => {
                playField[y][x] = ship.length;
            });
        });
    }
}