import { GameStatus, MoveDirections, GameViewer } from "./types";
import { SquareGroup } from "./SquareGroup";
import { createTetris } from "./Tetris";
import { TetrisRules } from "./TetrisRules";
import GameConfig from "./GameConfig";
import { Square } from "./Square";

/**
 * 游戏类
 */
export class Game {
    private _gameStatus: GameStatus = GameStatus.init;
    private _curTetris?: SquareGroup;
    private _nextTetris: SquareGroup;
    // 计时器
    private _timer?: number;
    private _duration: number;
    // 当前游戏中已经存在的方块
    private _exists: Square[] = [];
    private _score: number = 0;
    public get score() {
        return this._score;
    }
    public set score(val) {
        this._score = val;
        this._viewer.showScore(val);
        const level = GameConfig.levels.filter(it => it.score <= val).pop()!;
        if (level.duration === this._duration) {
            return;
        }
        this._duration = level.duration;
        if (this._timer) {
            window.clearInterval(this._timer);
            this._timer = undefined;
            this.autoDown();
        }
    }

    public get gameStatus() {
        return this._gameStatus;
    }

    constructor(private _viewer: GameViewer) {
        this._duration = GameConfig.levels[0].duration;
        this._nextTetris = createTetris({ x: 0, y: 0 }); //为了让不报错，没有实际含义
        this.createNext();
        this._viewer.init(this); //完成界面初始化
        this._viewer.showScore(this.score);
    }

    private createNext() {
        this._nextTetris = createTetris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTetris);
        this._viewer.showNext(this._nextTetris);
    }

    private init() {
        this._exists.forEach(sq => {
            if (sq.viewer) {
                sq.viewer.hide();
            }
        })
        this._exists = [];
        this.createNext();
        this._curTetris = undefined;
        this.score = 0;
    }

    /**
     * 游戏开始
     */
    start() {
        // 改变游戏状态
        if (this._gameStatus === GameStatus.playing) {
            return;
        }
        // 重新开始
        if (this._gameStatus === GameStatus.over) {
            this.init();
        }
        this._gameStatus = GameStatus.playing;

        if (!this._curTetris) {
            // 如果没有当前方块，赋值
            this.changeTetris();
        }
        this.autoDown();
        this._viewer.onGameStart();
    }

    pause() {
        if (this._gameStatus === GameStatus.playing) {
            this._gameStatus = GameStatus.pause;
            window.clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGamePause();
        }
    }

    operateLeft() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRules.move(this._curTetris, MoveDirections.left, this._exists);
        }
    }
    operateRight() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRules.move(this._curTetris, MoveDirections.right, this._exists);
        }
    }
    operateDown() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRules.moveDirectly(this._curTetris, MoveDirections.down, this._exists);
            // 触底
            this.hitBottom();
        }
    }
    operateRotate() {
        if (this._curTetris && this._gameStatus === GameStatus.playing) {
            TetrisRules.rotatable(this._curTetris, this._exists);
        }
    }


    /**
     * 切换方块
     */
    private changeTetris() {
        this._curTetris = this._nextTetris;
        this._curTetris.squares.forEach(sq => {
            if (sq.viewer) {
                sq.viewer.hide();
            }
        })
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTetris);
        // 判断是否结束
        if (!TetrisRules.movable(this._curTetris.shape, this._curTetris.centerPoint, this._exists)) {
            this._gameStatus = GameStatus.over;
            window.clearInterval(this._timer);
            this._timer = undefined;
            this._viewer.onGameOver();
            return;
        }
        this.createNext();
        this._viewer.switch(this._curTetris);
    }

    /**
     * 方块自由下落
     */
    private autoDown() {
        if (this._timer || this._gameStatus !== GameStatus.playing) {
            return;
        }
        this._timer = window.setInterval(() => {
            if (this._curTetris) {
                if (!TetrisRules.move(this._curTetris, MoveDirections.down, this._exists)) {
                    // 触底
                    this.hitBottom();
                }
            }
        }, this._duration);
    }

    /**
     * 设置中心点坐标，让方块出现在区域的中上方
     * @param width 
     * @param tetris 
     */
    private resetCenterPoint(width: number, tetris: SquareGroup) {
        const x = Math.ceil(width / 2) - 1;
        const y = 0;
        tetris.centerPoint = { x, y };
        while (tetris.squares.some(it => it.coordinate.y < 0)) {
            tetris.centerPoint = {
                x: tetris.centerPoint.x,
                y: tetris.centerPoint.y + 1
            }
        }
    }

    /**
     * 触底
     */
    private hitBottom() {
        // 将当前的方块包含的小方块加入到已存在的数组中
        this._exists.push(...this._curTetris!.squares);
        // 触底移除
        const num = TetrisRules.deleteSquares(this._exists);
        this.addScore(num);
        this.changeTetris();
    }

    private addScore(lineNum: number) {
        if (lineNum === 0) {
            return;
        } else if (lineNum === 1) {
            this.score += 10;
        } else if (lineNum === 2) {
            this.score += 25;
        } else if (lineNum === 3) {
            this.score += 50;
        } else {
            this.score += 100;
        }
    }
}