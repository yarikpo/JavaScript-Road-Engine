// import {Point} from 'path/to/Point'

export class Point {
/*
    receives coordinates of point
    usage:
        new Point(x, y)
*/
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

/*
    gives coordinates of point
    usage:
        Object.getCord.x (or y)
*/
    get getCord() {
        const response = { x: this.x, y: this.y };
        return response;
    }

/*
    changes point's coordinates
    usage:
        Object.setCord(x, y)
*/
    setCord(x, y, DEBUG=false) {
        this.x = x;
        this.y = y;

        if (DEBUG) console.log('Point cords have been changed');
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
    renders point
    usage:
        Object.render(ctx, renderPointOne, renderPointTwo)
*/
    render(ctx, renderPointOne, renderPointTwo) {
        if (this.__insideCamera(new Point(this.x, this.y), renderPointOne, renderPointTwo)) {
            ctx.beginPath();

            ctx.arc(this.x, this.y, 1, 0, Math.PI * 2, false);

            ctx.fill();
            ctx.closePath();
        }
    }
}