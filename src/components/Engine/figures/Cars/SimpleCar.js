import {Point} from '../Point';
import {MultiLine} from '../MultiLine';
import {Polygon} from '../Polygon';
import { Line } from '../Line';

export class SimpleCar {
    constructor(carPosition, newCarPosition, size=100, strokeStyle=undefined, polyStyle=undefined) {
        this.carPosition = carPosition;
        this.newCarPosition = newCarPosition;
        this.size = size;
        this.strokeStyle = strokeStyle;
        this.polyStyle = polyStyle;

        this.wholeAngle = 0;
    }

    get getCord() {
        const response = {
            x: this.carPosition.getCord.x,
            y: this.carPosition.getCord.y
        }
        return response;
    }

    __getAngle(lastPoint, newPoint) {
        if (lastPoint.getCord.x === newPoint.getCord.x && lastPoint.getCord.y === newPoint.getCord.y) return this.wholeAngle;

        const xWidth = newPoint.getCord.x - lastPoint.getCord.x;
        const yWidth = newPoint.getCord.y - lastPoint.getCord.y;
        const width = Math.sqrt(xWidth * xWidth + yWidth * yWidth);

        return Math.asin(Math.abs(yWidth / width));
        
        // let angle;

        // if (xWidth >= 0 && yWidth >= 0) angle = Math.asin(Math.abs(yWidth / width));
        // if (xWidth <= 0 && yWidth >= 0) angle = Math.PI - Math.asin(Math.abs(yWidth / width));
        // if (xWidth <= 0 && yWidth <= 0) angle = Math.PI + Math.asin(Math.abs(yWidth / width));
        // if (xWidth >= 0 && yWidth <= 0) angle = 2 * Math.PI - Math.asin(Math.abs(yWidth / width));
        
        // return angle;

        // if (xWidth >= 0) return Math.asin(Math.abs(yWidth / width));
        // if (xWidth <= 0) return Math.PI - Math.asin(Math.abs(yWidth / width));
    }

    __getVector(from, to) {
        return new Point(to.getCord.x - from.getCord.x, to.getCord.y - from.getCord.y);
    }

    _newCordsXY(lastPoint, newPoint, toPoint) {
        // let wholeAngle = this.wholeAngle;
        let angle = this.__getAngle(lastPoint, newPoint);
        const vectorToPoint = this.__getVector(newPoint, toPoint);
        let pointAngle = this.__getAngle(newPoint, toPoint);
        const vectorChangePoint = this.__getVector(lastPoint, newPoint);

        if (vectorChangePoint.getCord.x >= 0 && vectorChangePoint.getCord.y >= 0) angle = angle;
        if (vectorChangePoint.getCord.x < 0 && vectorChangePoint.getCord.y >= 0 ) angle = Math.PI - angle;
        if (vectorChangePoint.getCord.x < 0 && vectorChangePoint.getCord.y < 0  ) angle = Math.PI + angle;
        if (vectorChangePoint.getCord.x >= 0 && vectorChangePoint.getCordy < 0  ) angle = 2 * Math.PI - angle;

        if (vectorToPoint.getCord.x >= 0 && vectorToPoint.getCord.y >= 0) pointAngle = pointAngle;
        if (vectorToPoint.getCord.x < 0 && vectorToPoint.getCord.y >= 0 ) pointAngle = Math.PI - pointAngle;
        if (vectorToPoint.getCord.x < 0 && vectorToPoint.getCord.y < 0  ) pointAngle = Math.PI + pointAngle;
        if (vectorToPoint.getCord.x > 0 && vectorToPoint.getCord.y >= 0 ) pointAngle = 2 * Math.PI - pointAngle;

        let wholeAngle = angle + pointAngle;
        while (wholeAngle >= Math.PI / 2) wholeAngle-= Math.PI / 2;
                

        const vectorToPointWidth = Math.sqrt(
            vectorToPoint.getCord.x * vectorToPoint.getCord.x +
            vectorToPoint.getCord.y * vectorToPoint.getCord.y
        );


        let newX = toPoint.getCord.x;
        let newY = toPoint.getCord.y;

        if (vectorToPoint.getCord.x !== 0) {
            if (wholeAngle >= 3 * Math.PI / 2) {

            }
            newX = newPoint.getCord.x + 
                vectorToPointWidth * Math.cos(wholeAngle) * vectorToPoint.getCord.x / Math.abs(vectorToPoint.getCord.x);
        }
        if (vectorToPoint.getCord.y !== 0) {
            newY = newPoint.getCord.y + 
                vectorToPointWidth * Math.sin(wholeAngle) * vectorToPoint.getCord.y / Math.abs(vectorToPoint.getCord.y);
        }

        

        return new Point(
            newX,
            newY
        );
    }

    render(ctx, renderPointOne, renderPointTwo) {
        const startPoint = new Point(this.newCarPosition.getCord.x, this.newCarPosition.getCord.y);

        const drawPoint1 = this._newCordsXY(
            this.carPosition,
            this.newCarPosition,
            new Point(this.newCarPosition.getCord.x - this.size, this.newCarPosition.getCord.y + this.size)
        );
        const drawPoint2 = this._newCordsXY(
            this.carPosition,
            this.newCarPosition,
            new Point(this.newCarPosition.getCord.x + this.size, this.newCarPosition.getCord.y)
        );
        const drawPoint3 = this._newCordsXY(
            this.carPosition,
            this.newCarPosition,
            new Point(this.newCarPosition.getCord.x - this.size, this.newCarPosition.getCord.y - this.size)
        );
        // const drawPoint4 = this.__newCordsXY(
        //     this.carPosition,
        //     this.newCarPosition,
        //     new Point(this.newCarPosition.getCord.x, this.newCarPosition.getCord.y)
        // );

        // console.log(startPoint);
        // console.log(drawPoint1);
        // 1(110 110) 2(110 100) 3(90 110)

        const testLine = new Line(
            startPoint,
            drawPoint1
        );

        testLine.render(ctx, renderPointOne, renderPointTwo);


        const strokeCar = new MultiLine([
            new Point(this.newCarPosition.getCord.x, this.newCarPosition.getCord.y + this.strokeStyle.width / 2),
            new Point(this.newCarPosition.getCord.x - this.size, this.newCarPosition.getCord.y + this.size + this.strokeStyle.width / 2),
            new Point(this.newCarPosition.getCord.x + this.size, this.newCarPosition.getCord.y + this.strokeStyle.width / 2),
            new Point(this.newCarPosition.getCord.x - this.size, this.newCarPosition.getCord.y - this.size + this.strokeStyle.width / 2),
            new Point(this.newCarPosition.getCord.x, this.newCarPosition.getCord.y + this.strokeStyle.width / 2)
        ], this.strokeStyle);
        const polyCar = new Polygon([
            // new Point(this.newCarPosition.getCord.x, this.newCarPosition.getCord.y),
            // new Point(this.newCarPosition.getCord.x - this.size, this.newCarPosition.getCord.y + this.size),
            // new Point(this.newCarPosition.getCord.x + this.size, this.newCarPosition.getCord.y),
            // new Point(this.newCarPosition.getCord.x - this.size, this.newCarPosition.getCord.y - this.size),
            // new Point(this.newCarPosition.getCord.x, this.newCarPosition.getCord.y)
            startPoint,
            drawPoint1,
            drawPoint2,
            drawPoint3,
            startPoint
        ], this.polyStyle);

        polyCar.render(ctx, renderPointOne, renderPointTwo);
        strokeCar.render(ctx, renderPointOne, renderPointTwo);
    }
}