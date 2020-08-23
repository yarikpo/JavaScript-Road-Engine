import {Point} from './Point';

export class Line {
    constructor(point1, point2) {
        this.pointOne = new Point(point1.getCord.x, point1.getCord.y);
        this.pointTwo = new Point(point2.getCord.x, point2.getCord.y);
    }

    get getCord() {
        const response = {
            first: this.pointOne,
            second: this.pointTwo
        };
        return response;
    }

    get getDistance() {
        const response = Math.sqrt(
            Math.pow(Math.abs(this.pointOne.getCord.x - this.pointTwo.getCord.x), 2) +
            Math.pow(Math.abs(this.pointOne.getCord.y - this.pointTwo.getCord.y), 2)
        );
        return response;
    }

    setCord(newPointOne, newPointTwo, DEBUG=false) {
        this.pointOne = new Point(newPointOne.getCord.x, newPointOne.getCord.y);
        this.pointTwo = new Point(newPointTwo.getCord.x, newPointTwo.getCord.y);

        if (DEBUG) console.log('Line cords have been changed');
    }

    __area(a, b, c) {
        return (b.getCord.x - a.getCord.x) * (c.getCord.y - a.getCord.y) -
            (b.getCord.y - a.getCord.y) * (c.getCord.x - a.getCord.x);
    }

    __intersect_1(a, b, c, d) {
        if (a > b) [a, b] = [b, a];
        if (c > d) [c, d] = [d, c];
        return Math.max(a, c) <= Math.min(b, d);
    }

    // checks if line AB crosses line CD
    __intersect(a, b, c, d) {
        return this.__intersect_1(a.getCord.x, b.getCord.x, c.getCord.x, d.getCord.x)
                && this.__intersect_1(a.getCord.y, b.getCord.y, c.getCord.y, d.getCord.y)
                && this.__area(a, b, c) * this.__area(a, b, d) <= 0
                && this.__area(c, d, a) * this.__area(c, d, b) <= 0;
    }

    // checks if point is inside rect
/*
    TODO
    Make this function work for any rectangle
    (even for turned on some angle)
*/
    __insideCamera(checkPoint, rectPointOne, rectPointTwo) {
        if (checkPoint.getCord.x < rectPointOne.getCord.x) return false;
        if (checkPoint.getCord.x > rectPointTwo.getCord.x) return false;
        if (checkPoint.getCord.y > rectPointOne.getCord.y) return false;
        if (checkPoint.getCord.y < rectPointTwo.getCord.y) return false;
        
        return true;
    }

    // checks if line is in render zone
    _isVisible(renderPointOne, renderPointTwo) {
        const renderPointLeftTop = new Point(renderPointOne.getCord.x, renderPointOne.getCord.y);
        const renderPointRightTop = new Point(renderPointTwo.getCord.x, renderPointOne.getCord.y);
        const renderPointLeftBottom = new Point(renderPointOne.getCord.x, renderPointTwo.getCord.y);
        const renderPointRightBottom = new Point(renderPointTwo.getCord.x, renderPointTwo.getCord.y);

        const isVisible = ((
            this.__intersect(this.pointOne, this.pointTwo, renderPointLeftTop, renderPointRightTop)
            || this.__intersect(this.pointOne, this.pointTwo, renderPointRightTop, renderPointLeftBottom)
            || this.__intersect(this.pointOne, this.pointTwo, renderPointLeftBottom, renderPointRightBottom)
            || this.__intersect(this.pointOne, this.pointTwo, renderPointRightBottom, renderPointLeftTop)
        ) || (
            this.__insideCamera(this.pointOne, renderPointOne, renderPointTwo)
            || this.__insideCamera(this.pointTwo, renderPointOne, renderPointTwo)
        )) ;
        
        return isVisible;
    }

    render(ctx, renderPointOne, renderPointTwo) {


        if (this._isVisible(renderPointOne, renderPointTwo)) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(
                this.pointOne.getCord.x - renderPointOne.getCord.x,
                renderPointOne.getCord.y - this.pointOne.getCord.y
            );
            ctx.lineTo(
                this.pointTwo.getCord.x - renderPointOne.getCord.x,
                renderPointOne.getCord.y - this.pointTwo.getCord.y
            );

            ctx.stroke();
            ctx.closePath();
        }
    }
}