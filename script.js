// Simple Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        if(nav.style.display === 'flex') {
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '60px';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = 'white';
            nav.style.padding = '20px';
            nav.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        }
    });
});

// Money Health Score Calculator Logic
let currentStep = 1;
const formData = {
    income: 0,
    expenses: 0,
    emergency: 0,
    insurance: 0,
    emi: 0
};

function nextStep(step) {
    // Validation
    if (step === 2) {
        const inc = document.getElementById('income').value;
        const exp = document.getElementById('expenses').value;
        if (!inc || !exp) return alert("Please fill in all fields");
        formData.income = parseFloat(inc);
        formData.expenses = parseFloat(exp);
    }

    if (step === 3) {
        const emerg = document.getElementById('emergency').value;
        const ins = document.getElementById('insurance').value;
        if (emerg === '' || ins === '') return alert("Please fill in all fields (enter 0 if none)");
        formData.emergency = parseFloat(emerg);
        formData.insurance = parseFloat(ins);
    }

    // UI Transition
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

function prevStep(step) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

function calculateScore() {
    const emiVal = document.getElementById('emi').value;
    if (emiVal === '') return alert("Please enter EMI amount (0 if none)");
    formData.emi = parseFloat(emiVal);

    // Move to result step
    nextStep(4);
    
    // Simulate AI Processing Delay
    setTimeout(() => {
        const results = computeFinancialHealth(formData);
        displayResults(results);
    }, 1500);
}

function computeFinancialHealth(data) {
    let score = 0;
    let recs = [];

    // 1. Emergency Fund Logic (Should be 6x expenses)
    const monthsCovered = data.emergency / (data.expenses || 1);
    if (monthsCovered >= 6) {
        score += 30;
    } else {
        score += (monthsCovered / 6) * 30;
        recs.push(`<i class="fas fa-exclamation-circle text-red-500"></i> Your emergency fund is low. Target: ₹${data.expenses * 6}.`);
    }

    // 2. Debt Logic (EMI < 30% of Income)
    const debtRatio = data.emi / (data.income || 1);
    if (debtRatio <= 0.3) {
        score += 30;
    } else if (debtRatio > 0.5) {
        score += 0;
        recs.push(`<i class="fas fa-exclamation-triangle"></i> Debt Alert: Your EMIs are eating over 50% of your income.`);
    } else {
        score += 15;
        recs.push(`<i class="fas fa-info-circle"></i> Watch your debt. Try to prepay loans to reduce EMI burden.`);
    }

    // 3. Insurance Logic (Cover >= 10x Annual Income)
    const annualIncome = data.income * 12;
    const insuranceRatio = data.insurance / annualIncome;
    
    if (insuranceRatio >= 10) {
        score += 30;
    } else {
        score += (insuranceRatio / 10) * 30;
        recs.push(`<i class="fas fa-shield-alt"></i> Under-insured. You need a Term Plan of at least ₹${(annualIncome * 10 / 100000).toFixed(1)} Lakhs.`);
    }

    // Bonus points for taking the test
    score += 10;

    return {
        score: Math.min(Math.round(score), 100),
        recommendations: recs.length > 0 ? recs : [`<i class="fas fa-check-circle"></i> Excellent! Your financial foundation is rock solid.`]
    };
}

function displayResults(data) {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('result-content').style.display = 'block';
    
    // Animate Score
    const scoreEl = document.getElementById('score-value');
    let current = 0;
    const timer = setInterval(() => {
        current++;
        scoreEl.innerText = current;
        if (current >= data.score) clearInterval(timer);
    }, 20);

    // Color coding
    const circle = document.querySelector('.score-circle');
    if(data.score > 75) circle.style.background = '#10b981'; // Green
    else if(data.score > 50) circle.style.background = '#f59e0b'; // Yellow
    else circle.style.background = '#ef4444'; // Red

    // Recommendations
    const recBox = document.getElementById('recommendations');
    recBox.innerHTML = data.recommendations.map(r => `<div class="rec-item">${r}</div>`).join('');
}
