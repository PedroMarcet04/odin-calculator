
// Reduces an array of numbers and operations into
// a result (or "ERR"). Follows PEMDAS.
const evaluateMath = function(stack) {
    // Base case o
    if (stack.length < 2) {
        if (stack.length == 0) {
            return "0";
        } else {
            if (!Number.isNaN(Number(stack[0]))) {
                return stack[0];
            } else {
                return "ERR";
            }
        }
    }

    // Recursively handle parenthesees
    while (stack.includes("(")) {
        // console.log("resolving parens")
        const start = stack.findIndex((val) => val=="(");
        let numOfOpenParen = 1;
        let end = -1;
        for (let i = start+1; i < stack.length; i++) {
            switch (stack[i]) {
                case "(":
                    numOfOpenParen++;
                    break;
                case ")":
                    numOfOpenParen--;
                    break;
            }
            if (numOfOpenParen == 0) {
                end = i;
                break;
            }
        }
        if (end == -1) return "ERR";

        // Recursive call
        const resolvedParenExpression = evaluateMath(stack.slice(start+1, end));
        if (resolvedParenExpression == "ERR") return "ERR";
        stack.splice(start, end-start+1, resolvedParenExpression);
    }

    // Handle multiplication, division, addition, and subtraction
    const operators = ["*", "/", "+", "-"];

    for (const operator of operators) {
        while (stack.includes(operator)) {
            const operatorIndex = stack.findIndex((val) => val==operator);
            const num1 = Number(stack[operatorIndex-1]);
            const num2 = Number(stack[operatorIndex+1]);
            if (!Number.isNaN(num1) && !Number.isNaN(num2)) {
                let result;
                switch (operator) {
                    case "*":
                        result = num1*num2;
                        break;
                    case "/":
                        result = num1/num2;
                        break;
                    case "+":
                        result = num1+num2;
                        break;
                    case "-":
                        result = num1-num2;
                        break;
                }
                result = String(result);
                
                stack.splice(operatorIndex-1, 3, result);
            } else {
                return "ERR";
            }
        }
    }
    if (stack.length == 1) {
        return stack[0];
    } else {
        return "ERR";
    }
}



// --- Operations ---
const operationDisplay = document.querySelector("#screen-text");
const operation = ["0"];

const displayOperation = function() {
    operationDisplay.textContent = operation.join(" ");
    // console.log(`Current operation: ${operation}`);
}

const clearOperation = function() {
    operation.splice(0, Infinity, "0");
}

const deleteFromOperation = function() {
    const lastOperation = operation.at(-1);

    if (operation.length == 1 && lastOperation == "0") return;

    if (!Number.isNaN(Number(lastOperation))) {
        if (lastOperation == "0") operation.pop();
        else if (lastOperation.length == 1) {
            operation.pop();
            operation.push("0");
        } else {
            operation.push(operation.pop().slice(0, -1));
        }
    } else {
        operation.pop();
    }
}

const addNumberToOpeation = function(num) {
    if (!Number.isNaN(Number(operation.at(-1)))) {
        if (operation.at(-1) != "0") {
            operation.push(operation.pop().concat(num));
        } else {
            operation.pop();
            operation.push(num);
        }
    } else {
        operation.push(num);
    }
}

const addDotToOperation = function(num) {
    if (!Number.isNaN(Number(operation.at(-1)))) {
        if (!operation.at(-1).includes(".")) operation.push(operation.pop().concat("."));
    } else {
        operation.push("0.");
    }
}

const addOperatorToOperation = function(operator) {
    operation.push(operator);
}

const evaluateOperation = function() {
    const evaluatedOperation = evaluateMath(operation);
    operation.splice(0, Infinity, evaluatedOperation);
}

displayOperation();



// ---Buttons---
const buttonReset = function(event) {
    let button = event.target;
    // console.log(`Button "${button.textContent}" reset.`);

    button.classList.remove("pressed"); // Removing darker background

    // Resetting listeners
    button.removeEventListener("mouseup", buttonReleased);
    button.removeEventListener("mouseleave", buttonReset);
}
const buttonReleased = function(event) {
    let button = event.target;
    // console.log(`Button "${button.textContent}" released.`);

    buttonReset(event); // Resetting button to unclicked state

    switch (button.textContent) {
        case "7": case "8": case "9":
        case "4": case "5": case "6":
        case "1": case "2": case "3":
        case "0":
            addNumberToOpeation(button.textContent);
            break;
        case ".":
            addDotToOperation();
            break;
        case "*": case "/": case "+": case "-":
        case "(": case ")":
            addOperatorToOperation(button.textContent);
            break;
        case "=":
            evaluateOperation();
            break;
        case "CLEAR":
            clearOperation();
            break;
        case "BACK":
            deleteFromOperation();
            break;
        default:
            console.log("unknown button pressed");
    }
    displayOperation();
}
const buttonPressed = function(event) {
    let button = event.target;
    // console.log(`Button "${button.textContent}" pressed.`);

    button.classList.add("pressed"); // Add dark background

    // Listeners
    button.addEventListener("mouseup", buttonReleased); // Finish click
    button.addEventListener("mouseleave", buttonReset); // Reset button without clicking
}

// Initializing buttons
const calcButtons = document.querySelectorAll(".calc-button");

for (const button of calcButtons) {
    button.addEventListener("mousedown", buttonPressed);
}



// ---Keyboard input---
const keyPressed = function(event) {
    switch (event.key) {
        case "7": case "8": case "9":
        case "4": case "5": case "6":
        case "1": case "2": case "3":
        case "0":
            addNumberToOpeation(event.key);
            break;
        case ".":
            addDotToOperation();
            break;
        case "*": case "/": case "+": case "-":
        case "(": case ")":
            addOperatorToOperation(event.key);
            break;
        case "=": case "Enter":
            evaluateOperation();
            break;
        case "Delete":
            clearOperation();
            break;
        case "Backspace":
            deleteFromOperation();
            break;
        default:
            console.log(`unknown key pressed: ${event.key}`)
    }
    displayOperation();
}

document.addEventListener("keydown", keyPressed);

// //--- Test Cases ---
// // debugger;
// let test = [10];
// console.log(evaluateMath(test)) // .toBe(10);

//  test = [10, 20];
// console.log(evaluateMath(test)) // .toBe("ERR");

//  test = [10, "+", 2];
// console.log(evaluateMath(test))//.toBe(12);

//  test = [10, "*", 2];
// console.log(evaluateMath(test))//.toBe(20);

//  test = [10, "+", 2, "*", 2];
// console.log(evaluateMath(test))//.toBe(14);

//  test = [10, "*", 2, "+", 2];
// console.log(evaluateMath(test))//.toBe(22);

// debugger;
//  test = ["(", 10, "+", 2, ")", "*", 2];
// console.log(evaluateMath(test))//.toBe(24);

//  test = [10, "*", "(", 2, "+", 2, ")"];
// console.log(evaluateMath(test))//.toBe(40);

//  test = [10, "*", 2, "+", 2, ")"];
// console.log(evaluateMath(test))//.toBe(ERR);
