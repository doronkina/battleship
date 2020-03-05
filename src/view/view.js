export default class View {
    constructor(element, borderWidth, panelParameter, playFieldWidth, playFieldHeight, cols, rows) {
        this._borderWidth = borderWidth;
        this._playFieldWidth = playFieldWidth;
        this._playFieldHeight = playFieldHeight;

        this._width = this._borderWidth + this._playFieldWidth * 2 + panelParameter;
        this._height = panelParameter + this._playFieldWidth + this._borderWidth / 2;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this._width;
        this.canvas.height = this._height;
        this.ctx = this.canvas.getContext('2d');

        element.appendChild(this.canvas);

        this._cellWidth = this._playFieldWidth / cols;
        this._cellHeight = this._playFieldHeight / rows;

        this._firstPlayerStartX = this._borderWidth / 2;
        this._secondPlayerStartX = this._borderWidth / 2 + this._playFieldWidth + panelParameter;
        this._playerStartY = panelParameter;
    }

    getState() {
        return {
            cellWidth: this._cellWidth,
            cellHeight: this._cellHeight,
            secondPlayerStartX: this._secondPlayerStartX,
            playerStartY: this._playerStartY
        }
    }

    renderEndScreen() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.9)';
        this.ctx.fillRect(0, 0, this._width, this._height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '22px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GAME OVER', this._width / 2, this._height / 2 - 20);
        this.ctx.fillText('Press ENTER to Restart', this._width / 2, this._height / 2 + 20);
    }

    renderStartScreen(player) {
        this._clearScreen();
        this._renderFirstPlayer(player);
        this._renderCell(
            this._secondPlayerStartX,
            this._playerStartY,
            this._playFieldWidth,
            this._playFieldHeight,
            'lightgray'
        );

        this.ctx.fillStyle = 'black';
        this.ctx.font = '18px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            'Press SPACE to Random',
            this._secondPlayerStartX + this._playFieldWidth / 2,
            this._playerStartY + this._playFieldHeight / 2 - 15
        );
        this.ctx.fillText(
            'Press ENTER to Start',
            this._secondPlayerStartX + this._playFieldWidth / 2,
            this._playerStartY + this._playFieldHeight / 2 + 15
        )
    }

    renderGame(state) {
        this._clearScreen();
        this._renderFirstPlayer(state.firstPlayer);
        this._renderSecondPlayer(state.secondPlayer);
    }

    _clearScreen() {
        this.ctx.clearRect(0, 0, this._width, this._height);
    }

    _renderFirstPlayer(player) {
        this._renderPlayField(player.playField, this._firstPlayerStartX);
        this._renderShips(player.ships, this._firstPlayerStartX);
    }

    _renderSecondPlayer(player) {
        this._renderPlayField(player.playField, this._secondPlayerStartX);
    }

    _renderPlayField(playField, startX) {
        for (let y = 0; y < playField.length; y++) {
            for (let x = 0; x < playField[y].length; x++) {
                this._renderCell(
                    startX + x * this._cellWidth,
                    this._playerStartY + y * this._cellHeight,
                    this._cellWidth,
                    this._cellHeight,
                    'lightgray'
                ); 
            }
        }
    }

    _renderShips(ships, startX) {
        ships.forEach(ship => {
            let width = this._cellWidth;
            let height = this._cellHeight;

            if (ship.length > 1 && ship[0].x === ship[1].x) {
                height *= ship.length
            } else {
                width *= ship.length
            }

            this._renderCell(
                startX + ship[0].x * this._cellWidth,
                this._playerStartY + ship[0].y * this._cellHeight,
                width,
                height,
                'black'
            );
        });
    }

    _renderCell(x, y, w, h, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this._borderWidth;
        this.ctx.strokeRect(x, y, w, h);
    }

    // Shooting

    renderFirstPlayerShot(x, y, i) {
        this._renderShot(
            this._secondPlayerStartX + x * this._cellWidth, 
            this._playerStartY + y * this._cellHeight, 
            i
        );
    }

    renderSecondPlayerShot(x, y, i) {
        this._renderShot(
            this._firstPlayerStartX + x * this._cellWidth, 
            this._playerStartY + y * this._cellHeight, 
            i
        );
    }

    _renderShot(x, y, i) {
        if (i === -10) { 
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(
                x + this._cellWidth / 3, 
                y + this._cellHeight / 3, 
                this._cellWidth / 3, 
                this._cellHeight / 3
            );
        } else {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineCap = 'round';

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + this._cellWidth, y + this._cellHeight);
            
            this.ctx.moveTo(x, y + this._cellHeight);
            this.ctx.lineTo(x + this._cellWidth, y);
            this.ctx.stroke();
        }       
    }
}