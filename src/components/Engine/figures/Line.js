import {Point} from './Point';

// import {Line} from 'path/to/Line'
export class Line {
/*
    receives 2 points
    usage:
        new Line(new Point(x1, y1), new Point(x2, y2), { color: 'red', width: 10 })
*/
    constructor(point1, point2, style=undefined) {
        this.pointOne = new Point(point1.getCord.x, point1.getCord.y);
        this.pointTwo = new Point(point2.getCord.x, point2.getCord.y);
        this.style = style;
    }

/*
    gives both points of line
    usage:
        Object.getCord.first.getCord.x (or y)
        or
        Object.getCord.second.getCord.y (or x)
*/
    get getCord() {
        const response = {
            first: this.pointOne,
            second: this.pointTwo
        };
        return response;
    }

/*
    gives width of length of line
    usage:
        Object.getDistance
*/
    get getDistance() {
        const response = Math.sqrt(
            Math.pow(Math.abs(this.pointOne.getCord.x - this.pointTwo.getCord.x), 2) +
            Math.pow(Math.abs(this.pointOne.getCord.y - this.pointTwo.getCord.y), 2)
        );
        return response;
    }

/*
    updates values of points
    usage:
        Object.setCord(new Point(x1, y1), new Point(x2, y2))
*/
    setCord(newPointOne, newPointTwo, DEBUG=false) {
        this.pointOne = new Point(newPointOne.getCord.x, newPointOne.getCord.y);
        this.pointTwo = new Point(newPointTwo.getCord.x, newPointTwo.getCord.y);

        if (DEBUG) console.log('Line cords have been changed');
    }

    // uses only in Engine
    __area(a, b, c) {
        return (b.getCord.x - a.getCord.x) * (c.getCord.y - a.getCord.y) -
            (b.getCord.y - a.getCord.y) * (c.getCord.x - a.getCord.x);
    }

    // uses only in Engine
    __intersect_1(a, b, c, d) {
        if (a > b) [a, b] = [b, a];
        if (c > d) [c, d] = [d, c];
        return Math.max(a, c) <= Math.min(b, d);
    }

/*
    checks if line AB crossed by line CD
    usage: No usage (only in Engine)
*/
    __intersect(a, b, c, d) {
        return this.__intersect_1(a.getCord.x, b.getCord.x, c.getCord.x, d.getCord.x)
                && this.__intersect_1(a.getCord.y, b.getCord.y, c.getCord.y, d.getCord.y)
                && this.__area(a, b, c) * this.__area(a, b, d) <= 0
                && this.__area(c, d, a) * this.__area(c, d, b) <= 0;
    }

/*
    TODO
    Make this function work for any rectangle
    (even for turned on some angle)

    ---

    checks if point is inside rect
    usage: No usage (only in Engine)
*/
    __insideCamera(checkPoint, rectPointOne, rectPointTwo) {
        if (checkPoint.getCord.x < rectPointOne.getCord.x) return false;
        if (checkPoint.getCord.x > rectPointTwo.getCord.x) return false;
        if (checkPoint.getCord.y > rectPointOne.getCord.y) return false;
        if (checkPoint.getCord.y < rectPointTwo.getCord.y) return false;
        
        return true;
    }

/*
    checks if line is in render zone
    usage: No usage in client side (only render)
        this._isVisible(renderPointOne, renderPointTwo)
*/
    _isVisible(renderPointOne, renderPointTwo) {
        // console.log(this.rot);
        // TODO fix bug with rotation
        if (1) return true;

        if (this.rot !== 0 && this.rot != null) return true;

        // declare points of corners of user camera
        const renderPointLeftTop = new Point(renderPointOne.getCord.x, renderPointOne.getCord.y);
        const renderPointRightTop = new Point(renderPointTwo.getCord.x, renderPointOne.getCord.y);
        const renderPointLeftBottom = new Point(renderPointOne.getCord.x, renderPointTwo.getCord.y);
        const renderPointRightBottom = new Point(renderPointTwo.getCord.x, renderPointTwo.getCord.y);

        // variable equals true/false if object is visible
        const isVisible = ((
            this.__intersect(this.pointOne, this.pointTwo, renderPointLeftTop, renderPointRightTop)
            || this.__intersect(this.pointOne, this.pointTwo, renderPointRightTop, renderPointLeftBottom)
            || this.__intersect(this.pointOne, this.pointTwo, renderPointLeftBottom, renderPointRightBottom)
            || this.__intersect(this.pointOne, this.pointTwo, renderPointRightBottom, renderPointLeftTop)
        ) || (
            this.__insideCamera(this.pointOne, renderPointOne, renderPointTwo)
            || this.__insideCamera(this.pointTwo, renderPointOne, renderPointTwo)
        ));
        
        return isVisible;
    }

/*
    renders line
    usage:
        renderPointOnew -> top left corner of user's camera
        renderPointTwo -> bottom right corner of user's camera
        Object.render(ctx, renderPointOne, renderPointTwo)
*/
    render(ctx, renderPointOne, renderPointTwo, rot) {
        this.rot = rot;
        // console.log(this.rot);
        // checks if line is located in render area
        if (this._isVisible(renderPointOne, renderPointTwo)) {
            ctx.beginPath();
            // checks line for styles
            let rotate = 0;
            if (this.style != null && this.style.color != null) ctx.strokeStyle = this.style.color;
            else ctx.strokeStyle = '#000';
            if (this.style != null && this.style.width != null) ctx.lineWidth = this.style.width;
            else ctx.lineWidth = 1;
            if (this.style != null && this.style.rotate != null) rotate = this.style.rotate;
            else rotate = 0;

            const middlePoint = new Point(
                (this.pointOne.getCord.x + this.pointTwo.getCord.x) / 2,
                (this.pointOne.getCord.y + this.pointTwo.getCord.y) / 2
            );

            // rotate figures
            ctx.translate(middlePoint.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - middlePoint.getCord.y);
            ctx.rotate((Math.PI / 180) * rotate);
            ctx.translate((middlePoint.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - middlePoint.getCord.y) * -1);

            // draws line
            ctx.moveTo(
                this.pointOne.getCord.x - renderPointOne.getCord.x,
                renderPointOne.getCord.y - this.pointOne.getCord.y
            );
            ctx.lineTo(
                this.pointTwo.getCord.x - renderPointOne.getCord.x,
                renderPointOne.getCord.y - this.pointTwo.getCord.y
            );

            ctx.stroke();
            // sets values to defaults
            ctx.translate(middlePoint.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - middlePoint.getCord.y);
            ctx.rotate((Math.PI / 180) * -rotate);
            ctx.translate((middlePoint.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - middlePoint.getCord.y) * -1);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            
            ctx.closePath();
        }
    }
}