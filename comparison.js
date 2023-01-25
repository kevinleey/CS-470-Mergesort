// MARK: Setting Constants

// Visual constants
const top_margin_quick = 50;
const top_margin_desc = 200;
const left_margin = 20;
const size_elements = 30;
const top_margin_merge = top_margin_quick * 4 + size_elements * 2;
const space_elements = 8;
const speed = 200;

// Range
const max_value = 999;
const min_vlaue = -999;

// N K constraints
const num_elements = 25; //n
const num_elements_returned = 10; //k

// MARK: Defining Classes

// Links value to its element data
class Value {
    value;
    index;
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }
}

// Element data for Mergesort elements
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

    // Add sort of a child or duplicate element to the screen (show splitting array)
    async addElement(xpos, ypos) {
        let element = document.createElement("div");

        element.style.width = size_elements + "px";
        element.style.height =  size_elements + "px";

        element.textContent = this.value;

        // Color element based on value
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
        } else { // elements after first are initialized to parent's x and y coord to show animaiton
            element.style.left = this.curElement.xpos + "px";
            element.style.top = this.curElement.ypos + "px";
            ++this.curPos;
        }

        let newElement = new Element(element, xpos, ypos);

        this.elements.push(newElement);
        this.curElement = newElement;

        document.body.appendChild(newElement.element);

        // show animation
        await sleep(1);
        newElement.animate();
    }

    // animate curent (lowest) element to new position
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

    // Delete 2nd lowest element
    deleteNextElement() {
        this.elements[this.curPos].element.remove();
        --this.curPos;
    }
}

// Element data for Quickselect elements
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

        // Color element based on value
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

    // Move elements down to show what part of the array we are partitioning
    moveDown() {
        this.element.ypos = top_margin_quick * 2 + size_elements;
        this.element.animate();
    }

    // Move from a lower position to a new (more sorted) position
    moveBack(xpos) {
        this.xpos = xpos;
        this.element.xpos = xpos;
        this.element.ypos = this.ypos;
        this.element.animate();
    }

    // Move back to original location
    moveBackOgr() {
        this.element.ypos = this.ypos;
        this.element.animate();
    }

    // Make outline of element clear
    clearOutline() {
        this.element.element.style.borderStyle = "none";
    }

    // Make outline of element red
    outlineRed() {
        this.element.element.style.borderStyle = "solid";
        this.element.element.style.borderColor = "red";
    }

    // Make outline of element yellow
    outlineYellow() {
        this.element.element.style.borderStyle = "solid";
        this.element.element.style.borderColor = "orange";
    }

    // Make outline of element green
    outlineGreen() {
        this.element.element.style.borderStyle = "solid";
        this.element.element.style.borderColor = "green";
    }

    getxpos() {
        return this.xpos;
    }
}

// Element data for each DIV
class Element {
    element;
    xpos;
    ypos;

    constructor(element, xpos, ypos) {
        this.element = element;
        this.xpos = xpos;
        this.ypos = ypos;
    }

    // animate to new position
    animate() {
        this.element.style.left = this.xpos;
        this.element.style.top = this.ypos;
    }
}

// MARK: Helper Functions

// Simple sleep function for given ms
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mergesort
async function mergeSort(min, max, depth) {
    if (min < max) {
        let mid = Math.floor((min + max) / 2);

        // Split left
        await sleep(speed);
        copy(min, mid, depth + 1, true);
        await mergeSort(min, mid, depth + 1);

        // Split right
        await sleep(speed);
        copy(mid + 1, max, depth + 1, false);
        await mergeSort(mid + 1, max, depth + 1);

        // Merge left and right
        await sleep(speed);
        await merge(min, mid, max, depth);
    }
}

// Used to visually split array (shows the array being split at a lower level)
function copy(min, max, depth, left) {
    let count = 0;
    if (left) { // if we are splitting left array
        for (let i = min; i <= max; ++i) {
            mergeElementData[i].addElement(mergeElementData[min].initialxpos + size_elements * count, top_margin_merge + (size_elements + space_elements) * (depth));
            ++count;
        }
    } else { // splitting right array
        for (let i = max; i >= min; --i) {
            mergeElementData[i].addElement(mergeElementData[max].initialxpos - size_elements * count, top_margin_merge + (size_elements + space_elements) * (depth));
            ++count;
        }
    }
}

