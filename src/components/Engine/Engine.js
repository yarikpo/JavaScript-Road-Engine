/*
I almost didn't commented this file because it could be changed
in any tme
*/


import {Point} from './figures/Point';

const DEBUG = false;

// import {Engine} from 'path/to/Engine'
export class Engine {
    constructor(ctx, renderPointOne, renderPointTwo) {
        this.ctx = ctx;
        
        // Cors of left up render point
        this.renderPointOne = new Point(
            Math.min(renderPointOne.getCord.x, renderPointTwo.getCord.x),
            Math.max(renderPointOne.getCord.y, renderPointTwo.getCord.y)
        );
        // Cords of right down render point
        this.renderPointTwo = new Point(
            Math.max(renderPointOne.getCord.x, renderPointTwo.getCord.x),
            Math.min(renderPointOne.getCord.y, renderPointTwo.getCord.y)
        );

        this.windowHeight = Math.abs(this.renderPointOne.getCord.y - this.renderPointTwo.getCord.y);
        this.windowWidth  = Math.abs(this.renderPointOne.getCord.x - this.renderPointTwo.getCord.x);

        if (DEBUG) console.log('Engine created!');
    }

    rect(firstPoint, secondPoint) {
        this.ctx.beginPath();
        // cords of left up rect point
        const leftUpPoint = new Point(
            Math.min(firstPoint.getCord.x, secondPoint.getCord.x),
            Math.max(firstPoint.getCord.y, secondPoint.getCord.y)
        );
        // cords of right down rect point
        const rightDownPoint = new Point(
            Math.max(firstPoint.getCord.x, secondPoint.getCord.x),
            Math.min(firstPoint.getCord.y, secondPoint.getCord.y)
        );
        // setting width and height of rect
        const rectWidth = Math.abs(rightDownPoint.getCord.x - leftUpPoint.getCord.x);
        const rectHeight = Math.abs(leftUpPoint.getCord.y - rightDownPoint.getCord.y);

        // checking if rect is located in render area
        if (!(
            leftUpPoint.getCord.x > this.renderPointTwo.getCord.x ||
            leftUpPoint.getCord.y < this.renderPointTwo.getCord.y ||
            rightDownPoint.getCord.x < this.renderPointOne.getCord.x ||
            rightDownPoint.getCord.y > this.renderPointOne.getCord.y
        )) {
            if (DEBUG) console.log('Rect in rendering area.');

            // drawing rect
            this.ctx.rect(
                leftUpPoint.getCord.x - this.renderPointOne.getCord.x,
                this.renderPointOne.getCord.y - leftUpPoint.getCord.y,
                rectWidth,
                rectHeight
            );
        }
        

        this.ctx.fill();
        this.ctx.closePath();
    }

    render(object) {
        object.render(this.ctx, this.renderPointOne, this.renderPointTwo);
    }
}

export default Engine;