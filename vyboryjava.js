document.addEventListener('DOMContentLoaded', () => {
    const MAX_CLICKS = 27000000;
    let remainingClicks = MAX_CLICKS;
    let party1Votes = 0;
    let party2Votes = 0;
    let selectedParty = null;

    const remainingClicksEl = document.getElementById('remaining-clicks');
    const party1CountEl = document.getElementById('party1-count');
    const party2CountEl = document.getElementById('party2-count');
    const party1Btn = document.getElementById('party1-btn');
    const party2Btn = document.getElementById('party2-btn');
    const clickableArea = document.querySelector('.clickable-area');

    // Function to save state to localStorage
    const saveState = () => {
        localStorage.setItem('remainingClicks', remainingClicks);
        localStorage.setItem('party1Votes', party1Votes);
        localStorage.setItem('party2Votes', party2Votes);
        localStorage.setItem('selectedParty', selectedParty);
    };

    // Function to load state from localStorage
    const loadState = () => {
        const storedRemaining = localStorage.getItem('remainingClicks');
        if (storedRemaining !== null) {
            remainingClicks = parseInt(storedRemaining, 10);
            party1Votes = parseInt(localStorage.getItem('party1Votes'), 10);
            party2Votes = parseInt(localStorage.getItem('party2Votes'), 10);
            selectedParty = localStorage.getItem('selectedParty');
        }
    };

    // Function to update the display
    const updateDisplay = () => {
        remainingClicksEl.textContent = remainingClicks.toLocaleString('ru-RU');
        party1CountEl.textContent = party1Votes.toLocaleString('ru-RU');
        party2CountEl.textContent = party2Votes.toLocaleString('ru-RU');
    };

    // Load state on page load
    loadState();
    updateDisplay();

    // Event listener for party buttons
    party1Btn.addEventListener('click', () => {
        selectedParty = 'party1';
        party1Btn.classList.add('active');
        party2Btn.classList.remove('active');
        saveState();
    });

    party2Btn.addEventListener('click', () => {
        selectedParty = 'party2';
        party2Btn.classList.add('active');
        party1Btn.classList.remove('active');
        saveState();
    });

    // Event listener for the clickable area
    clickableArea.addEventListener('click', () => {
        if (selectedParty && remainingClicks > 0) {
            if (selectedParty === 'party1') {
                party1Votes++;
            } else if (selectedParty === 'party2') {
                party2Votes++;
            }
            remainingClicks--;
            updateDisplay();
            saveState(); // Save state after each click
        } else if (!selectedParty) {
            alert('Пожалуйста, выберите партию!');
        } else if (remainingClicks <= 0) {
            alert('Все голоса уже отданы!');
        }
    });

    // Initial check for selected party to apply active class if it was saved
    if (selectedParty === 'party1') {
        party1Btn.classList.add('active');
    } else if (selectedParty === 'party2') {
        party2Btn.classList.add('active');
    }
});