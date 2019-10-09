import { ICoordinate, IViewer } from "./types";

/**
 * 小方块
 * 属性：颜色、坐标(逻辑坐标)
 * 能处理自己的数据，知道什么时候显示，但不知道怎么显示
 * 传统面向对象语言书写类的属性时：
 *      1、所有属性全部私有化，命名习惯下划线开头
 *      2、使用公开的方法提供属性的访问
 */
export class Square {
    private _coordinate: ICoordinate = { x: 0, y: 0 }
    private _color: string = "red"
    // 显示者属性
    private _viewer?: IViewer

    // 显示者访问器
    get viewer() {
        return this._viewer;
    }
    set viewer(val) {
        this._viewer = val;
        if (val) {
            val.show();
        }
    }

    // 坐标访问器
    get coordinate() {
        return this._coordinate;
    }
    set coordinate(val) {
        this._coordinate = val;
        // 渲染显示
        if (this._viewer) {
            this._viewer.show();
        }
    }

    // 颜色访问器
    get color() {
        return this._color;
    }
    set color(val) {
        this._color = val;
    }

    constructor() { }
}