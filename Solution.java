
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.Queue;

public class Solution {

    int[][] moves = {
        {0, 1},//right
        {0, -1},//left
        {1, 0},//up
        {-1, 0}//down
    };

    int rows;
    int columns;
    int minPrice;
    int maxPrice;

    public List<List<Integer>> highestRankedKItems(int[][] grid, int[] pricing, int[] start, int k) {

        rows = grid.length;
        columns = grid[0].length;
        minPrice = pricing[0];
        maxPrice = pricing[1];
        return breadthFirstSearch(grid, start, k);
    }

    public List<List<Integer>> breadthFirstSearch(int[][] grid, int[] start, int k) {

        Queue<Item> queue = new LinkedList<>();
        boolean[][] visited = new boolean[rows][columns];
        List<Item> foundItems = new ArrayList<>();

        Item firstItem = new Item(start[0], start[1]);
        firstItem.price = grid[start[0]][start[1]];
        firstItem.distanceFromStart = 0;

        visited[start[0]][start[1]] = true;
        queue.add(firstItem);

        while (!queue.isEmpty()) {

            Item current = queue.poll();

            if (foundItems.size() == k && foundItems.get(foundItems.size() - 1).distanceFromStart < current.distanceFromStart) {
                break;
            }

            if (isInPriceRange(current.price)) {
                foundItems.add(current);
            }

            for (int i = 0; i < moves.length; i++) {
                int new_r = current.row + moves[i][0];
                int new_c = current.column + moves[i][1];

                if (isInGrid(new_r, new_c) && !visited[new_r][new_c] && grid[new_r][new_c] != 0) {

                    Item item = new Item(new_r, new_c);
                    item.price = grid[new_r][new_c] != 1 ? grid[new_r][new_c] : -1;
                    item.distanceFromStart = current.distanceFromStart + 1;
                    queue.add(item);
                    visited[new_r][new_c] = true;
                }
            }
        }

        return sortAndReturnFirst_k_items(foundItems, k);
    }

    public List<List<Integer>> sortAndReturnFirst_k_items(List<Item> foundItems, int k) {

        Collections.sort(foundItems, compareItemRank());
        List<List<Integer>> highestRanked_K_Items = new ArrayList<>();
        int size = k > foundItems.size() ? foundItems.size() : k;
        for (int i = 0; i < size; i++) {
            highestRanked_K_Items.add(List.of(foundItems.get(i).row, foundItems.get(i).column));
        }
        return highestRanked_K_Items;
    }

    public Comparator compareItemRank() {

        Comparator com = (Comparator) (Object o1, Object o2) -> {
            Item item_01 = (Item) o1;
            Item item_02 = (Item) o2;

            if (item_01.distanceFromStart != item_02.distanceFromStart) {
                return item_01.distanceFromStart - item_02.distanceFromStart;
            }
            if (item_01.price != item_02.price) {
                return item_01.price - item_02.price;
            }
            if (item_01.row != item_02.row) {
                return item_01.row - item_02.row;
            }
            return item_01.column - item_02.column;
        };
        return com;
    }

    public boolean isInGrid(int r, int c) {
        return r >= 0 && r < rows && c >= 0 && c < columns;
    }

    public boolean isInPriceRange(int price) {
        return price >= minPrice && price <= maxPrice;
    }
}

class Item {

    int row;
    int column;
    int price;
    int distanceFromStart;

    public Item(int row, int column) {
        this.row = row;
        this.column = column;
    }
}
