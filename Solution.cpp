
#include<queue>
#include<vector>
using namespace std;

struct Item {
    int row;
    int column;
    int price;
    int distanceFromStart;

    Item(int row, int column) {
        this->row = row;
        this->column = column;
        this->price = 0;
        this->distanceFromStart = 0;
    }
};

class Solution {
    
public:

    vector<vector<int>> moves
    {
        {0, 1}, //right
        {0, -1},//left
        {1, 0}, //up
        {-1, 0} //down
    };

    size_t rows;
    size_t columns;
    int minPrice;
    int maxPrice;

    vector<vector<int>> highestRankedKItems(vector<vector<int>>& grid, vector<int>& pricing, vector<int>& start, int k) {

        rows = grid.size();
        columns = grid[0].size();
        minPrice = pricing[0];
        maxPrice = pricing[1];
        return breadthFirstSearch(grid, start, k);
    }

    vector<vector<int>> breadthFirstSearch(vector<vector<int>>& grid, vector<int>& start, int k) {

        queue<Item> queue;
        vector < vector<bool>> visited(rows, vector<bool>(columns, false));
        vector<Item> foundItems;

        Item firstItem(start[0], start[1]);
        firstItem.price = grid[start[0]][start[1]];
        firstItem.distanceFromStart = 0;

        visited[start[0]][start[1]] = true;
        queue.push(firstItem);

        while (!queue.empty()) {

            Item current = queue.front();
            queue.pop();

            if (foundItems.size() == k && foundItems.back().distanceFromStart < current.distanceFromStart) {
                break;
            }

            if (isInPriceRange(current.price)) {
                foundItems.push_back(current);
            }

            for (int i = 0; i < moves.size(); i++) {
                int new_r = current.row + moves[i][0];
                int new_c = current.column + moves[i][1];

                if (isInGrid(new_r, new_c) && !visited[new_r][new_c] && grid[new_r][new_c] != 0) {

                    Item item(new_r, new_c);
                    item.price = grid[new_r][new_c] != 1 ? grid[new_r][new_c] : -1;
                    item.distanceFromStart = current.distanceFromStart + 1;
                    queue.push(item);
                    visited[new_r][new_c] = true;
                }
            }
        }
        return sortAndReturnFirst_k_items(foundItems, k);
    }

    vector<vector<int>> sortAndReturnFirst_k_items(vector<Item>& foundItems, int k) {

        sort(foundItems.begin(), foundItems.end(), &compareItemRank);
        vector<vector<int>> highestRanked_K_Items;
        int size = k > foundItems.size() ? foundItems.size() : k;
        for (int i = 0; i < size; i++) {
            highestRanked_K_Items.push_back(vector<int>{foundItems[i].row, foundItems[i].column});
        }
        return highestRanked_K_Items;
    }

    static bool compareItemRank(const Item& item_01, const Item& item_02) {

        if (item_01.distanceFromStart != item_02.distanceFromStart) {
            return item_01.distanceFromStart < item_02.distanceFromStart;
        }
        if (item_01.price != item_02.price) {
            return item_01.price < item_02.price;
        }
        if (item_01.row != item_02.row) {
            return item_01.row < item_02.row;
        }
        return item_01.column < item_02.column;
    }

    bool isInGrid(int r, int c) {
        return r >= 0 && r < rows && c >= 0 && c < columns;
    }

    bool isInPriceRange(int price) {
        return price >= minPrice && price <= maxPrice;
    }
};
