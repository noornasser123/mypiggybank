document.addEventListener('DOMContentLoaded', function () {
    const feedbackForm = document.getElementById('feedbackForm');
    const thankYouMessage = document.getElementById('thankYouMessage');

    // Pre-fill hidden fields
    document.getElementById('dateField').value = new Date().toLocaleString();
    document.getElementById('deviceField').value = navigator.userAgent;

    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim() || "Anonymous",
            email: document.getElementById('email').value.trim() || "Not provided",
            rating: document.querySelector('input[name="rating"]:checked')?.value || "No rating",
            message: document.getElementById('message').value.trim(),
            date: document.getElementById('dateField').value,
            device: document.getElementById('deviceField').value
        };

        if (!formData.message) {
            alert('Please enter your feedback message');
            return;
        }

        // Save locally
        try {
            const feedbacks = JSON.parse(localStorage.getItem('piggyFeedback')) || [];
            feedbacks.push(formData);
            localStorage.setItem('piggyFeedback', JSON.stringify(feedbacks));
        } catch (error) {
            console.error('Error saving feedback locally:', error);
        }

        // Send to Formspree
        fetch(feedbackForm.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(feedbackForm)
        })
            .then(response => {
                if (response.ok) {
                    feedbackForm.style.display = 'none';
                    thankYouMessage.style.display = 'block';
                    feedbackForm.reset();
                } else {
                    console.warn('Formspree failed, using email fallback.');
                    sendEmailFallback(formData);
                }
            })
            .catch(error => {
                console.error('Error sending to Formspree:', error);
                sendEmailFallback(formData);
            });
    });

    function sendEmailFallback(feedback) {
        const subject = `New Piggy Feedback (${feedback.rating} stars)`;
        const body = `
Name: ${feedback.name}
Email: ${feedback.email}
Rating: ${feedback.rating}
Message: ${feedback.message}
---
Device: ${feedback.device}
Time: ${feedback.date}
        `;
        const mailtoLink = `mailto:nooralrawahi5@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink; // Open email client

        feedbackForm.style.display = 'none';
        thankYouMessage.style.display = 'block';
    }
});
