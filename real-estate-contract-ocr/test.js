// Test script for Real Estate Contract OCR Extractor
// This script can be used to test the extraction functionality on sample text

const fs = require('fs');
const path = require('path');
const { extractKeyInfo } = require('./index.js');

// Sample text from a real estate contract
const sampleText = `
PURCHASE AND SALE CONTRACT FOR REAL PROPERTY 
PLAIN ENGLISH FORM APPROVED BY THE ELMIRA-CORNING REGIONAL BOARD OF REALTORS®, INC. FOR USE BY ITS 
MEMBERS. THIS IS A LEGAL DOCUMENT; SIGNING THIS PURCHASE OFFER GIVES RISE TO BINDING LEGAL 
RESPONSIBILITIES. IF NOT UNDERSTOOD, WE RECOMMEND YOU SEEK LEGAL ADVICE BEFORE SIGNING. 

Seller Name                                     Buyer Name
128, Long Drive, Short Len Chikago 60601       56, Modi Palace, 56 Inch Road Indraprasta, Bharat 110000
SELLER(S)                                       BUYER(S) 

1. PROPERTY DESCRIPTION:
Property known as 456, Boring Drive, Nice Road, Chicago 60606 in the Springfield, IL (City) (Village) of Springfield, State of
New York, also known as Tax Map No._____________________________________ Deed, Liber ______, Page _______, County
of ___________________, including all buildings and any other improvements and all rights which SELLER has in or to the
property. Approximate lot size: 2.12 Acres ________ Check if Applicable: [___] more detailed description attached

2. PRICE AND HOW IT WILL BE PAID: The purchase price is $ Ninety FIve Thousand and Ninety Seven ONLY. BUYER shall
receive credit at closing for any deposit made hereunder. The balance of the purchase price shall be paid as follows: [___] (a) All
cash, bank check, or certified check at closing. BUYER states that no financing is needed to complete this transaction.
`;

// Test extraction
console.log("Testing extraction with sample text");
console.log("===================================");

const result = extractKeyInfo(sampleText, "sample.pdf");
console.log(JSON.stringify(result, null, 2));

// Check if the extraction worked as expected
const validate = () => {
  let issues = 0;
  
  if (!result.buyerName) {
    console.log("❌ Failed to extract buyer name");
    issues++;
  } else {
    console.log(`✅ Extracted buyer name: ${result.buyerName}`);
  }
  
  if (!result.sellerName) {
    console.log("❌ Failed to extract seller name");
    issues++;
  } else {
    console.log(`✅ Extracted seller name: ${result.sellerName}`);
  }
  
  if (!result.propertyAddress) {
    console.log("❌ Failed to extract property address");
    issues++;
  } else {
    console.log(`✅ Extracted property address: ${result.propertyAddress}`);
  }
  
  if (!result.price) {
    console.log("❌ Failed to extract price");
    issues++;
  } else {
    console.log(`✅ Extracted price: ${result.price}`);
  }
  
  return issues === 0;
};

const success = validate();

console.log("\nTest result:");
console.log(success ? "✅ All tests passed!" : "❌ Some tests failed!");
