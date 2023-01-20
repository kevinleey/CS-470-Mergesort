# CS-470-Mergesort
### Project 1 
Given n unsorted integers, we want the top k integers. No other information is given other than 0 < k < n.

We will be comparing merge sort and quickselect to see which algorithm would be better to solve this interview question.

### Merge Sort Algorithm
The merge sort algorithm is a divide and conquer sorting algorithm. It divides an array into smaller arrays and sorts them.  Then, it merges the subarrays together to create one sorted array.  

Merge sort is a stable sorting algorithm and is effiecient for sorting datasets which are extremely large.

The time complexity for merge sort is O(nlogn).


### Quickselect Algorithm 
Quickselect was adapted from the quicksort algorithm that choses a pivot point and then moves all integers greater than the pivot to the left and all numbers less than the pivot to the right. Typically, this is done until the array of integers is sorted, however we adapted Quickselect to stop once the pivot number has the amount of numbers, we are looking for to the left of it. This allows for the top k elements to be returned in an unordered fashion but in a smaller time complexity than typically Quicksort and mergesort. The time complexity is O(n).

The quickselect algorithm uses the partition step of quick sort. 

The time complexity for quickselect is O(n).


### Comparison

Based on the problem given, quickselect is a better algorithm to use compared to mergesort.

Use the comparison.html to see the animated code we created to represent each of the algorithms.

### Group Members
Rachel Qualls, Navamin Leelarburanathanakoon, Sami Kellogg, Jade Cartolano

