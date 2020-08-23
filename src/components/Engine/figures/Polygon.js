import {Line} from './Line';

// import {Polygon} from 'path/to/Polygon'
export class Polygon {
/*
    receives array of points
    usage:
        new Polygon([new Point(x1, y1), new Point(x2,y2), ...])
*/
    constructor(pointArray) {
        this.pointArray = pointArray;
    }

/*
    gives all points of polygon objext
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
    adds point to polygon
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
    checks if line is in render zone
    usage: No usage in client side (only render)
        this._isVisible(renderPointOne, renderPointTwo)
*/
    _isVisible(renderPointOne, renderPointTwo) {
        for (let i = 0; i < this.pointArray.length - 1; ++i) {
            if (new Line(this.pointArray[i], this.pointArray[i + 1])._isVisible(renderPointOne, renderPointTwo)) return true;
        }

        return false;
    }

/*
    renders polygon
    usage:
        renderPointOne -> top left corner of camera
        renderPointTwo -> bottom right corner of camera

        Object.render(ctx, renderPointOne, renderPointTwo) 
*/
    render(ctx, renderPointOne, renderPointTwo) {
        if (this._isVisible(renderPointOne, renderPointTwo)) {
            ctx.beginPath();

            this.pointArray.forEach((point, pos) => {
                if (pos === 0) ctx.moveTo(
                    point.getCord.x - renderPointOne.getCord.x, 
                    renderPointOne.getCord.y - point.getCord.y
                );
                if (pos !== 0) ctx.lineTo(
                    point.getCord.x - renderPointOne.getCord.x, 
                    renderPointOne.getCord.y - point.getCord.y
                );
            });

            ctx.fill();
            ctx.closePath();
        }
    }
}