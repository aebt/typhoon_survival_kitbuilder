// Progress Bar
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll('.kit-item');
    const progressBar = document.getElementById('progress-bar');
    const scoreText = document.getElementById('score-text');

    function updateProgress() {
        const totalItems = checkboxes.length;
        const checkedItems = document.querySelectorAll('.kit-item:checked').length;
        
        // Calculate percentage
        const percentage = Math.round((checkedItems / totalItems) * 100);
        
        // Update DOM elements
        progressBar.style.width = `${percentage}%`;
        scoreText.innerText = `${percentage}%`;

        // Change color based on readiness
        if (percentage === 100) {
            progressBar.classList.replace('bg-success', 'bg-info');
        } else {
            progressBar.classList.replace('bg-info', 'bg-success');
        }
    }

    // Attach event listeners to all checkboxes so it updates in real-time
    checkboxes.forEach(box => {
        box.addEventListener('change', updateProgress);
    });
});

// Supabase Integration
async function saveToDatabase() {
    const email = document.getElementById('userEmail').value;
    const scoreText = document.getElementById('score-text').innerText;
    
    // Clean the score data: remove the '%' and convert to a clean integer for the database
    const score = parseInt(scoreText.replace('%', ''));

    if (!email) {
        alert("Please enter a valid email to save.");
        return;
    }

    const SUPABASE_URL = 'https://okaobcxrekblsrqerxye.supabase.co'; 
    const SUPABASE_ANON_KEY = 'sb_publishable_5CsjwCGdd-tklDvTQIYuFg_39bnC0D_';

    // Update the button text to show a loading state
    const saveBtn = document.querySelector('#saveModal .btn-success');
    const originalBtnText = saveBtn.innerText;
    saveBtn.innerText = "Saving...";
    saveBtn.disabled = true;

    try {
        // The fetch() call to the Supabase REST API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/kit_saves`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' // Tells Supabase we don't need the data echoed back to save bandwidth
            },
            body: JSON.stringify({
                email: email,
                score: score
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Success Alert
        alert(`Success! Readiness score of ${score}% saved for ${email}.`);
        
        // Clean up the UI
        document.getElementById('userEmail').value = ''; // Clear the input field
        
        // Close the Bootstrap modal dynamically
        const modalElement = document.getElementById('saveModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }

    } catch (error) {
        console.error('Error saving to Supabase:', error);
        alert("There was an error saving your score. Check the console for details.");
    } finally {
        // Reset the button back to its original state
        saveBtn.innerText = originalBtnText;
        saveBtn.disabled = false;
    }
}