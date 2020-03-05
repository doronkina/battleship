export default class Ships {
    constructor(playField, maxShipLength) {
        this._maxShipLength = maxShipLength;
        this._playField = playField;

        this._ships = this._createShips();
    }

    getState() {
        return {ships: this._ships}
    }

    _createShips() {
        const ships = [];

        for (let i = 0; i < this._maxShipLength; i++) {
            for (let j = 0; j < i + 1; j++) {
                const ship = {};

                do {
                    ship.length = this._maxShipLength - i;
                    ship.x = Math.floor( Math.random() * this._playField[0].length );
                    ship.y = Math.floor( Math.random() * this._playField.length );
                    if (ship.length > 1) ship.direction = Math.round( Math.random() ) ? 'right' : 'down';
                    ship.body = this._createShipBody(ship);
                } while ( this._isVerificationFailed(ships, ship) )

                ships.push(ship.body);
            }
        }

        return ships;
    }

    _createShipBody( {length, x, y, direction = 'right'} ) {
        const shipBody = [];

        shipBody.push( {x, y, hit: false} );
        switch (direction) {
            case 'right':
                for (let i = 1; i < length; i++) {
                    shipBody.push( {x: x + i, y, hit: false} ); 
                }
                break;
            case 'down':
                for (let i = 1; i < length; i++) {
                    shipBody.push( {x, y: y + i, hit: false} ); 
                }
                break;
        }

        return shipBody;
    }

    _createShipMatrix( {length, x, y, direction = 'right'} ) {
        const shipMatrix = [];
        --x;
        --y;
        length += 2;
        const width = 3;

        switch (direction) {
            case 'right':
                for (let i = y; i < y + width; i++) {
                    for (let j = x; j < x + length; j++) {
                        shipMatrix.push( {x: j, y: i} );
                    }
                }
                break;
            case 'down':
                for (let i = y; i < y + length; i++) {
                    for (let j = x; j < x + width; j++) {
                        shipMatrix.push( {x: j, y: i} );
                    }
                }
                break;
        }
       
        return shipMatrix;
    }

    _isVerificationFailed(ships, ship) {
        const outOfBounds = ( {x, y} ) => {
            return (
                this._playField[y] === undefined ||
                this._playField[y][x] === undefined
            )
        }

        const isIntersections = ( {x, y} ) => {
            let intersection = false;

            outside: for (let i = 0; i < ships.length; i++) {
                for (let j = 0; j < ships[i].length; j++) {
                    if (ships[i][j].x === x && ships[i][j].y === y) {
                        intersection = true;
                        break outside;
                    }
                }
            }

            return intersection;
        }
        
        return (
            ship.body.some(outOfBounds) || 
            this._createShipMatrix(ship).some(isIntersections)
        )
    }
}