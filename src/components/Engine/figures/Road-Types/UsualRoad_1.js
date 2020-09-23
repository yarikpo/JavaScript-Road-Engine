import {Point} from '../Point';
// import {MultiLine} from '../MultiLine';
import {Polygon} from '../Polygon';
        
        //UNUSED VARIABLES
        //const laneWidth = 3;
        //this.lineAB/laneHeight;

export class UsualRoad_1 {
     
    constructor(point1, point2, width, style=undefined){
        const distance = Math.sqrt((point1.getCord.x - point2.getCord.x) ** 2 + (point1.getCord.y - point2.getCord.y) ** 2);

        this.rotate = -this.__getAngle(point1, point2);
        this.point1 = point1;
        this.point2 = new Point(point1.getCord.x + distance * (point2.getCord.x >= point1.getCord.x ? 1 : -1), point1.getCord.y);

        // console.log(this.point1, this.point2);

        this.pointA = new Point(this.point1.getCord.x, this.point1.getCord.y + 1 * width);
        this.pointC = new Point(this.point2.getCord.x, this.point2.getCord.y - 1 * width);
        this.width = width;
        this.style = style;
    }

    get getCord() {
        const response = {
            first: this.pointA,
            second: this.pointB
        };
        return response;
    }

    get parameters() {
        const response = {
            width: this.width,
            laneHeight: this.width / 4,
            laneWidth: this.width / 2,
            space: Math.sqrt(
                Math.pow(Math.abs(this.pointC.getCord.x - this.pointA.getCord.x), 2) +
                Math.pow(Math.abs(this.pointC.getCord.y - this.pointA.getCord.y), 2)
            ),
            laneDistance: this.width / 4
        };
        return response;
    }

    _roadLaneAmount(){
        const laneWidth = this.parameters.laneWidth;
        const space = this.parameters.space;
        const laneDistance = this.parameters.laneDistance;
                 
        const counter = Math.trunc(space / (laneWidth + laneDistance));
        if (counter * (laneWidth + laneDistance) + laneWidth <= space) return counter + 1;
        
        return counter;
    }

    __getAngle(lastPoint, newPoint) {
        // if (lastPoint.getCord.x === newPoint.getCord.x && lastPoint.getCord.y === newPoint.getCord.y) return this.wholeAngle;

        const xWidth = newPoint.getCord.x - lastPoint.getCord.x;
        const yWidth = newPoint.getCord.y - lastPoint.getCord.y;
        const width = Math.sqrt(xWidth * xWidth + yWidth * yWidth);

        // console.log(xWidth, yWidth, width);
        
        let angle;

        if (xWidth >= 0 && yWidth >= 0) angle = Math.asin((yWidth / width));
        if (xWidth < 0 && yWidth >= 0) angle = Math.PI - Math.asin(Math.abs(yWidth / width));
        if (xWidth < 0 && yWidth < 0) angle = Math.PI + Math.asin(Math.abs(yWidth / width));
        if (xWidth >= 0 && yWidth < 0) angle = 2 * Math.PI - Math.asin(Math.abs(yWidth / width));
        
        return angle * 180 / Math.PI;
    }
    
    render(ctx, renderPointOne, renderPointTwo, rot) {
        const rotate = this.rotate || -this.__getAngle(this.point1, this.point2);
        // console.log(rotate);

        const middlePoint = this.point1;

        ctx.translate(middlePoint.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - middlePoint.getCord.y);
        ctx.rotate((Math.PI / 180) * rotate);
        ctx.translate((middlePoint.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - middlePoint.getCord.y) * -1);

        const parameters = this.parameters;

        const roadRnd = new Polygon ([
            this.pointA,
            this.pointB = new Point (this.pointC.getCord.x, this.pointA.getCord.y),
            this.pointC,
            this.pointD = new Point (this.pointA.getCord.x, this.pointC.getCord.y)
        ], {color:'grey', rot: rot});

        const laneNumber = this._roadLaneAmount();


        roadRnd.render(ctx, renderPointOne, renderPointTwo);
        
        for (let i = 0; i < laneNumber - 2; ++i) {
            // TODO fix bug with lanes
            const beginEndDistance = (parameters.space - (parameters.laneDistance + parameters.laneWidth) * laneNumber + parameters.laneDistance) / 2;

            const laneRnd = new Polygon([
                new Point (
                    this.pointA.getCord.x + (parameters.laneDistance + parameters.laneWidth) * i + (i === 0 ? beginEndDistance : 0),
                    this.pointA.getCord.y - (this.pointA.getCord.y - this.pointC.getCord.y) / 2 + parameters.laneHeight / 2
                ),
                new Point (
                    this.pointA.getCord.x + (parameters.laneWidth + parameters.laneDistance) * i + (i === 0 ? beginEndDistance : 0) + parameters.laneWidth, 
                    this.pointA.getCord.y - (this.pointA.getCord.y - this.pointC.getCord.y) / 2 + parameters.laneHeight / 2
                ),
                new Point (
                    this.pointA.getCord.x + (parameters.laneWidth + parameters.laneDistance) * i + (i === 0 ? beginEndDistance : 0) + parameters.laneWidth, 
                    this.pointA.getCord.y - (this.pointA.getCord.y - this.pointC.getCord.y) / 2 - parameters.laneWidth / 2
                ),
                new Point (
                    this.pointA.getCord.x + (parameters.laneDistance + parameters.laneWidth) * i + (i === 0 ? beginEndDistance : 0),
                    this.pointA.getCord.y - (this.pointA.getCord.y - this.pointC.getCord.y) / 2 - parameters.laneWidth / 2)
            ], {color:'white', rot: rot});
            laneRnd.render(ctx, renderPointOne, renderPointTwo);   
        }

        ctx.translate(middlePoint.getCord.x - renderPointOne.getCord.x, renderPointOne.getCord.y - middlePoint.getCord.y);
        ctx.rotate((Math.PI / 180) * -rotate);
        ctx.translate((middlePoint.getCord.x - renderPointOne.getCord.x) * -1, (renderPointOne.getCord.y - middlePoint.getCord.y) * -1);
    }    
}