abstract class Shape {
    protected constructor(
        readonly name: string,
        readonly color: string
    ) {}

    abstract calculateArea(): number;
    abstract calculatePerimeter(): number;

    printInfo(): void {
        console.log(`
            Shape: ${this.name}
            Color: ${this.color}
            Area: ${this.calculateArea()}
            Perimeter: ${this.calculatePerimeter()}
        `);
    }
}

abstract class EllipticalShape extends Shape {
    abstract calculateDiameter(): number | { major: number; minor: number };

    printDiameter(): void {
        const diameter = this.calculateDiameter();
        if (typeof diameter === 'number') {
            console.log(`Diameter: ${diameter}`);
        } else {
            console.log(`Major diameter: ${diameter.major}, Minor diameter: ${diameter.minor}`);
        }
    }
}

class Circle extends EllipticalShape {
    constructor(
        color: string,
        private readonly radius: number
    ) {
        super('Circle', color);
    }

    calculateArea(): number {
        return Math.PI * this.radius ** 2;
    }

    calculatePerimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    calculateDiameter(): number {
        return 2 * this.radius;
    }
}

class Ellipse extends EllipticalShape {
    constructor(
        color: string,
        private readonly majorAxis: number,
        private readonly minorAxis: number
    ) {
        super('Ellipse', color);
    }

    calculateArea(): number {
        return Math.PI * this.majorAxis * this.minorAxis;
    }

    calculatePerimeter(): number {
        const a = this.majorAxis;
        const b = this.minorAxis;
        return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    }

    calculateDiameter(): { major: number; minor: number } {
        return {
            major: 2 * this.majorAxis,
            minor: 2 * this.minorAxis
        };
    }
}

abstract class Polygon extends Shape {
    protected constructor(
        name: string,
        color: string,
        protected readonly sides: number[]
    ) {
        super(name, color);
    }

    getNumberOfSides(): number {
        return this.sides.length;
    }

    calculatePerimeter(): number {
        return this.sides.reduce((sum, side) => sum + side, 0);
    }

    abstract printAreaFormula(): void;
}

class Rectangle extends Polygon {
    constructor(
        color: string,
        private readonly width: number,
        private readonly height: number
    ) {
        super('Rectangle', color, [width, height, width, height]);
    }

    calculateArea(): number {
        return this.width * this.height;
    }

    printAreaFormula(): void {
        console.log('Area = width × height');
    }
}

class Square extends Rectangle {
    constructor(color: string, side: number) {
        super(color, side, side);
    }

    printAreaFormula(): void {
        console.log('Area = side²');
    }
}

enum TriangleType {
    Equilateral = 'Equilateral',
    Isosceles = 'Isosceles',
    Scalene = 'Scalene'
}

class Triangle extends Polygon {
    private readonly type: TriangleType;

    constructor(
        color: string,
        side1: number,
        side2: number,
        side3: number
    ) {
        super('Triangle', color, [side1, side2, side3]);
        this.type = this.determineType();
    }

    calculateArea(): number {
        const s = this.calculatePerimeter() / 2;
        const [a, b, c] = this.sides;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    printAreaFormula(): void {
        console.log('Area = √(s(s-a)(s-b)(s-c)), where s = (a + b + c)/2');
    }

    private determineType(): TriangleType {
        const [a, b, c] = this.sides;
        if (a === b && b === c) return TriangleType.Equilateral;
        if (a === b || b === c || a === c) return TriangleType.Isosceles;
        return TriangleType.Scalene;
    }

    printTriangleType(): void {
        console.log(`Triangle type: ${this.type}`);
    }

    calcHeight(): number {
        return (2 * this.calculateArea()) / this.sides[0];
    }
}

class RegularPolygon extends Polygon {
    constructor(
        color: string,
        private readonly numberOfSides: number,
        private readonly sideLength: number
    ) {
        super(
            'Regular Polygon',
            color,
            Array(numberOfSides).fill(sideLength)
        );
    }

    calculateArea(): number {
        return (this.numberOfSides * this.sideLength ** 2) /
            (4 * Math.tan(Math.PI / this.numberOfSides));
    }

    printAreaFormula(): void {
        console.log('Area = (n × s²) / (4 × tan(π/n))');
    }
}

function demonstrateShapes(): void {
    const circle = new Circle('red', 5);
    const ellipse = new Ellipse('blue', 6, 4);
    const rectangle = new Rectangle('green', 4, 6);
    const triangle = new Triangle('purple', 3, 4, 5);
    const hexagon = new RegularPolygon('orange', 6, 4);

    circle.printInfo();
    circle.printDiameter();

    ellipse.printInfo();
    ellipse.printDiameter();

    rectangle.printInfo();
    rectangle.printAreaFormula();

    triangle.printInfo();
    triangle.printTriangleType();
    console.log(`Triangle height: ${triangle.calcHeight()}`);

    hexagon.printInfo();
    console.log(`Number of sides: ${hexagon.getNumberOfSides()}`);
}

demonstrateShapes();