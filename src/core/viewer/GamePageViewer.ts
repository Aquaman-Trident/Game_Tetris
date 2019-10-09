import { GameViewer, GameStatus } from "../types";
import { SquareGroup } from "../SquareGroup";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery";
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
    onGamePause(): void {
        this._msgDom.css({
            display: "flex"
        });
        this._msgDom.find('p').html('游戏暂停');
    }
    onGameStart(): void {
        this._msgDom.hide();
    }
    onGameOver(): void {
        this._msgDom.css({
            display: "flex"
        });
        this._msgDom.find('p').html('游戏结束');
    }
    showScore(score: number): void {
        this._scoreDom.html(score.toString());
    }
    private _nextDom = $("#next");
    private _panelDom = $('#panel');
    private _scoreDom = $('#score');
    private _msgDom = $('#msg');
    init(game: Game): void {
        // 1. 设置区域宽高
        this._panelDom.css({
            width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
            height: GameConfig.panelSize.height * PageConfig.SquareSize.height
        });

        this._nextDom.css({
            width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
            height: GameConfig.nextSize.height * PageConfig.SquareSize.height
        });

        // 2. 注册键盘事件
        $(document).keydown(e => {
            if (e.keyCode === 37) {
                game.operateLeft();
            } else if (e.keyCode === 38) {
                game.operateRotate();
            } else if (e.keyCode === 39) {
                game.operateRight();
            } else if (e.keyCode === 40) {
                game.operateDown();
            } else if (e.keyCode === 32) {
                if (game.gameStatus === GameStatus.playing) {
                    game.pause();
                } else {
                    game.start();
                }
            }
        })

    }
    showNext(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, this._nextDom);
        })
    }
    switch(tetris: SquareGroup): void {
        tetris.squares.forEach(sq => {
            sq.viewer!.hide();
            sq.viewer = new SquarePageViewer(sq, this._panelDom);
        })
    }


}