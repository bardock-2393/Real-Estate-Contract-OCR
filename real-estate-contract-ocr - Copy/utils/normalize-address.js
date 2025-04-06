// Utility to normalize real estate property addresses

/**
 * Normalizes a property address by standardizing format and abbreviations
 * @param {string} address - The raw property address
 * @return {string} - The normalized address
 */
function normalizeAddress(address) {
  if (!address) return null;
  
  // Trim whitespace and normalize spaces
  let normalized = address.trim().replace(/\s+/g, ' ');
  
  // Standardize common abbreviations
  const abbreviations = {
    'avenue': 'Ave',
    'boulevard': 'Blvd',
    'circle': 'Cir',
    'court': 'Ct',
    'drive': 'Dr',
    'expressway': 'Expy',
    'heights': 'Hts',
    'highway': 'Hwy',
    'junction': 'Jct',
    'lane': 'Ln',
    'parkway': 'Pkwy',
    'place': 'Pl',
    'plaza': 'Plz',
    'road': 'Rd',
    'square': 'Sq',
    'street': 'St',
    'terrace': 'Ter',
    'trail': 'Trl',
    'turnpike': 'Tpke',
    'way': 'Way'
  };
  
  // Replace full words with abbreviations
  Object.entries(abbreviations).forEach(([full, abbr]) => {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    normalized = normalized.replace(regex, abbr);
  });
  
  // Handle apartment/unit numbers
  normalized = normalized.replace(/(\s+apt\.?|\s+apartment|\s+unit|\s+#)\s*(\w+)/gi, ' #$2');
  
  // Standardize commas between address parts
  normalized = normalized.replace(/\s*,\s*/g, ', ');
  
  // Handle ZIP codes
  normalized = normalized.replace(/(\d{5})-?(\d{4})?/g, (match, zip5, zip4) => {
    return zip4 ? `${zip5}-${zip4}` : zip5;
  });
  
  // Handle cardinal directions
  const directions = {
    'north': 'N',
    'south': 'S',
    'east': 'E',
    'west': 'W',
    'northeast': 'NE',
    'northwest': 'NW',
    'southeast': 'SE',
    'southwest': 'SW'
  };
  
  Object.entries(directions).forEach(([full, abbr]) => {
    // Only replace at word boundaries
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    normalized = normalized.replace(regex, abbr);
  });
  
  return normalized;
}

module.exports = normalizeAddress;
