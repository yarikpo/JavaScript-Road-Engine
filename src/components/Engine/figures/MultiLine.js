import {Point} from './Point';
import {Line} from './Line';

// import {MultiLine} from 'path/to/MultiLine'
export class MultiLine {
/*
    receives array of points
    usage:
        new Multiline([new Point(x1, y1), new Point(x2, y2), ...)], { color: 'red', width: 2 })
*/
    constructor(pointArray, style=undefined) {
        // array of points (lines of whome will be rendered)
        this.pointArray = pointArray;
        // array of lines
        this.lineArray = [];
        // multiline styles
        this.style = style;
    }

/*
    gives all points of multiline objext
    usage:
        Objext.getCord[i].getCord.x
*/
    get getCord() {
        let response = [];
        this.pointArray.forEach((point, i) => {
            response[i] = point;
        });
        return response;
    }

/*
    changes value of one point
    usage:
        Object.setCord(i, new Point(x1, y1))
*/
    setCord(i, point) {
        this.pointArray[i] = point;
        this.pointArray = this.pointArray.filter(element => {
            return !(this.pointArray[i].getCord.x === element.getCord.x
                && this.pointArray[i].getCord.y === element.getCord.y);
        });
    }

/*
    deletes all points out of point array
    usage:
        Object.clearCord()
*/
    clearCord() {
        this.pointArray = [];
    }

/*
    adds point to multiline
    usage:
        Object.addPoint(new Point(x, y))
*/
    addPoint(point) {
        this.pointArray.push(point);
    }

/*
    deletes point out of point array
    usage:
        Objext.deleteCord(i)
*/
    deleteCord(i) {
        this.pointArray = this.pointArray.filter(element => {
            return !(this.pointArray[i].getCord.x === element.getCord.x
                && this.pointArray[i].getCord.y === element.getCord.y);
        });
    }

/*
    updates line array
    usage: No usage in client side (only render)
*/
    _updateLine() {
        // clears line array
        this.lineArray = [];

        for (let i = 0; i < this.pointArray.length - 1; ++i) {
            // pushes new line to line array (using 2 neighbour points)
            this.lineArray.push(
                new Line(
                    new Point(this.pointArray[i].getCord.x, this.pointArray[i].getCord.y), 
                    new Point(this.pointArray[i + 1].getCord.x, this.pointArray[i + 1].getCord.y),
                    this.style
                )
            );
        }
    }

    _getMiddlePoint(points) {
        let left = Infinity;
        let right = -Infinity;
        let top = -Infinity;
        let bottom = Infinity;

        points.forEach(point => {
            left = Math.min(left, point.getCord.x);
            right = Math.max(right, point.getCord.x);
            top = Math.max(top, point.getCord.y);
            bottom = Math.min(bottom, point.getCord.y);
        });

        return new Point((left + right) / 2, (top + bottom) / 2);
    }

/*
    renders multiline
    usage:
        renderPointOne -> top left corner of camera
        renderPointTwo -> bottom right corner of camera

        Object.render(ctx, renderPointOne, renderPointTwo) 
*/
    render(ctx, renderPointOne, renderPointTwo, rot) {
        let rotate = 0;
        if (this.style != null && this.style.rotate != null) rotate = this.style.rotate;
        else rotate = 0;

        this.style.rotate = null;

        // updates all lines
        this._updateLine();
        // finds mass centre
        const middlePoint = this._getMiddlePoint(this.pointArray);

        ctx.translate(middlePoint.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - middlePoint.getCord.y);
        ctx.rotate((Math.PI / 180) * rotate);
        ctx.translate((middlePoint.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - middlePoint.getCord.y) * -1);


        // renders each line
        this.lineArray.forEach(line => {
            line.render(ctx, renderPointOne, renderPointTwo, rot);
        });

        // sets values to default
        ctx.translate(middlePoint.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - middlePoint.getCord.y);
        ctx.rotate((Math.PI / 180) * -rotate);
        ctx.translate((middlePoint.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - middlePoint.getCord.y) * -1);
    }
}