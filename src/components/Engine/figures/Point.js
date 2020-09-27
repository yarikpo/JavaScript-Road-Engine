// import {Point} from 'path/to/Point'

export class Point {
/*
    receives coordinates of point
    usage:
        new Point(x, y, {radius: 2, color: 'red})
*/
    constructor(x, y, style=undefined) {
        this.x = x;
        this.y = y;

        this.style = style;
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
    setCord(x, y) {
        this.x = x;
        this.y = y;

        // if (DEBUG) console.log('Point cords have been changed');
    }

/*
    TODO
    Make this function work for any rectangle
    (even for turned on some angle)

    ---

    checks if point is inside rect
    usage: No usage (only in Engine)
*/
    __insideCamera(checkPoint, radius, rectPointOne, rectPointTwo) {
        if (1) return true;

        if (this.rot !== 0 && this.rot != null) return true;
        if (checkPoint.getCord.x + radius < rectPointOne.getCord.x) return false;
        if (checkPoint.getCord.x - radius > rectPointTwo.getCord.x) return false;
        if (checkPoint.getCord.y - radius > rectPointOne.getCord.y) return false;
        if (checkPoint.getCord.y + radius < rectPointTwo.getCord.y) return false;
        
        return true;
    }

/*
    renders point
    usage:
        Object.render(ctx, renderPointOne, renderPointTwo)
*/
    render(ctx, renderPointOne, renderPointTwo, rot) {
        this.rot = rot;

        let radius, color, rotate;
        if (this.style != null && this.style.radius != null) radius = this.style.radius;
        else radius = 1;
        if (this.style != null && this.style.color != null) color = this.style.color;
        else color = '#000';
        if (this.style != null && this.style.rotate != null) rotate = this.style.rotate;
        else rotate = 0;

        if (this.__insideCamera(new Point(this.x, this.y), radius, renderPointOne, renderPointTwo)) {
            ctx.beginPath();

            ctx.fillStyle = color;
            ctx.translate(this.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - this.getCord.y);
            ctx.rotate((Math.PI / 180) * rotate);
            ctx.translate((this.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - this.getCord.y) * -1);

            ctx.arc(this.x - renderPointOne.getCord.x, renderPointOne.getCord.y - this.y, radius, 0, Math.PI * 2, false);

            ctx.fill();
            
            ctx.translate(this.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - this.getCord.y);
            ctx.rotate((Math.PI / 180) * -rotate);
            ctx.translate((this.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - this.getCord.y) * -1);
            ctx.fillStyle = '#000';
            ctx.closePath();
        }
    }
}