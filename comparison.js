// MARK: Setting Constants
const top_margin_quick = 50;
const left_margin = 20;
const size_elements = 30;
const top_margin_merge = top_margin_quick * 4 + size_elements * 2;
const space_elements = 8;
const max_value = 999;
const min_vlaue = -999;
const speed = 200;
const num_elements = 25; //n
const num_elements_returned = 10; //k

// MARK: Defining Classes

class Value {
    value;
    index;
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
}

class MergeElementData {
    value;
    curElement;
    elements;
    initialxpos;
    initialypos;
    curPos;

    constructor(value, startingPos, top_margin) {
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

class QuickElementData {
    value;
    element;
    xpos;
    ypos;

    constructor(value, startingPos, top_margin) {
        this.value = value;
        this.xpos = (size_elements + space_elements) * startingPos + left_margin;
        this.ypos = top_margin;
        this.element = this.addElement(this.xpos, this.ypos);
    }

    addElement(xpos, ypos) {
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

        element.style.left = xpos + "px";
        element.style.top = ypos + "px";

        let newElement = new Element(element, xpos, ypos);

        document.body.appendChild(newElement.element);

        return newElement;
    }

    moveDown() {
        this.element.ypos = top_margin_quick * 2 + size_elements;
        this.element.animate();
    }

    moveBack(xpos) {
        this.xpos = xpos;
        this.element.xpos = xpos;
        this.element.ypos = this.ypos;
        this.element.animate();
    }

    moveBackOgr() {
        this.element.ypos = this.ypos;
        this.element.animate();
    }

    clearOutline() {
        this.element.element.style.borderStyle = "none";
    }

    outlineRed() {
        this.element.element.style.borderStyle = "solid";
        this.element.element.style.borderColor = "red";
    }

    outlineYellow() {
        this.element.element.style.borderStyle = "solid";
        this.element.element.style.borderColor = "orange";
    }

    outlineGreen() {
        this.element.element.style.borderStyle = "solid";
        this.element.element.style.borderColor = "green";
    }

    getxpos() {
        return this.xpos;
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
            mergeElementData[i].addElement(mergeElementData[min].initialxpos + size_elements * count, top_margin_merge + (size_elements + space_elements) * (depth));
            ++count;
        }
    } else {
        for (let i = max; i >= min; --i) {
            mergeElementData[i].addElement(mergeElementData[max].initialxpos - size_elements * count, top_margin_merge + (size_elements + space_elements) * (depth));
            ++count;
        }
    }
}

async function merge(min, mid, max) {
    let tempArr = [];
    for (let i = min; i <= max; ++i) {
        tempArr[i] = new Value(mergeValues[i].value, mergeValues[i].index);
    }
    let left = min;
    let right = mid + 1;
    for (let i = min; i <= max; ++i) {
        await sleep(speed/2);
        if (left > mid) {
            mergeValues[i] = tempArr[right];
            mergeElementData[tempArr[right].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++right;
        } else if (right > max) {
            mergeValues[i] = tempArr[left];
            mergeElementData[tempArr[left].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++left;
        } else if (tempArr[left].value < tempArr[right].value) {
            mergeValues[i] = tempArr[right];
            mergeElementData[tempArr[right].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++right;
        } else {
            mergeValues[i] = tempArr[left];
            mergeElementData[tempArr[left].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++left;
        }
    }
}

async function partitionEl(p, r) {
    left = p + 1;
    right = r;
    await sleep(speed / 2);
    for (let i = p; i <= r; ++i) {
        quickElementData[quickValues[i].index].moveDown();
    }
    let pivot = p;
    quickElementData[quickValues[pivot].index].outlineRed();

    while (left <= right) {
        while (quickValues[left].value > quickValues[pivot].value) {
            await sleep(speed);
            quickElementData[quickValues[left].index].outlineYellow();
            quickElementData[quickValues[left].index].moveBackOgr();
            ++left;
            if (left > right) {
                break;
            }
        }
        while (quickValues[right].value < quickValues[pivot].value) {
            await sleep(speed);
            quickElementData[quickValues[right].index].outlineGreen();
            quickElementData[quickValues[right].index].moveBackOgr();
            --right;
        }
        if (left <= right) {
            console.log("swap " + quickValues[left].value + " at pos " + quickElementData[quickValues[left].index].getxpos() +  " and " + quickValues[right].value + " at pos " + quickElementData[quickValues[right].index].getxpos());
            await sleep(speed);
            let tmp = quickValues[left];
            let xtmp = quickElementData[quickValues[right].index].getxpos();
            quickElementData[quickValues[right].index].outlineYellow();
            quickElementData[quickValues[right].index].moveBack(quickElementData[quickValues[left].index].getxpos());
            quickElementData[quickValues[left].index].outlineGreen();
            quickElementData[quickValues[left].index].moveBack(xtmp);
            quickValues[left] = quickValues[right];
            quickValues[right] = tmp;
            ++left;
            --right;
        }
    }

    await sleep(speed);
    let tmp = quickValues[pivot];
    let xtmp = quickElementData[quickValues[right].index].getxpos();
    quickElementData[quickValues[right].index].outlineYellow();
    quickElementData[quickValues[right].index].moveBack(quickElementData[quickValues[pivot].index].getxpos());
    quickElementData[quickValues[pivot].index].outlineGreen();
    quickElementData[quickValues[pivot].index].moveBack(xtmp);
    quickValues[pivot] = quickValues[right];
    quickValues[right] = tmp;

    for (let i = p; i <= r; ++i) {
        quickElementData[quickValues[i].index].clearOutline();
        console.log(quickValues[i].value);
    }

    return right;
}

async function quicksortEl(p, r) {
    if (p < r) {
        var q = await partitionEl(p, r);

        await sleep(speed);

        if (q > num_elements_returned - 1) {
            await quicksortEl(p, q-1);
        }
        if (q < num_elements_returned - 1) {
            await quicksortEl(q+1, r);
        }
    }
}

function displayBox(top_margin) {
    let box = document.createElement("div");
    box.style.width = (size_elements + space_elements ) * num_elements_returned + "px";
    box.style.height = size_elements + space_elements + "px";
    box.style.borderStyle = "solid";
    box.style.borderColor = "red";
    box.style.top = top_margin - (space_elements / 2) + "px";
    box.style.left = left_margin - (space_elements / 2) + "px";
    box.style.position = "absolute";
    document.body.appendChild(box);
}

function displayNames(name, top_margin) {
    let box = document.createElement("div");
    box.textContent = name;
    //box.style.width = (size_elements + space_elements ) * num_elements_returned + "px";
    box.style.height = size_elements + "px";
    box.style.top = top_margin - size_elements + "px";
    box.style.left = left_margin - (space_elements / 2) + "px";
    box.style.position = "absolute";
    document.body.appendChild(box);

}

async function runSorts() {
    displayNames("Merge Sort", top_margin_merge);
    displayNames("Quick Select", top_margin_quick);
    mergeSort(0, num_elements - 1, 0);
    quicksortEl(0, num_elements - 1);
    displayBox(top_margin_merge);
    displayBox(top_margin_quick);
}

// MARK: Main Program 

let mergeValues = [];
let quickValues = [];
let mergeElementData = [];
let quickElementData = [];

// generate rand values for array
for (let i = 0; i < num_elements; ++i) {
    let value = Math.floor(Math.random() * (max_value - min_vlaue)) + min_vlaue;
    mergeValues.push(new Value(value, i));
    quickValues.push(new Value(value, i));
    mergeElementData.push(new MergeElementData(value, i, top_margin_merge));
    quickElementData.push(new QuickElementData(value, i, top_margin_quick));
}

runSorts();