import { Square } from "../Square";
import $ from "jquery";
import { IViewer } from "../types";
import PageConfig from "./PageConfig";

/**
 * 显示一个小方块到页面上
 */
export class SquarePageViewer implements IViewer {

    private _dom?: JQuery<HTMLElement>
    private _isRemove:boolean = false
    show(): void {
        if(this._isRemove){
            return;
        }
        if(!this._dom){
            this._dom = $('<div>').css({
                position : "absolute",
                width : PageConfig.SquareSize.width,
                height : PageConfig.SquareSize.height,
                border : "1px solid #ccc",
                boxSizing : "border-box"
            }).appendTo(this._container);
        }
        this._dom.css({
            left : this._square.coordinate.x * PageConfig.SquareSize.width,
            top : this._square.coordinate.y * PageConfig.SquareSize.height,
            background : this._square.color
        })
    }
    hide(): void {
        if(this._dom && !this._isRemove){
            this._dom.remove();
            this._isRemove = true;
        }
    }
    constructor(
        private _square:Square,
        private _container:JQuery<HTMLElement>
    ){

    }
}