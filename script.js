var items = [2,8,7,1,3,5,6,4];

// swaps items of indices l and r
function swap(items, l, r) {
    var temp = items[l];
    items[l] = items[r];
    items[r] = temp;
}

/*
    In essence, splitting the array into two halves with according to a pivot point 'pivot',
    such that the left half has values < x and the latter half has values > x.
    Returns the new index of pivot.
*/
function partition(items, p, r) {
    var pivot = items[r];
    var i = p - 1;
    for (let j = p; j < r; j++) {
        if (items[j] < pivot) {
            i++;
            swap(items, i, j);
        }
    }
    i++;
    swap(items, i, r);
    return i;
}

function quicksort(items, p, r) {
    if (p < r) {
        var q = partition(items, p, r);
        quicksort(items, p, q-1);
        quicksort(items, q+1, r);
    }
}

console.log(items);

quicksort(items, 0, items.length-1);

console.log(items);
