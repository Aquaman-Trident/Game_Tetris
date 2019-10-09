import { Shape, ICoordinate, MoveDirections } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
import { Square } from "./Square";

/**
 * 自定义类型保护函数
 */
function isPoint(obj: any): obj is ICoordinate {
    if (typeof obj.x === "undefined") {
        return false;
    }
    return true;
}

/**
 * 该类中提供一系列的函数，根据游戏规则判断各种情况
 */

export class TetrisRules {
    /**
     * 判断某个形状的方块是否能移动到目标位置
     */
    static movable(shape: Shape, target: ICoordinate, exists: Square[]): boolean {
        // 边界判断
        const targetPoints: ICoordinate[] = shape.map(it => {
            return {
                x: it.x + target.x,
                y: it.y + target.y
            }
        });
        let result = targetPoints.some(p => {
            // 是否超出边界
            return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1;
        })
        if (result) {
            return false;
        };

        // 判断是否与已有的方块有重叠
        let cover = targetPoints.some(p => exists.some(sq => sq.coordinate.x === p.x && sq.coordinate.y === p.y));
        if (cover) {
            return false;
        }
        return true;
    }

    /**
     * 移动函数 - 坐标和方向
     */
    static move(tetris: SquareGroup, target: ICoordinate, exists: Square[]): boolean
    static move(tetris: SquareGroup, direction: MoveDirections, exists: Square[]): boolean
    static move(tetris: SquareGroup, targetOrDirection: ICoordinate | MoveDirections, exists: Square[]): boolean {
        if (isPoint(targetOrDirection)) {
            // 如果是坐标
            if (TetrisRules.movable(tetris.shape, targetOrDirection, exists)) {
                tetris.centerPoint = targetOrDirection;
                return true;
            }
            return false;
        } else {
            // 如果是方向
            const direction = targetOrDirection;
            let target: ICoordinate;
            if (direction === MoveDirections.down) {
                target = {
                    x: tetris.centerPoint.x,
                    y: tetris.centerPoint.y + 1
                }
            } else if (direction === MoveDirections.right) {
                target = {
                    x: tetris.centerPoint.x + 1,
                    y: tetris.centerPoint.y
                }
            } else {
                target = {
                    x: tetris.centerPoint.x - 1,
                    y: tetris.centerPoint.y
                }
            }
            // 调用自己往指定方向移动
            return this.move(tetris, target, exists);
        }
    }

    static moveDirectly(tetris: SquareGroup, direction: MoveDirections, exists: Square[]) {
        while (this.move(tetris, direction, exists)) { }
    }

    static rotatable(tetris: SquareGroup, exists: Square[]): boolean {
        const newShape = tetris.afterRotateShape();
        if (this.movable(newShape, tetris.centerPoint, exists)) {
            tetris.rotate();
            return true;
        } else {
            return false;
        }
    }

    /**
     * 从已存在的方块中进行消除，并返回消除了几行
     * @param exists 
     */
    static deleteSquares(exists: Square[]): number {
        // 获得y坐标数组
        const yArr = exists.map(sq => sq.coordinate.y);
        // 获得最大和最小的y坐标
        const maxY = Math.max(...yArr);
        const minY = Math.min(...yArr);
        let num = 0;
        // 循环判断每一行是否可以消除
        for (let y = minY; y <= maxY; y++) {
            if (this.deleteLine(exists, y)) {
                num++;
            }
        }
        return num;
    }

    /**
     * 消除一行
     * @param exists 
     * @param y 
     */
    private static deleteLine(exists: Square[], y: number): boolean {
        const lineSquares = exists.filter(sq => sq.coordinate.y === y);
        if (lineSquares.length === GameConfig.panelSize.width) {
            // 可以消除
            lineSquares.forEach(sq => {
                // 从界面移除
                if (sq.viewer) {
                    sq.viewer.hide();
                }
                // 从exists数组中移除
                const index = exists.indexOf(sq);
                exists.splice(index, 1);
            })
            // 剩下的y坐标比当前的小的 + 1
            exists.filter(sq => sq.coordinate.y < y).forEach(sq => {
                sq.coordinate = {
                    x: sq.coordinate.x,
                    y: sq.coordinate.y + 1
                }
            });
            return true;
        }
        return false;
    }
}