
/**
 * @param {number[][]} grid
 * @param {number[]} pricing
 * @param {number[]} start
 * @param {number} k
 * @return {number[][]}
 */
var highestRankedKItems = function (grid, pricing, start, k) {

    const search = new Search(grid.length, grid[0].length, pricing);
    return search.breadthFirstSearch(grid, start, k);
};

class Search {

    /**
     * @param {number} rows
     * @param {number} columns
     * @param {number[]} pricing
     */
    constructor(rows, columns, pricing) {
        this.moves = [
            [0, 1], //right
            [0, -1], //left
            [1, 0], //up
            [-1, 0]//down
        ];

        this.rows = rows;
        this.columns = columns;
        this.minPrice = pricing[0];
        this.maxPrice = pricing[1];
    }

    /**
     * @param {number[][]} grid
     * @param {number[]} start
     * @param {number} k
     * @return {number[][]}
     */
    breadthFirstSearch(grid, start, k) {

        const queue = new Queue();
        const visited = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            visited[i] = new Array(this.column);
            visited[i].fill(false);
        }
        const foundItems = [];

        let firstItem = new Item(start[0], start[1]);
        firstItem.price = grid[start[0]][start[1]];
        firstItem.distanceFromStart = 0;

        visited[start[0]][start[1]] = true;
        queue.enqueue(firstItem);

        while (!queue.isEmpty()) {

            let current = queue.dequeue();

            if (foundItems.length === k && foundItems[foundItems.length - 1].distanceFromStart < current.distanceFromStart) {
                break;
            }

            if (this.isInPriceRange(current.price)) {
                foundItems.push(current);
            }

            for (let i = 0; i < this.moves.length; i++) {
                let new_r = current.row + this.moves[i][0];
                let new_c = current.column + this.moves[i][1];

                if (this.isInGrid(new_r, new_c) && !visited[new_r][new_c] && grid[new_r][new_c] !== 0) {

                    let item = new Item(new_r, new_c);
                    item.price = grid[new_r][new_c] !== 1 ? grid[new_r][new_c] : -1;
                    item.distanceFromStart = current.distanceFromStart + 1;
                    queue.enqueue(item);
                    visited[new_r][new_c] = true;

                }
            }

        }
        return this.sortAndReturnFirst_k_items(foundItems, k);
    }

    /**
     * @param {Item[]} foundItems
     * @param {number} k
     * @return {number[][]}
     */
    sortAndReturnFirst_k_items(foundItems, k) {

        foundItems.sort((item_01, item_02) => this.compareItemRank(item_01, item_02));
        const highestRanked_K_Items = [];
        let size = k > foundItems.length ? foundItems.length : k;

        for (let i = 0; i < size; i++) {
            highestRanked_K_Items.push([foundItems[i].row, foundItems[i].column]);
        }
        return highestRanked_K_Items;
    }

    /**
     * @param {Item} item_01
     * @param {Item} item_02
     * @return {number}
     */
    compareItemRank(item_01, item_02) {

        if (item_01.distanceFromStart !== item_02.distanceFromStart) {
            return item_01.distanceFromStart - item_02.distanceFromStart;
        }
        if (item_01.price !== item_02.price) {
            return item_01.price - item_02.price;
        }
        if (item_01.row !== item_02.row) {
            return item_01.row - item_02.row;
        }
        return item_01.column - item_02.column;
    }

    /**
     * @param {number} r
     * @param {number} c
     * @return {boolean}
     */
    isInGrid(r, c) {
        return r >= 0 && r < this.rows && c >= 0 && c < this.columns;
    }

    /**
     * @param {number} price
     * @return {boolean}
     */
    isInPriceRange(price) {
        return price >= this.minPrice && price <= this.maxPrice;
    }
}

class Item {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.distanceFromStart = 0;
        this.price = 0;
    }
}
