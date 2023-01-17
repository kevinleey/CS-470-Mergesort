const max_value = 999;
const min_vlaue = -999;
const speed = 200;
const num_elements = 50; //n
const num_elements_returned = 20; //k

var items = [];

// generate rand values for array
for (let i = 0; i < num_elements; ++i) {
    items.push(Math.floor(Math.random() * (max_value - min_vlaue)) + min_vlaue);
}

var container = document.getElementById("array");
var desc = document.getElementById("desc");
var numElReturned = document.getElementById("numElReturned");

numElReturned.innerHTML = `Return the top: ${num_elements_returned} values`;

function generateArray() {
    for (var i = 0; i < items.length; i++) {

        // Create div element
        var array_ele = document.createElement("div");
        
        // Adding class 'block' to div
        array_ele.classList.add("block");
        
        // Add height to blocks
        array_ele.style.height = `${Math.floor((items[i] - min_vlaue) / (max_value - min_vlaue) * 100)}px`;

        // Create label for block
        var array_ele_label = document.createElement("label");
        array_ele_label.classList.add("block_id");
        array_ele_label.innerHTML = items[i];

        // Append label to block, then append block to array
        array_ele.appendChild(array_ele_label);
        container.appendChild(array_ele);
    }
}

/*
    In essence, splitting the array into two halves with according to a pivot point 'pivot',
    such that the left half has values < x and the latter half has values > x.
    Returns the new index of pivot.
*/
async function partitionEl(p, r) {
    var blocks = document.querySelectorAll(".block");

    var pivot = Number(blocks[r].childNodes[0].innerHTML);

    // Set pivot block color to red
    blocks[r].style.backgroundColor = 'red';
    
    // Update description text
    desc.innerHTML = `Pivot point chosen: ${pivot}`;
    
    var i = p - 1;

    // wait 2 seconds
    await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, speed)
            );

    for (let j = p; j < r; j++) {
        if (Number(blocks[j].childNodes[0].innerHTML) > pivot) {
            i++;
            
            // Swapping mechanism
            var temp1 = blocks[i].style.height;
            var temp2 = blocks[i].childNodes[0].innerHTML;
            blocks[i].style.height = blocks[j].style.height;
            blocks[j].style.height = temp1;
            blocks[i].childNodes[0].innerHTML = blocks[j].childNodes[0].innerHTML;
            blocks[j].childNodes[0].innerHTML = temp2;

            // Changing colors accordingly
            blocks[i].style.backgroundColor = 'orange';
            blocks[j].style.backgroundColor = 'green';
            if (i == j) blocks[i].style.backgroundColor = 'orange';

            blocks = document.querySelectorAll(".block");
        } else {
            blocks[j].style.backgroundColor = 'green';
        }

        await new Promise((resolve) =>
                    setTimeout(() => {
                    resolve();
                }, speed / 2)
            );
    }
    i++;

    // Swapping mechanism (pivot's swap)
    var temp1 = blocks[i].style.height;
    var temp2 = blocks[i].childNodes[0].innerHTML;
    blocks[i].style.height = blocks[r].style.height;
    blocks[r].style.height = temp1;
    blocks[i].childNodes[0].innerHTML = blocks[r].childNodes[0].innerHTML;
    blocks[r].childNodes[0].innerHTML = temp2;

    // Changing colors accordingly
    blocks[r].style.backgroundColor = 'green';
    blocks[i].style.backgroundColor = 'red';

    await new Promise((resolve) =>
        setTimeout(() => {
        resolve();
        }, speed * 1.1)
    );

    return i;
}

async function quicksortEl(p, r) {
    if (p < r) {
        var q = await partitionEl(p, r);

        // Reset blocks' colors
        blocks = document.querySelectorAll(".block");
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].style.backgroundColor = "#6b5b95";
        }

        if (q == num_elements_returned - 1) {
            // for (var i = 0; i < num_elements_returned - 1; i++) {
            //     blocks[i].style.backgroundColor = 'orange';
            // }
        
        } else {
            if (q > num_elements_returned - 1) {
                await quicksortEl(p, q-1);
            }
            if (q < num_elements_returned - 1) {
                await quicksortEl(q+1, r);
            }
        }
    }
}

async function run() {
    generateArray();
    await quicksortEl(0, items.length-1);
    for (var i = 0; i < num_elements_returned; i++) {
        blocks[i].style.backgroundColor = 'red';
    }

}

// generateArray();
// quicksortEl(0, items.length-1);

run();