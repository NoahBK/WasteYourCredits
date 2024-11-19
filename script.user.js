// ==UserScript==
// @name        WasteYourCredits
// @author      NoahBK (https://github.com/NoahBK)
// @namespace   https://violentmonkey.github.io/get-it/
// @version     1.0
// @homepage    https://github.com/NoahBK
// @supportURL  https://github.com/NoahBK/WasteYourCredits/issues
// @downloadURL https://github.com/NoahBK/WasteYourCredits/raw/main/script.user.js
// @updateURL   https://github.com/NoahBK/WasteYourCredits/raw/main/script.user.js
// @description Auto clicker for slot machine w/ adjustable bet, stopping conditions and a start button
// @grant       none
// @match       https://materialize.is/bonus.php?action=slot

(function () {
    'use strict';

    // Create clickable image
    const clickableImage = document.createElement('img');
    clickableImage.src = 'https://i.ibb.co/FYWvXFW/Waste-Your-Credits-11-19-2024.png'; // Image URL
    clickableImage.alt = 'Start Auto-Gambling';
    clickableImage.style.height = '73.3335px'; // 5x the height of "Slot Machine" text size (14.6667px * 5)
    clickableImage.style.cursor = 'pointer';
    clickableImage.style.marginLeft = '10px'; // Add spacing from the Slot Machine text
    clickableImage.style.verticalAlign = 'middle'; // Align with the text
    clickableImage.style.position = 'relative';

    // Add click event to the image
    clickableImage.addEventListener('click', function () {
        startAutoGambling();
    });

    // Find the Slot Machine header and append the image
    const slotMachineHeader = document.querySelector('h2');
    if (slotMachineHeader) {
        slotMachineHeader.appendChild(clickableImage);
    }

    // Function to start auto gambling
    function startAutoGambling() {
        const betButton = document.querySelector('input[value="Bet"]');
        const leverButton = document.querySelector('#lever');
        const betAmountField = document.querySelector('#betamount');

        // Click Bet button until bet amount is 100
        function adjustBet() {
            const betAmount = parseInt(betAmountField.value, 10);
            if (betAmount !== 100) {
                betButton.click();
                setTimeout(adjustBet, 500); // Retry after 500ms
            } else {
                pullLever();
            }
        }

        // Pull the lever
        function pullLever() {
            leverButton.click();
            setTimeout(checkResult, 2000); // Check result after 2 seconds
        }

        // Check the result
        function checkResult() {
            const result = document.querySelector('#result');
            const resultText = result ? result.textContent : '';
            const winAmount = parseInt(resultText.match(/(\d+)/));

            if (winAmount >= 10000) {
                alert('You hit 10000 credits!');
                return; // Stop the gambling
            }

            // Continue if win amount is less than 10000
            setTimeout(adjustBet, 2000); // Wait 2 seconds before starting the next round
        }

        adjustBet(); // Start the betting adjustment
    }
})();
