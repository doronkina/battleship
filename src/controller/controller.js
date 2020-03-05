export default class Controller {
    constructor(module, view) {
        this._module = module;
        this._view = view;

        this._chooseShips = true;
        this._isPlaying = false;

        document.addEventListener('keydown', this._handleKeyDown.bind(this));

        this._updateView();
        this._shooting();
    }

    _startGame() {
        this._chooseShips = false;
        this._isPlaying = true;
        this._updateView();
    }

    _isGameOver() {
        if (this._module.getState().isGameOver) {
            this._isPlaying = false;
            this._updateView();
        }
    }

    _reset() {
        this._chooseShips = true;
        this._module.reset();
        this._updateView();
    }

    _updateView() {
        const state = this._module.getState();

        if (state.isGameOver) {
            this._view.renderEndScreen();
        } else if (this._chooseShips) {
            this._view.renderStartScreen(state.firstPlayer);
        } else {
            this._view.renderGame(state);
        }
    }

    _handleKeyDown() {
        switch (event.keyCode) {
            case 32:
                if (this._chooseShips) {
                    this._module.resetFirstPlayer();
                    this._updateView();
                }
                break;
            case 13:
                if (this._chooseShips) {
                    this._startGame();
                } else if ( this._module.getState().isGameOver ) {
                    this._reset();
                }
                break;
            default:
                break;
        }
    }

    // Shooting

    _shooting() {
        this._view.canvas.onclick = (e) => {
            const x = Math.floor( ( e.offsetX - this._view.getState().secondPlayerStartX ) / this._view.getState().cellWidth );
            const y = Math.floor( ( e.offsetY - this._view.getState().playerStartY ) / this._view.getState().cellHeight );

            if (this._isPlaying && 
                this._module.getState().secondPlayer.playField[y] !== undefined
            ) {
                this._firstPlayerShot(x, y);
                
                if (!this._module.getState().isGameOver && !this._isPlaying) this._secondPlayerShot();
            }
        }
    }

    _firstPlayerShot(x, y) {
        const shot = this._module.firstPlayerShot(x, y);
            
        if (shot) {
            shot.forEach( ( {x, y, i} ) => this._view.renderFirstPlayerShot(x, y, i) );

            shot[0].i !== -10 ? this._isGameOver() : this._isPlaying = false;
        }
    }

    _secondPlayerShot() {
        let shot;

        do {
            shot = this._module.secondPlayerShot();
            shot.forEach( ( {x, y, i} ) => this._view.renderSecondPlayerShot(x, y, i) );

            if (shot[0].i !== -10) this._isGameOver();
        } while (!this._module.getState().isGameOver && shot[0].i !== -10);
                      
        this._isPlaying = true;
    }
}