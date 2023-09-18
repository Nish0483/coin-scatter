import React, { useState } from 'react';
import './App.css';

const Disperse = () => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [duplicatesExist, setDuplicatesExist] = useState(false);
  const [showButtons, setShowButtons] = useState(false); // Control the visibility of buttons
  const [duplicateAddresses, setDuplicateAddresses] = useState([]);
  const [showInstructions, setShowinstructions] = useState(true);

 
const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
    setDuplicatesExist(false); 
  };

  const handleNext = () => {      // All checks start after clicking on the Next button
    processInput();
    setShowinstructions(false) ;
    setShowButtons(true);
  };

  const handleKeepFirstEntry = () => {
    processOperation(false);
  };

  const handleCombineBalances = () => {
    processOperation(true);
  };

  const processInput = () => {
    try {
      const lines = inputText.split('\n');
      const newMapping = {};
      const duplicates = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [address, amount] = line.trim().split(' ');

        if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {          //eth address basic check
          throw new Error(`Invalid Ethereum address: ${address} at line ${i + 1}`);
        }

        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          throw new Error(`Invalid amount: ${amount}`);
        }

        if (!newMapping[address]) {
          newMapping[address] = parsedAmount;

        } else {
          duplicates.push({ lineNumber: i + 1, address }); // Push an object with lineNumber and address
        }
      }

      setDuplicateAddresses(duplicates); 
      setDuplicatesExist(duplicates.length > 0); // Set duplicatesExist based on whether duplicates were found
    } catch (error) {
      setError(`Error: ${error.message}`);
      setShowButtons(false); 
    }
  };

  const processOperation = (combineDuplicates) => {
    try {
      const lines = inputText.split('\n');
      const newMapping = {};

      for (const line of lines) {
        const [address, amount] = line.trim().split(' ');
        const parsedAmount = parseFloat(amount);
        if (combineDuplicates) {
          // Combine balances for duplicate addresses
          if (newMapping[address]) {
            newMapping[address] += parsedAmount;
          } else {
            newMapping[address] = parsedAmount;
          }
        } else {
          // Keep only the first entry for each unique address
          if (!newMapping[address]) {
            newMapping[address] = parsedAmount;
          }
        }
      }

      setDuplicatesExist(false);


    // Update the input text field with the modified content
    const formattedLines = [];
    for (const address in newMapping) {
      formattedLines.push(`${address} ${newMapping[address]}`);
    }
    setInputText(formattedLines.join('\n'));


        } catch (error) {
          setError(`Error: ${error.message}`);
        }
      };

  return (
    <div>
      <h2>COIN SCATTER</h2>

      <textarea
        rows="10"
        cols="60"
        placeholder="Enter Ethereum addresses and amounts..."
        value={inputText}
        
        onChange={handleInputChange}
        className="text-field"
      />
      <br></br>
      {(showInstructions) && 
      <div className='container'>
      
      <p>address and amount separated by a space ' ' . press enter for new line </p>
      </div>}
      <button className='next' onClick={handleNext}>Next</button>
      
      {duplicatesExist && showButtons && (
        <div>
          <span className='duplicates'> Duplicate entry found ! </span>
          <br></br>
          <ul>
            <br></br>
            {duplicateAddresses.map((addressInfo, index) => (
        <li key={index}>
           {addressInfo.address} <br></br>at line: {addressInfo.lineNumber}
        </li>
      ))}
          </ul>
          <span className='click' onClick={handleKeepFirstEntry}>Keep Only First Entry</span>|
          <span className='click' onClick={handleCombineBalances}>Combine Balances</span>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Disperse;
