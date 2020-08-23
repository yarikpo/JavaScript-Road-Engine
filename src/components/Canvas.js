import React from 'react';
import './Canvas.css';

import {Engine} from './Engine/Engine';
import {Point} from './Engine/figures/Point';
import {Line} from './Engine/figures/Line';

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
            fromMoveY: undefined
        };

        this.updateCanvas = this.updateCanvas.bind(this);

        this.handleMouseDownListener = this.handleMouseDownListener.bind(this);
        this.handleMouseMoveListener = this.handleMouseMoveListener.bind(this);
        this.handleMouseUpListener = this.handleMouseUpListener.bind(this);
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
            const ctx = this.refs.canvas.getContext('2d');
            // clears screen
            ctx.clearRect(0, 0, this.state.windowWidth, this.state.windowHeight);

            // creates two points which shows position of user camera
            const renderPointOne = new Point(
                this.state.renderShowTopLeftCordX, 
                this.state.renderShowTopLeftCordY
            );
            const renderPointTwo = new Point(
                this.state.renderShowTopLeftCordX + this.state.windowWidth,
                this.state.renderShowTopLeftCordY - this.state.windowHeight
            );
            // creates engine -> and turns on user camera(all info on screen)
            const eng = new Engine(ctx, renderPointOne, renderPointTwo);

            // creates two points which will help to display rectangle later
            const rectPointOne = new Point(200, 300);
            const rectPointTwo = new Point(300, 200);
            // creates and displays a rectangle
            eng.rect(rectPointOne, rectPointTwo);
            // creates and displays line
            eng.render(new Line(new Point(400, 400), new Point(500, 500)));
            eng.render(new Line(new Point(600, 600), new Point(800, 550)));

        }, this.state.animationInterval);
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
            </div>
        )
    }
}

export default Canvas;