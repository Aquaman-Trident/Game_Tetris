import { SquareGroup } from "./SquareGroup";
import { Game } from "./Game";

/**
 * 小方块坐标接口
 */
export interface ICoordinate{
    readonly x : number,
    readonly y : number
}

/**
 * 显示小方块接口
 */
export interface IViewer{
    //显示
    show():void;

    //去除
    hide():void;
}

/**
 * 方块组合形状
 */
export type Shape = ICoordinate[];

/**
 * 移动方向
 */
export enum MoveDirections {
    left,
    right,
    down
}

/**
 * 游戏状态
 */
export enum GameStatus{
    init,
    playing,
    pause,
    over
}

/**
 * 显示游戏界面接口
 */
export interface GameViewer{
    //下一个方块组合
    showNext(tetris:SquareGroup):void;

    //切换方块组合
    switch(tetris:SquareGroup):void;

    //完成界面初始化
    init(game:Game):void;

    // 显示分数
    showScore(score:number):void;

    // 显示游戏状态
    onGamePause():void;
    onGameStart():void;
    onGameOver():void;
}