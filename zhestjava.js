document.addEventListener('DOMContentLoaded', () => {
    const totalClicks = 27000000;
    let remainingClicks = totalClicks;
    let currentClicks = 0;
    let selectedParty = null;

    const remainingClicksEl = document.getElementById('remaining-clicks');
    const currentClicksEl = document.getElementById('current-clicks');
    const clickerButton = document.getElementById('clicker-button');
    const partyCards = document.querySelectorAll('.party-card');
    const votingSection = document.querySelector('.voting-section');
    const resetButton = document.getElementById('reset-button');
    const progressBar = document.getElementById('progress');

    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem('voteData'));
    if (savedData) {
        remainingClicks = savedData.remainingClicks;
        currentClicks = savedData.currentClicks;
        selectedParty = savedData.selectedParty;
        updateDisplay();
        if (selectedParty) {
            document.querySelector(`[data-party="${selectedParty}"]`).classList.add('selected');
            document.querySelector('.party-selection').style.display = 'none';
            votingSection.classList.remove('hidden');
        }
    } else {
        updateDisplay();
    }

    // Save data to localStorage
    function saveData() {
        const data = {
            remainingClicks: remainingClicks,
            currentClicks: currentClicks,
            selectedParty: selectedParty
        };
        localStorage.setItem('voteData', JSON.stringify(data));
    }

    // Update the visual display
    function updateDisplay() {
        remainingClicksEl.textContent = remainingClicks.toLocaleString('ru-RU');
        currentClicksEl.textContent = currentClicks.toLocaleString('ru-RU');

        // Update progress bar
        const progressPercentage = (currentClicks / totalClicks) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Handle party selection
    partyCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove 'selected' class from all cards
            partyCards.forEach(c => c.classList.remove('selected'));
            
            // Add 'selected' class to the clicked card
            card.classList.add('selected');
            selectedParty = card.dataset.party;

            // Animate transition to voting section
            setTimeout(() => {
                document.querySelector('.party-selection').style.display = 'none';
                votingSection.classList.remove('hidden');
            }, 500);
        });
    });

    // Handle button click
    clickerButton.addEventListener('click', () => {
        if (remainingClicks > 0) {
            remainingClicks--;
            currentClicks++;
            updateDisplay();
            saveData();
        } else {
            alert('Голоса закончились!');
        }
    });

    // Handle reset button
    resetButton.addEventListener('click', () => {
        const confirmReset = confirm('Вы уверены, что хотите сбросить прогресс?');
        if (confirmReset) {
            remainingClicks = totalClicks;
            currentClicks = 0;
            selectedParty = null;
            updateDisplay();
            localStorage.removeItem('voteData');
            document.querySelector('.party-selection').style.display = 'flex';
            votingSection.classList.add('hidden');
            partyCards.forEach(c => c.classList.remove('selected'));
        }
    });
});