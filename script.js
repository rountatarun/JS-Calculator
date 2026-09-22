const previousOperandElement = document.getElementById("previous-operand");
const currentOperandElement = document.getElementById("current-operand");

let currentOperand = "0";
let previousOperand = "";
let operation = null;
let resetScreen = false;

function updateDisplay() {
    currentOperandElement.innerText = currentOperand;
    if (operation != null) {
        previousOperandElement.innerText = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.innerText = "";
    }
}

function appendNumber(number) {
    if (currentOperand === "0" || resetScreen) {
        currentOperand = number;
        resetScreen = false;
    } else {
        if (number === "." && currentOperand.includes(".")) return;
        currentOperand += number;
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === "") return;
    if (previousOperand !== "") {
        calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    currentOperand = "0";
    updateDisplay();
}

function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case "+":
            result = prev + current;
            break;
        case "-":
            result = prev - current;
            break;
        case "×":
            result = prev * current;
            break;
        case "÷":
            if (current === 0) {
                alert("Cannot divide by zero");
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Round to avoid floating point precision issues
    currentOperand = parseFloat(result.toFixed(10)).toString();
    operation = null;
    previousOperand = "";
    resetScreen = true;
    updateDisplay();
}

function percentage() {
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    currentOperand = (current / 100).toString();
    updateDisplay();
}

function toggleSign() {
    if (currentOperand === "0") return;
    if (currentOperand.startsWith("-")) {
        currentOperand = currentOperand.slice(1);
    } else {
        currentOperand = "-" + currentOperand;
    }
    updateDisplay();
}

function deleteDigit() {
    if (resetScreen) return;
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith("-"))) {
        currentOperand = "0";
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function clearAll() {
    currentOperand = "0";
    previousOperand = "";
    operation = null;
    updateDisplay();
}

// Event Listeners for Buttons
document.querySelectorAll(".btn-number").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("data-number");
        if (value === "neg") {
            toggleSign();
        } else {
            appendNumber(value);
        }
    });
});

document.querySelectorAll(".btn-operator").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.getAttribute("data-operator"));
    });
});

document.querySelectorAll(".btn-action").forEach(button => {
    const action = button.getAttribute("data-action");
    button.addEventListener("click", () => {
        if (action === "clear") clearAll();
        if (action === "delete") deleteDigit();
        if (action === "percent") percentage();
    });
});

document.querySelector(".btn-equals").addEventListener("click", () => {
    calculate();
});

// Keyboard Support
window.addEventListener("keydown", e => {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        appendNumber(e.key);
    }
    if (e.key === "+" || e.key === "-") {
        chooseOperation(e.key);
    }
    if (e.key === "*") {
        chooseOperation("×");
    }
    if (e.key === "/") {
        chooseOperation("÷");
    }
    if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculate();
    }
    if (e.key === "Backspace") {
        deleteDigit();
    }
    if (e.key === "Escape") {
        clearAll();
    }
    if (e.key === "%") {
        percentage();
    }
});

updateDisplay();