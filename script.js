var items = [2,8,7,1,3,5,6,4];
var container = document.getElementById("array");
var desc = document.getElementById("desc");

function generateArray() {
    for (var i = 0; i < items.length; i++) {

        // Create div element
        var array_ele = document.createElement("div");
        
        // Adding class 'block' to div
        array_ele.classList.add("block");
        
        // Add height to blocks
        array_ele.style.height = `${items[i] * 3}px`;

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
                }, 2000)
            );

    for (let j = p; j < r; j++) {
        if (Number(blocks[j].childNodes[0].innerHTML) < pivot) {
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
                }, 700)
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
        }, 2100)
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

        await quicksortEl(p, q-1);
        await quicksortEl(q+1, r);
    }
}

generateArray();
quicksortEl(0, items.length-1);