import React from 'react';
import './Canvas.css';

import {Engine} from './Engine/Engine';
import {Point} from './Engine/figures/Point';
// import {Line} from './Engine/figures/Line';
import {MultiLine} from './Engine/figures/MultiLine';
import {Polygon} from './Engine/figures/Polygon';
import {SimpleCar} from './Engine/figures/Cars/SimpleCar';
import {UsualRoad_1} from './Engine/figures/Road-Types/UsualRoad_1';

const DEBUG = false;

/*
cors === coordinates
rect === rectangle
*/

class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            windowHeight: 600,
            windowWidth: 800,
            // update interval
            animationInterval: 100,
            // shows if pressed left mouse button
            ifMousePressed: false,
            // changes after mouseup event
            renderTopLeftCordX: 0,
            renderTopLeftCordY: 600,
            // changes while mousemove event
            renderShowTopLeftCordX: 0,
            renderShowTopLeftCordY: 600,
            // cors of mouse during click / changes after mousedown event
            fromMoveX: undefined,
            fromMoveY: undefined,
            // scale variable
            scalePlus: 1.25,
            scaleMinus: 0.8,
            scale: 1,
            // position of each car
            carPositions: [],
            // certanly got positions of each car
            newCarPositions: [],
            // rotated angle
            rotated: 0
        };

        this.updateCanvas = this.updateCanvas.bind(this);

        this.handleMouseDownListener = this.handleMouseDownListener.bind(this);
        this.handleMouseMoveListener = this.handleMouseMoveListener.bind(this);
        this.handleMouseUpListener = this.handleMouseUpListener.bind(this);

        this.handleClickScalePlus = this.handleClickScalePlus.bind(this);
        this.handleClickScaleMinus = this.handleClickScaleMinus.bind(this);

        this.handleClickTurnLeft = this.handleClickTurnLeft.bind(this);
        this.handleClickTurnRight = this.handleClickTurnRight.bind(this);
    }

    componentDidMount() {
/*
        TODO
        could be passed some event listeners
        like (not sure if it works):
        window.addEventListener('keydown', this.handleKeyRight, false); 
*/
        window.addEventListener('mousedown', this.handleMouseDownListener, false);
        window.addEventListener('mousemove', this.handleMouseMoveListener, false);
        window.addEventListener('mouseup', this.handleMouseUpListener, false);


        this.updateCanvas();
        // requestAnimationFrame(() => this.updateCanvas());
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    // Main function
    updateCanvas() {
        // repeats action each animation interval
        setInterval(() => {
            // get data from server
            if (false) {
                const url = 'http://localhost:3001/api/blabla';
                fetch(url, {
                    'method': 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                })
                    .then(response => response.json())
                    .then(response => this.setState({ newCarPositions: response }))
                    .catch(err => console.log('Cant get data from server.'));
            }


            const ctx = this.refs.canvas.getContext('2d');
            // clears screen
            ctx.clearRect(this.state.windowWidth * this.state.scale * -1, 0, this.state.windowWidth * this.state.scale * 2, this.state.windowHeight * this.state.scale * 2);
            if (this.state.rotated !== 0) ctx.clearRect(this.state.windowWidth * this.state.scale * -2, this.state.windowHeight * this.state.scale * -2, this.state.windowWidth * this.state.scale * 2, this.state.windowHeight * this.state.scale * 2);

            // creates two points which shows position of user camera
            const renderPointOne = new Point(
                (this.state.renderShowTopLeftCordX) * this.state.scale, 
                (this.state.renderShowTopLeftCordY) * this.state.scale
            );
            const renderPointTwo = new Point(
                (this.state.renderShowTopLeftCordX + this.state.windowWidth) * this.state.scale,
                (this.state.renderShowTopLeftCordY - this.state.windowHeight) * this.state.scale
            );
            // creates engine -> and turns on user camera(all info on screen)
            // console.log(this.state.rotated);
            const eng = new Engine(ctx, renderPointOne, renderPointTwo, this.state.rotated);


            // creates two points which will help to display rectangle later
            // const rectPointOne = new Point(200, 300);
            // const rectPointTwo = new Point(300, 200);
            // creates and displays a rectangle
            // eng.rect(rectPointOne, rectPointTwo);

            // creates and displays line
            // eng.render(new Line(new Point(400, 400), new Point(500, 500), { rotate: 0 }));
            // eng.render(new Line(new Point(600, 600), new Point(800, 550)));

            const multiLine = new MultiLine([
                new Point(20, 30),
                new Point(40, 500),
                new Point(90, 70),
                new Point(500, 400)
            ], { color: 'red', width: 2, rotate: 0 });
            // adds new point to multiline
            multiLine.addPoint(new Point(600, 100));
            // deletes i point
            multiLine.deleteCord(2);

            const polygon = new Polygon([
                new Point(600, 100),
                new Point(650, 200),
                new Point(700, 100)
            ], { color: 'blue', rotate: 0 });
            polygon.addPoint(new Point(800, 600));
            // render polygon
            // eng.render(polygon);

            // eng.render(new Point(100, 300, {color: 'red', radius: 5, rotate: 0}));

            // eng.render(new Line(new Point(0, 600), new Point(800, 0), { color: 'green', width: 10, rotate: 0 }));

            // render multiline
            // eng.render(multiLine);

            // road rendering
            const road1 = new UsualRoad_1(new Point(300, 300), new Point(600, 600), 15);
            eng.render(road1);

            // render car
            const startTime = 1600767155803;
            const finishTime = 1600767495803;
            const car = new SimpleCar(new Point(90, 90), new Point(1000, 1000), 30, startTime, finishTime, {
                color: '#c23',
                width: 1
            }, {
                color: '#222'
            });
            eng.render(car);

            // clearing space
            Object.keys(eng).forEach(key => delete eng[key]);
            Object.keys(ctx).forEach(key => delete ctx[key]);

        }, this.state.animationInterval);
    }

    // turns camera
    handleClickTurnLeft(e) {
        const ctx = this.refs.canvas.getContext('2d');
        const rotate = 10;
        const rotated = this.state.rotated + rotate;

        console.log('left');
        ctx.rotate((Math.PI / 180) * rotate);
        console.log(rotated);
        this.setState({ rotated: rotated });


        Object.keys(ctx).forEach(key => delete ctx[key]);
    }

    handleClickTurnRight(e) {
        const ctx = this.refs.canvas.getContext('2d');
        const rotate = -10;
        const rotated = this.state.rotated + rotate;

        console.log('right');
        ctx.rotate((Math.PI / 180) * rotate);
        console.log(rotated);
        this.setState({ rotated: rotated });


        Object.keys(ctx).forEach(key => delete ctx[key]);
    }

    // scale
    handleClickScalePlus(e) {
        const ctx = this.refs.canvas.getContext('2d');
        const scl = this.state.scale;
        ctx.scale(this.state.scalePlus, this.state.scalePlus);
        this.setState({ scale: scl * this.state.scaleMinus });
        Object.keys(ctx).forEach(key => delete ctx[key]);
    }

    handleClickScaleMinus(e) {
        const ctx = this.refs.canvas.getContext('2d');
        const scl = this.state.scale;
        ctx.scale(this.state.scaleMinus, this.state.scaleMinus);
        this.setState({ scale: scl * this.state.scalePlus });
        Object.keys(ctx).forEach(key => delete ctx[key]);
    }

    // mouse listeners
    handleMouseMoveListener(e) {
        // this.updateCanvas();
        if (this.state.ifMousePressed === true) {
            // position of top left corner of replaces user's camera
            let changedMoveX = this.state.renderTopLeftCordX - e.offsetX + this.state.fromMoveX;
            let changedMoveY = this.state.renderTopLeftCordY + e.offsetY - this.state.fromMoveY;

            // setting position of user camera
            this.setState({
                renderShowTopLeftCordX: changedMoveX,
                renderShowTopLeftCordY: changedMoveY,
            });
        }
    }

    handleMouseDownListener(e) {
        // some logs
        if (DEBUG) console.log('Mouse down');
        if (DEBUG) console.log(`X: ${e.offsetX}`);
        if (DEBUG) console.log(`Y: ${e.offsetY}`);

        // checks if curson is in canvas field
        if (e.offsetX > 0 && 
            e.offsetY > 0 && 
            e.offsetX < this.state.windowWidth && 
            e.offsetY < this.state.windowHeight
        ) {
            // remembers position where mouse was clicked
            this.setState({ 
                ifMousePressed: true, 
                fromMoveX: e.offsetX, 
                fromMoveY: e.offsetY 
            });
        }
        
    }

    handleMouseUpListener(e) {
        if (DEBUG) console.log('Mouse up');

        // positions of top left corner of user's camera
        const putMouseX = this.state.renderShowTopLeftCordX;
        const putMouseY = this.state.renderShowTopLeftCordY;
        // setting position of user camera (before click)
        this.setState({ 
            ifMousePressed: false,
            renderTopLeftCordX: putMouseX,
            renderTopLeftCordY: putMouseY
        });
    }

    render() {
        return (
            <div 
                className='canvas-field'
                style={{
                    height: this.state.windowHeight,
                    width: this.state.windowWidth
                }}
            >
                <canvas ref='canvas' width={this.state.windowWidth} height={this.state.windowHeight} />
                <button onClick={this.handleClickScalePlus}>+</button>
                <button onClick={this.handleClickScaleMinus}>-</button>
                <br />
                <button onClick={this.handleClickTurnLeft}>&#60;-</button>
                <button onClick={this.handleClickTurnRight}>-&#62;</button>
            </div>
        )
    }
}

export default Canvas;