// Merge step of mergesort (merge arrays together)
async function merge(min, mid, max) {
    // copy data to temp array
    let tempArr = [];
    for (let i = min; i <= max; ++i) {
        tempArr[i] = new Value(mergeValues[i].value, mergeValues[i].index);
    }
    let left = min;
    let right = mid + 1;
    for (let i = min; i <= max; ++i) {
        await sleep(speed/2);
        if (left > mid) { // no more values in left array
            mergeValues[i] = tempArr[right];
            mergeElementData[tempArr[right].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++right;
        } else if (right > max) { // no more values in right array
            mergeValues[i] = tempArr[left];
            mergeElementData[tempArr[left].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++left;
        } else if (tempArr[left].value < tempArr[right].value) { // value in right array greater
            mergeValues[i] = tempArr[right];
            mergeElementData[tempArr[right].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++right;
        } else { // value in left array equal or greater
            mergeValues[i] = tempArr[left];
            mergeElementData[tempArr[left].index].updateCurElementPos(mergeElementData[i].getxpos(), mergeElementData[i].getypos());
            mergeElementData[i].deleteNextElement();
            ++left;
        }
    }
}

// Partition step of Quickselect
async function partitionEl(p, r) {
    left = p + 1;
    right = r;
    await sleep(speed / 2);
    // Move section down
    for (let i = p; i <= r; ++i) {
        quickElementData[quickValues[i].index].moveDown();
    }
    // set first element as pivot (outline red)
    let pivot = p;
    quickElementData[quickValues[pivot].index].outlineRed();

    let pivotXPos = quickElementData[quickValues[pivot].index].xpos;

    changeDesc(`New Pivot: ${quickValues[pivot].value}`, pivotXPos);
    await sleep(3000);
    changeDesc(`New Pivot: ${quickValues[pivot].value}       SORTING...`, pivotXPos);

    while (left <= right) {
        // if left value is greater, just copy back
        while (quickValues[left].value > quickValues[pivot].value) {
            await sleep(speed);
            quickElementData[quickValues[left].index].outlineYellow();
            quickElementData[quickValues[left].index].moveBackOgr();
            ++left;
            if (left > right) {
                break;
            }
        }
        // if right value is greater, just copy back
        while (quickValues[right].value < quickValues[pivot].value) {
            await sleep(speed);
            quickElementData[quickValues[right].index].outlineGreen();
            quickElementData[quickValues[right].index].moveBackOgr();
            --right;
        }
        // swap elements (left and right)
        if (left <= right) {
            console.log("swap " + quickValues[left].value + " at pos " + quickElementData[quickValues[left].index].getxpos() +  " and " + quickValues[right].value + " at pos " + quickElementData[quickValues[right].index].getxpos());
            await sleep(speed);
            // use temp to not loose values when swapping
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

    await sleep(1000);
    changeDesc('SORTED! Putting pivot in its right position.', pivotXPos);
    await sleep(3000);

    // Swap pivot and last right element
    await sleep(speed);
    let tmp = quickValues[pivot];
    let xtmp = quickElementData[quickValues[right].index].getxpos();
    quickElementData[quickValues[right].index].outlineYellow();
    quickElementData[quickValues[right].index].moveBack(quickElementData[quickValues[pivot].index].getxpos());
    quickElementData[quickValues[pivot].index].outlineGreen();
    quickElementData[quickValues[pivot].index].moveBack(xtmp);
    quickValues[pivot] = quickValues[right];
    quickValues[right] = tmp;

    // clear outline for all elements
    for (let i = p; i <= r; ++i) {
        quickElementData[quickValues[i].index].clearOutline();
        console.log(quickValues[i].value);
    }

    return right;
}

// Quickselect
async function quicksortEl(p, r) {
    if (p < r) {
        var q = await partitionEl(p, r);

        await sleep(speed);

        // if the partition is greater than the num of elements we want, quickselect left side
        if (q > num_elements_returned - 1) {
            changeDesc(text = 'Pivot index > 9! Quick select on left side.');
            await sleep(3000);
            changeBndry('right', quickElementData[quickValues[q].index].xpos);
            await quicksortEl(p, q-1);
        }
        // if the partition is less than the num of elements we want, quickselect right side
        if (q < num_elements_returned - 1) {
            changeDesc(text = 'Pivot index < 9! Quick select on right side.');
            await sleep(3000);
            changeBndry('left', quickElementData[quickValues[q+1].index].xpos);
            await quicksortEl(q+1, r);
        }
    }
    changeDesc(text = 'Top 10 elements found!');
}

// Display box of the numbers we want returned (k)
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

// Display names of algorithms
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

// Initialize description box
async function setDesc(top_margin_desc) {
    let box = document.createElement("div");
    box.setAttribute('id', 'desc');
    box.style.height = size_elements + "px";
    box.style.top = top_margin_desc + "px";
    box.style.left = left_margin - (space_elements / 2) + "px";
    box.style.position = "absolute";
    document.body.appendChild(box);
}

// Initialize boundary lines
async function setBoundaries() {
    let left = document.createElement("div");
    left.setAttribute('id', 'leftBndry');
    left.style.height = (size_elements * 4) + "px";
    left.style.width = 2 + "px";
    left.style.backgroundColor = "grey";
    left.style.top = top_margin_quick + "px";
    left.style.left = quickElementData[quickValues[0].index].xpos - 4 + "px";
    left.style.position = "absolute";
    left.style.transition = 0.5 + "s";
    document.body.appendChild(left);

    let right = document.createElement("div");
    right.setAttribute('id', 'rightBndry');
    right.style.height = (size_elements * 4) + "px";
    right.style.width = 2 + "px";
    right.style.backgroundColor = "grey";
    right.style.top = top_margin_quick + "px";
    right.style.left = quickElementData[quickValues[quickElementData.length-1].index].xpos + size_elements + 4 + "px";
    right.style.position = "absolute";
    right.style.transition = 0.5 + "s";
    document.body.appendChild(right);
}

async function changeBndry(side, newXPos) {
    let bndry;
    if (side == 'left') {
        bndry = document.getElementById('leftBndry');
    } else if (side == 'right') {
        bndry = document.getElementById('rightBndry');
    }
    bndry.style.left = newXPos;
}

// Change description box text and location
async function changeDesc(text, left_margin) {
    let box = document.getElementById('desc');
    box.textContent = text;
    box.style.left = left_margin + "px";
}

// Run algorithms at the same time
async function runSorts() {
    displayNames("Merge Sort", top_margin_merge);
    displayNames("Quick Select", top_margin_quick);
    setDesc(top_margin_desc);
    mergeSort(0, num_elements - 1, 0);
    quicksortEl(0, num_elements - 1);
    displayBox(top_margin_merge);
    displayBox(top_margin_quick);
    setBoundaries();
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

// run program
runSorts();