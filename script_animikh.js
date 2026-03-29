/* AI Money Mentor — Interactive Logic */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobClose = document.getElementById('mobClose');
    const mobLinks = document.querySelectorAll('.mob-link');

    const toggleNav = () => {
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    };

    hamburger?.addEventListener('click', toggleNav);
    mobClose?.addEventListener('click', toggleNav);
    mobLinks.forEach(link => link.addEventListener('click', toggleNav));

    // 2. Scroll Reveal
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 3. Score Modal / Simple Quiz Logic
    const scoreModal = document.getElementById('scoreModal');
    const openScoreBtn = document.getElementById('openScoreBtn');
    const closeScoreBtn = document.getElementById('closeScoreBtn');
    const quizContent = document.getElementById('quizContent');


    let currentStep = 0;

    const renderQuiz = (step) => {
        if (step >= quizSteps.length) {
            quizContent.innerHTML = `
                <div style="text-align:center; padding: 2rem;">
                    <h3 style="color:var(--gold); font-size:1.5rem; margin-bottom:1rem;">Calculating Your IQ...</h3>
                    <p style="color:var(--muted);">Our AI is analyzing your profile against 12,000 peer benchmarks.</p>
                    <div style="margin-top:2rem; color:var(--teal);">Result: 815/1000 (Excellent)</div>
                </div>
            `;
            return;
        }

        const data = quizSteps[step];
        quizContent.innerHTML = `
            <div class="sm-step-label">Step ${step + 1} of ${quizSteps.length}</div>
            <h3 class="sm-question">${data.q}</h3>
            <div class="sm-options">
                ${data.options.map(opt => `<button class="sm-option">${opt}</button>`).join('')}
            </div>
        `;

        document.querySelectorAll('.sm-option').forEach(btn => {
            btn.onclick = () => { 
                currentStep++;
                renderQuiz(currentStep);
            };
        });
    };

    openScoreBtn?.addEventListener('click', () => {
        currentStep = 0;
        renderQuiz(currentStep);
        scoreModal.classList.add('show');
    });

    closeScoreBtn?.addEventListener('click', () => {
        scoreModal.classList.remove('show');
    });

    // Close modal on background click
    scoreModal?.addEventListener('click', (e) => {
        if (e.target === scoreModal) scoreModal.classList.remove('show');
    });
    document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0, 0)`;
    });
});
});
