import { Square } from "./Square";
import { ICoordinate, Shape } from "./types";

/**
 * 组合小方块
 */
export class SquareGroup {
    // 小方块组合数组
    private _squares: readonly Square[];
    // true为顺时针
    protected _isClockRotate = true;

    // 小方块组合访问器
    get squares(){
        return this._squares;
    }

    // 形状访问器
    get shape(){
        return this._shape;
    }

    // 中心点坐标访问器
    get centerPoint():ICoordinate{
        return this._centerPoint;
    }
    set centerPoint(val:ICoordinate){
        this._centerPoint = val;
        this.setSquarePoints();
    }

    /**
     * 根据中心点坐标和形状，设置每一个小方块的坐标
     */
    private setSquarePoints(){
        this._shape.forEach((p, i) => {
            this.squares[i].coordinate = {
                x : this._centerPoint.x + p.x,
                y : this._centerPoint.y + p.y
            }
        });
    }

    constructor(
        // 形状、中心点、颜色
        protected _shape: Shape, 
        private _centerPoint: ICoordinate, 
        private _color: string) {
        // 设置小方块组合数组
        const arr:Square[] = [];
        this._shape.forEach(p => {
            const sq = new Square();
            sq.color = this._color;
            arr.push(sq);
        });
        this._squares = arr;
        this.setSquarePoints();
    }

    /**
     * 旋转后的形状
     */
    afterRotateShape():Shape{
        if(this._isClockRotate){
            return this._shape.map(p => {
                const newP:ICoordinate = {
                    x : -p.y,
                    y : p.x
                }
                return newP;
            })
        }else{
            return this._shape.map(p => {
                const newP:ICoordinate = {
                    x : p.y,
                    y : -p.x
                }
                return newP;
            })
        }
    }

    /**
     * 旋转
     */
    rotate(){
        const newShape = this.afterRotateShape();
        this._shape = newShape;
        this.setSquarePoints();
    }
}