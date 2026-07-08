// Quick Sort by Account ID

function quickSortById(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partitionById(arr, low, high);

        quickSortById(arr, low, pivotIndex - 1);
        quickSortById(arr, pivotIndex + 1, high);
    }

    return arr;
}

function partitionById(arr, low, high) {

    const pivot = arr[high].id;

    let i = low - 1;

    for (let j = low; j < high; j++) {

        if (arr[j].id < pivot) {

            i++;

            [arr[i], arr[j]] = [arr[j], arr[i]];

        }

    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
}



// Quick Sort by Balance

function quickSortByBalance(arr, low = 0, high = arr.length - 1) {

    if (low < high) {

        const pivotIndex = partitionByBalance(arr, low, high);

        quickSortByBalance(arr, low, pivotIndex - 1);
        quickSortByBalance(arr, pivotIndex + 1, high);

    }

    return arr;
}

function partitionByBalance(arr, low, high) {

    const pivot = arr[high].balance;

    let i = low - 1;

    for (let j = low; j < high; j++) {

        if (arr[j].balance < pivot) {

            i++;

            [arr[i], arr[j]] = [arr[j], arr[i]];

        }

    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
}

module.exports = {
    quickSortById,
    quickSortByBalance
};