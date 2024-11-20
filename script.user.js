// ==UserScript==
// @name         WasteYourCredits
// @author       NoahBK (https://github.com/NoahBK)
// @namespace    https://violentmonkey.github.io/get-it/
// @version      1.1
// @homepage     https://github.com/NoahBK
// @supportURL   https://github.com/NoahBK/WasteYourCredits/issues
// @downloadURL  https://github.com/NoahBK/WasteYourCredits/raw/main/script.user.js
// @updateURL    https://github.com/NoahBK/WasteYourCredits/raw/main/script.user.js
// @description  Auto clicker for slot machines on supported trackers.
// @grant        none
// @match        https://materialize.is/bonus.php?action=slot
// @match        https://www.cathode-ray.tube/bonus.php?action=slot
// @match        https://www.empornium.sx/bonus.php?action=slot
// ==/UserScript==

(function () {
    'use strict';

    const url = window.location.href;

    if (url.includes('materialize.is')) {
        setupAutoGambling(
            'https://i.ibb.co/FYWvXFW/Waste-Your-Credits-11-19-2024.png',
            () => setupAutoBetting(100), // Bet amount: 100
            "Spins until you are out of credits or you hit 10,000+ for the Slot Machine Badge"
        );
    } else if (url.includes('cathode-ray.tube')) {
        setupAutoGambling(
            'https://i.ibb.co/ry88zsV/Waste-Your-Credits-11-20-2024.png',
            () => setupTimedAutoBetting(5000, 10), // Bet amount: 5000, duration: 10 mins
            "will spin the max bet amount for 10 minutes or until you are out of credits"
        );
    } else if (url.includes('empornium.sx')) {
        setupAutoGambling(
            'https://jerking.empornium.ph/images/2024/11/20/Waste-Your-Credits-11-20-2024.png',
            () => setupTimedAutoBetting(10000, 10), // Bet amount: 10000, duration: 10 mins
            "will spin the max bet amount for 10 minutes or until you are out of credits"
        );
    }

    // Function to set up the button and attach functionality
    function setupAutoGambling(imageURL, startFunction, hoverText) {
        const clickableImage = document.createElement('img');
        clickableImage.src = imageURL;
        clickableImage.alt = 'Start Auto-Gambling';
        clickableImage.title = hoverText;
        clickableImage.style.height = '73.3335px';
        clickableImage.style.cursor = 'pointer';
        clickableImage.style.marginLeft = '10px';
        clickableImage.style.verticalAlign = 'middle';
        clickableImage.style.position = 'relative';

        clickableImage.addEventListener('click', startFunction);

        const slotMachineHeader = document.querySelector('h2');
        if (slotMachineHeader) {
            slotMachineHeader.appendChild(clickableImage);
        }
    }

    // Function to set up auto betting for Materialize
    function setupAutoBetting(betAmount) {
        const betButton = document.querySelector('input[value="Bet"]');
        const leverButton = document.querySelector('#lever');
        const betAmountField = document.querySelector('#betamount');

        function adjustBet() {
            const currentBet = parseInt(betAmountField.value, 10);
            if (currentBet !== betAmount) {
                betButton.click();
                setTimeout(adjustBet, 500);
            } else {
                pullLever();
            }
        }

        function pullLever() {
            leverButton.click();
            setTimeout(checkResult, 2000);
        }

        function checkResult() {
            const result = document.querySelector('#result');
            const resultText = result ? result.textContent : '';
            const winAmount = parseInt(resultText.match(/(\d+)/));

            if (winAmount >= 10000) {
                alert('You hit 10000 credits!');
                return;
            }
            setTimeout(adjustBet, 2000);
        }

        adjustBet();
    }

    // Function to set up timed auto betting for Cathode Ray Tube and Empornium
    function setupTimedAutoBetting(betAmount, durationMinutes) {
        const startTime = Date.now();
        const duration = durationMinutes * 60 * 1000; // Convert minutes to milliseconds
        const betButton = document.querySelector('input[value="Bet"]');
        const leverButton = document.querySelector('#lever');
        const betAmountField = document.querySelector('#betamount');

        function adjustBet() {
            const currentBet = parseInt(betAmountField.value, 10);
            if (currentBet !== betAmount) {
                betButton.click();
                setTimeout(adjustBet, 500);
            } else {
                pullLever();
            }
        }

        function pullLever() {
            leverButton.click();
            setTimeout(checkElapsedTime, 2000);
        }

        function checkElapsedTime() {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= duration) {
                alert('Auto-gambling session complete!');
                return;
            }
            adjustBet();
        }

        adjustBet();
    }
})();
