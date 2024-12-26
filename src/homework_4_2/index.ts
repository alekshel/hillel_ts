type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'percent';
type CalculatorInput = number | string;

interface ICalculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
    percent(value: number, percent: number): number;
    calculate(operation: Operation, a: CalculatorInput, b: CalculatorInput): number;
}

class CalculatorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CalculatorError";
    }
}

class Calculator implements ICalculator {
    add(a: number, b: number): number {
        this.validateNumbers(a, b);
        return a + b;
    }

    subtract(a: number, b: number): number {
        this.validateNumbers(a, b);
        return a - b;
    }

    multiply(a: number, b: number): number {
        this.validateNumbers(a, b);
        return a * b;
    }

    divide(a: number, b: number): number {
        this.validateNumbers(a, b);
        if (b === 0) {
            throw new CalculatorError("Division by zero is not allowed");
        }
        return a / b;
    }

    percent(value: number, percent: number): number {
        this.validateNumbers(value, percent);
        if (percent < 0) {
            throw new CalculatorError("Percentage cannot be negative");
        }
        return (value * percent) / 100;
    }

    calculate(operation: Operation, a: CalculatorInput, b: CalculatorInput): number {
        const numA = this.parseInput(a);
        const numB = this.parseInput(b);

        switch (operation) {
            case 'add':
                return this.add(numA, numB);
            case 'subtract':
                return this.subtract(numA, numB);
            case 'multiply':
                return this.multiply(numA, numB);
            case 'divide':
                return this.divide(numA, numB);
            case 'percent':
                return this.percent(numA, numB);
            default:
                throw new CalculatorError(`Unknown operation: ${operation}`);
        }
    }

    private parseInput(input: CalculatorInput): number {
        if (typeof input === 'string') {
            const num = parseFloat(input);
            if (isNaN(num)) {
                throw new CalculatorError("Invalid number format");
            }
            return num;
        }
        return input;
    }

    private validateNumbers(...numbers: number[]): void {
        for (const num of numbers) {
            if (!isFinite(num)) {
                throw new CalculatorError("Arguments must be finite numbers");
            }
        }
    }
}

try {
    const calc = new Calculator();
    console.log(calc.calculate('add', 2, 3));
    console.log(calc.calculate('multiply', "2.5", "3"));
    console.log(calc.calculate('percent', 200, 15));
} catch (error) {
    if (error instanceof CalculatorError) {
        console.error("Calculator error:", error.message);
    } else {
        console.error("Unexpected error occurred");
    }
}