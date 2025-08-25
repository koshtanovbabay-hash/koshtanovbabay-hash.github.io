document.addEventListener('DOMContentLoaded', () => {
    const totalVotesAvailable = 27000000;
    let votesRemaining = totalVotesAvailable;

    const parties = {
        'a': {
            name: 'ЕДИНЫЙ ТУМАН',
            votes: 0,
            element: document.getElementById('votes-party-a')
        },
        'b': {
            name: 'ЛДПТ',
            votes: 0,
            element: document.getElementById('votes-party-b')
        }
    };

    const votesRemainingElement = document.getElementById('votes-remaining');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const voteButtons = document.querySelectorAll('.vote-button');

    function updateDisplay() {
        votesRemainingElement.textContent = votesRemaining.toLocaleString();
        
        const progressPercentage = (totalVotesAvailable - votesRemaining) / totalVotesAvailable * 100;
        progressBarFill.style.width = `${progressPercentage}%`;

        for (const party in parties) {
            parties[party].element.textContent = parties[party].votes.toLocaleString();
        }
    }

    function saveState() {
        localStorage.setItem('votesRemaining', votesRemaining);
        localStorage.setItem('partyAVotes', parties.a.votes);
        localStorage.setItem('partyBVotes', parties.b.votes);
    }

    function loadState() {
        const savedVotesRemaining = localStorage.getItem('votesRemaining');
        const savedPartyAVotes = localStorage.getItem('partyAVotes');
        const savedPartyBVotes = localStorage.getItem('partyBVotes');

        if (savedVotesRemaining !== null) {
            votesRemaining = parseInt(savedVotesRemaining);
        }
        if (savedPartyAVotes !== null) {
            parties.a.votes = parseInt(savedPartyAVotes);
        }
        if (savedPartyBVotes !== null) {
            parties.b.votes = parseInt(savedPartyBVotes);
        }
    }

    function handleVote(partyId) {
        if (votesRemaining > 0) {
            votesRemaining--;
            parties[partyId].votes++;
            updateDisplay();
            saveState();
        } else {
            alert('Голоса закончились! Выборы завершены.');
        }
    }

    voteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const partyId = event.target.dataset.party;
            handleVote(partyId);
        });
    });

    // Initial load and display
    loadState();
    updateDisplay();
});