function minimumAbsDifference(nums) {
  const n = nums.length / 2;
  
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  const memo = {};

  function findMinDiff(index, sum, count) {
    if (count === 0) {
      return Math.abs((totalSum - sum) - sum);
    }
    
    if (index === nums.length) {
      return Infinity;
    }

    const memoKey = `${index}-${sum}-${count}`;
    if (memo[memoKey] !== undefined) {
      return memo[memoKey];
    }

    const include = findMinDiff(index + 1, sum + nums[index], count - 1);

    const exclude = findMinDiff(index + 1, sum, count);

    const minDiff = Math.min(include, exclude);

    memo[memoKey] = minDiff;

    return minDiff;
  }

  return findMinDiff(0, 0, n);
}

console.log(minimumAbsDifference([3, 9, 7, 3]));  
console.log(minimumAbsDifference([-36, 36]));  
console.log(minimumAbsDifference([2, -1, 0, 4, -2, -9]));  
