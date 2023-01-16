// MARK: Setting Constants
const top_margin = 20;
const left_margin = 20;
const size_elements = 30;
const space_elements = 8;
const max_value = 999;
const min_vlaue = -999;
const speed = 400;
const num_elements = 40; //n
const num_elements_returned = 7; //k

// MARK: Defining Classes

class Value {
    value;
    index;
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
}

class ElementData {
    value;
    curElement;
    elements;
    initialxpos;
    initialypos;
    curPos;

    constructor(value, startingPos) {
        this.value = value;
        this.elements = [];
        this.initialxpos = (size_elements + space_elements) * startingPos + left_margin;
        this.initialypos = top_margin;
        this.addElement(this.initialxpos, this.initialypos);
        this.curPos = -1;
    }

    async addElement(xpos, ypos) {
        let element = document.createElement("div");

        element.style.width = size_elements + "px";
        element.style.height =  size_elements + "px";

        element.textContent = this.value;

        let color_percent = Math.floor((this.value - min_vlaue) / (max_value - min_vlaue) * 255);
        let r_value = 50 + .8 * color_percent;
        let g_value = 250 - .9 * color_percent;
        let b_value = 125 + .5 * color_percent;
        element.style.backgroundColor = "rgba(" + r_value + ", " + g_value + ", " + b_value + ", 0.5)";

        element.style.transition = "all .25s ease-in-out"
        element.style.position = "absolute";

        if (this.elements.length == 0) {
            element.style.left = xpos + "px";
            element.style.top = ypos + "px";
        } else {
            element.style.left = this.curElement.xpos + "px";
            element.style.top = this.curElement.ypos + "px";
            ++this.curPos;
        }

        let newElement = new Element(element, xpos, ypos);

        this.elements.push(newElement);
        this.curElement = newElement;

        document.body.appendChild(newElement.element);

        await sleep(1);

        newElement.animate();
    }

    updateCurElementPos(xpos, ypos) {
        this.curElement.xpos = xpos;
        this.curElement.ypos = ypos;
        this.curElement.animate();
    }

    getxpos() {
        return this.elements[this.curPos].xpos;
    }

    getypos() {
        return this.elements[this.curPos].ypos;
    }

    deleteNextElement() {
        this.elements[this.curPos].element.remove();
        --this.curPos;
    }
}

class Element {
    element;
    xpos;
    ypos;

    constructor(element, xpos, ypos) {
        this.element = element;
        this.xpos = xpos;
        this.ypos = ypos;
    }

    animate() {
        this.element.style.left = this.xpos;
        this.element.style.top = this.ypos;
    }
}

// MARK: Helper Functions

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mergeSort(min, max, depth) {
    if (min < max) {
        let mid = Math.floor((min + max) / 2);

        await sleep(speed);
        copy(min, mid, depth + 1, true);
        await mergeSort(min, mid, depth + 1);

        await sleep(speed);
        copy(mid + 1, max, depth + 1, false);
        await mergeSort(mid + 1, max, depth + 1);

        await sleep(speed);
        await merge(min, mid, max, depth);
    }
}

function copy(min, max, depth, left) {
    let count = 0;
    if (left) {
        for (let i = min; i <= max; ++i) {
            elementData[i].addElement(elementData[min].initialxpos + size_elements * count, top_margin + (size_elements + space_elements) * (depth));
            ++count;
        }
    } else {
        for (let i = max; i >= min; --i) {
            elementData[i].addElement(elementData[max].initialxpos - size_elements * count, top_margin + (size_elements + space_elements) * (depth));
            ++count;
        }
    }
}

async function merge(min, mid, max) {
    let tempArr = [];
    for (let i = min; i <= max; ++i) {
        tempArr[i] = new Value(values[i].value, values[i].index);
    }
    let left = min;
    let right = mid + 1;
    for (let i = min; i <= max; ++i) {
        await sleep(200);
        if (left > mid) {
            values[i] = tempArr[right];
            elementData[tempArr[right].index].updateCurElementPos(elementData[i].getxpos(), elementData[i].getypos());
            elementData[i].deleteNextElement();
            ++right;
        } else if (right > max) {
            values[i] = tempArr[left];
            elementData[tempArr[left].index].updateCurElementPos(elementData[i].getxpos(), elementData[i].getypos());
            elementData[i].deleteNextElement();
            ++left;
        } else if (tempArr[left].value < tempArr[right].value) {
            values[i] = tempArr[right];
            elementData[tempArr[right].index].updateCurElementPos(elementData[i].getxpos(), elementData[i].getypos());
            elementData[i].deleteNextElement();
            ++right;
        } else {
            values[i] = tempArr[left];
            elementData[tempArr[left].index].updateCurElementPos(elementData[i].getxpos(), elementData[i].getypos());
            elementData[i].deleteNextElement();
            ++left;
        }
    }
}

function displayBox() {
    let box = document.createElement("div");
    box.style.width = (size_elements + space_elements ) * num_elements_returned + space_elements + "px";
    box.style.height = size_elements + top_margin + "px";
    box.style.borderStyle = "solid";
    box.style.borderColor = "red";
    box.style.top = top_margin - (space_elements / 2) + "px";
    box.style.left = left_margin - (space_elements / 2) + "px";
    document.body.appendChild(box);
}

async function run() {
    await mergeSort(0, num_elements - 1, 0);
    displayBox();
}

// MARK: Main Program 

let values = [];
let elementData = [];

// generate rand values for array
for (let i = 0; i < num_elements; ++i) {
    let value = Math.floor(Math.random() * (max_value - min_vlaue)) + min_vlaue;
    values.push(new Value(value, i))
    elementData.push(new ElementData(value, i));
}

//mergeSort(0, num_elements - 1, 0);
run();