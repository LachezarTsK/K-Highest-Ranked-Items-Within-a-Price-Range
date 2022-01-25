# K-Highest-Ranked-Items-Within-a-Price-Range
Challenge at LeetCode.com. Tags: Graph, Breadth-First Search, Sorting.

        Since distance is the most important benchmark for this problem, overriding all other three criteria,
        there is little to gain from a priority queue that makes checks on all four criteria during the search.
       
        This is a breadth-first search, therefore, as soon as 'number of found items' >= 'k' and
        'distance of the last added item' < 'distance of the next item', we can stop the search.
        Then, sort the list 'foundItems' as per all four criteria and return the first 'k' items.
       
        Depending on the searched items and configuration in the shop, there might be some edge cases 
        where all items have to be searched. But in the majority of cases, the search will end well before that. 
        The edge cases do not justify the application of a priority queue for this particular problem.
