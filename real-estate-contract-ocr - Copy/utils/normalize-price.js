// Utility to normalize real estate prices

/**
 * Normalizes a price value from various formats to a standard number
 * @param {string} price - The raw price text
 * @return {string} - The normalized price
 */
function normalizePrice(price) {
  if (!price) return null;
  
  // Handle numeric prices
  if (/^[\d,.]+$/.test(price)) {
    // Remove commas and return as is
    return price.replace(/,/g, '');
  }
  
  // Handle text prices like "One Hundred Thousand"
  const wordToNumber = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90,
    'hundred': 100,
    'thousand': 1000,
    'million': 1000000,
    'billion': 1000000000
  };
  
  // Handle special case for "thousand" in real estate docs
  if (/thousand/i.test(price)) {
    // Extract the number before "thousand"
    const match = price.match(/(\w+)\s+thousand/i);
    if (match && match[1] && wordToNumber[match[1].toLowerCase()]) {
      return (wordToNumber[match[1].toLowerCase()] * 1000).toString();
    }
    
    // Handle "ninety-five thousand"
    const complexMatch = price.match(/(\w+)[-\s](\w+)\s+thousand/i);
    if (complexMatch && 
        complexMatch[1] && wordToNumber[complexMatch[1].toLowerCase()] && 
        complexMatch[2] && wordToNumber[complexMatch[2].toLowerCase()]) {
      const tens = wordToNumber[complexMatch[1].toLowerCase()];
      const ones = wordToNumber[complexMatch[2].toLowerCase()];
      if (tens % 10 === 0 && ones < 10) {
        return ((tens + ones) * 1000).toString();
      }
    }
    
    // If we can't parse it, return the original
    return price;
  }
  
  // If we don't know how to handle it, return as is
  return price;
}

module.exports = normalizePrice;
