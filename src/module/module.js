import Player from './modules/player';
import Shooting from './modules/shooting';

export default class Module {
    constructor(cols, rows, maxShipLength) {
        this._cols = cols;
        this._rows = rows;
        this._maxShipLength = maxShipLength;

        this.reset();
    }
    
    getState() {
        return {
            firstPlayer: this._firstPlayer,
            secondPlayer: this._secondPlayer,
            isGameOver: this._isGameOver
        }
    }

    reset() {
        this.resetFirstPlayer();
        this.resetSecondPlayer();

        this._isGameOver = false;
    }

    resetFirstPlayer() {
        const firstPlayer = new Player(this._cols, this._rows, this._maxShipLength);
        this._firstPlayer = firstPlayer.getState().player;
    }

    resetSecondPlayer() {
        const secondPlayer = new Player(this._cols, this._rows, this._maxShipLength);
        this._secondPlayer = secondPlayer.getState().player;
    }

    firstPlayerShot(x, y) {
        const shooting = new Shooting(this._cols, this._rows, this._secondPlayer);
        const shot = shooting.firstPlayerShot(x, y);

        this._gameOver(this._secondPlayer);

        return shot;
    }

    secondPlayerShot() {
        const shooting = new Shooting(this._cols, this._rows, this._firstPlayer);
        const shot = shooting.secondPlayerShot();
        
        this._gameOver(this._firstPlayer);

        return shot
    }
    
    _gameOver(player) {
        if (player.countKilledShips === player.ships.length) {
            this._isGameOver = true;
        }
    }
}