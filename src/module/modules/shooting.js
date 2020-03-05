export default class Shooting {
    constructor(cols, rows, player) {
        this._cols = cols;
        this._rows = rows;
        this._player = player;
    }

    firstPlayerShot(x, y) {
        if ( this._player.playField[y][x] >= 0 ) {
            return this._shot(x, y);
        }
    }

    secondPlayerShot() {
        let x, y;
        
        do {
            if (!this._player.hitShip[0]) {
                x = Math.floor( Math.random() * this._cols);
                y = Math.floor( Math.random() * this._rows);
            } else {
                ( {x, y} = this._hitEnemyShip() );
            }

            if (
                this._player.playField[y] !== undefined &&
                this._player.playField[y][x] !== undefined &&
                this._player.playField[y][x] > 0
            ) {
                this._player.hitShip.push( {x, y} );

                if (this._player.hitShip.length > 1) {
                    this._player.hitShip[0].y === this._player.hitShip[1].y ?
                    this._player.hitShip.sort( (a, b) => a.x - b.x ) :
                    this._player.hitShip.sort( (a, b) => a.y - b.y );
                }
            };
        } while (
            this._player.playField[y] === undefined ||
            this._player.playField[y][x] === undefined ||
            this._player.playField[y][x] < 0
        );

        return this._shot(x, y);
    }

    _hitEnemyShip() {
        const random = Math.round( Math.random() );

        let x = this._player.hitShip[0].x;
        let y = this._player.hitShip[0].y;

        if (this._player.hitShip.length === 1) {
            const addition = Math.round( Math.random() ) * 2 - 1;

            random ? x += addition : y += addition;
        } else {
            const i = this._player.hitShip.length - 1;

            if (this._player.hitShip[0].y === this._player.hitShip[1].y) {
                x = random ? this._player.hitShip[i].x + 1 : --x;
            } else {
                y = random ? this._player.hitShip[i].y + 1 : --y;
            }
        }

        return {x, y}
    }

    _shot(x, y) {
        const shot = [];

        if ( !this._player.playField[y][x] ) {
            this._player.playField[y][x] = -10;

            shot.push( { x, y, i: this._player.playField[y][x] } );
            return shot;
        }

        outside: for (let i = 0; i < this._player.ships.length; i++) {
            if ( this._player.ships[i].length === this._player.playField[y][x] ) {
                for (let j = 0; j < this._player.ships[i].length; j++) {
                    const item = this._player.ships[i][j];

                    if (item.x === x && item.y === y) {
                        item.hit = true;
                        this._player.playField[y][x] = -this._player.ships[i].length;

                        shot.push( {x, y, i: this._player.playField[y][x]} );
                        if ( this._player.ships[i].every(item => item.hit) ) {
                            ++this._player.countKilledShips;
                            this._player.hitShip.splice(0);

                            const freeZone = this._killedShip(this._player.ships[i], this._player.playField);
                            shot.push(...freeZone);
                        }

                        break outside;
                    }
                }
            }
        };

        return shot
    }

    _killedShip(ship, playField) {
        const freeZone = [];
        const x = ship[0].x - 1;
        const y = ship[0].y - 1;

        let maxX = x + ship.length + 2;
        let maxY = y + 3;
        if (ship.length > 1 && ship[0].x === ship[1].x) {
            maxX = x + 3;
            maxY = y + ship.length + 2;
        }

        for (let i = y; i < maxY; i++) {
            for (let j = x; j < maxX; j++) {
                if ( 
                    playField[i] !== undefined &&
                    playField[i][j] !== undefined && 
                    !playField[i][j] 
                ) {
                    playField[i][j] = -10;
                    freeZone.push( {x: j, y: i, i: playField[i][j]} );
                }
            }
        }
           
        return freeZone;
    }
}