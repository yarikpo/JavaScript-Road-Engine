export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // this.getCord = this.getCord.bind(this);
        // this.setCord = this.setCord.bind(this);
    }

    get getCord() {
        const response = { x: this.x, y: this.y };
        return response;
    }

    setCord(x, y) {
        this.x = x;
        this.y = y;
        console.log('Cords changed');
    }
}