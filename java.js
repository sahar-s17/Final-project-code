document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    const usernameInput = document.getElementById('username');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const fullnameError = document.getElementById('fullnameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const strengthRule = document.getElementById('strengthRule');
    const noPersonalRule = document.getElementById('noPersonalRule');
    const lengthRule = document.getElementById('lengthRule');
    const symbolRule = document.getElementById('symbolRule');

    const signupTab = document.getElementById('signupTab');
    const signinTab = document.getElementById('signinTab');

    signupTab.addEventListener('click', function () {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
    });

    signinTab.addEventListener('click', function () {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        alert('Sign In form will be available soon!');
    });

    function checkPassword() {
        const password = passwordInput.value;
        const fullname = fullnameInput.value.toLowerCase();
        const email = emailInput.value.toLowerCase().split('@')[0];

        const constraints = [strengthRule, noPersonalRule, lengthRule, symbolRule];
        constraints.forEach(constraint => {
            constraint.classList.remove('valid', 'invalid');
        });

        if (!password) {
            passwordError.textContent = '';
            strengthRule.textContent = 'Password Strength: Weak';
            return false;
        }

        const lengthValid = password.length >= 8;
        const symbolValid = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
        let noPersonalValid = true;

        if (fullname && fullname.length > 0) {
            const nameParts = fullname.split(' ');
            for (const part of nameParts) {
                if (part.length > 2 && password.toLowerCase().includes(part)) {
                    noPersonalValid = false;
                    break;
                }
            }
        }

        if (email && email.length > 0 && password.toLowerCase().includes(email)) {
            noPersonalValid = false;
        }

        if (lengthValid) {
            lengthRule.classList.add('valid');
        } else {
            lengthRule.classList.add('invalid');
        }

        if (symbolValid) {
            symbolRule.classList.add('valid');
        } else {
            symbolRule.classList.add('invalid');
        }

        if (noPersonalValid) {
            noPersonalRule.classList.add('valid');
        } else {
            noPersonalRule.classList.add('invalid');
        }

        const validCount = [lengthValid, symbolValid, noPersonalValid].filter(Boolean).length;
        let strengthText = 'Weak';

        if (validCount === 3) {
            strengthText = 'Strong';
            strengthRule.classList.add('valid');
        } else if (validCount === 2) {
            strengthText = 'Medium';
            strengthRule.classList.add('valid');
        } else {
            strengthRule.classList.add('invalid');
        }

        strengthRule.textContent = `Password Strength: ${strengthText}`;

        if (lengthValid && symbolValid && noPersonalValid) {
            passwordError.textContent = '';
            return true;
        } else {
            if (password.length > 0) {
                if (!lengthValid) {
                    passwordError.textContent = 'Password must be at least 8 characters';
                } else if (!symbolValid) {
                    passwordError.textContent = 'Password must contain a number or symbol';
                } else if (!noPersonalValid) {
                    passwordError.textContent = 'Password cannot contain your name or email';
                }
            } else {
                passwordError.textContent = '';
            }
            return false;
        }
    }

    function validateForm() {
        let isValid = true;

        usernameError.textContent = '';
        fullnameError.textContent = '';
        emailError.textContent = '';

        const username = usernameInput.value.trim();
        if (username.length > 0 && (username.length < 3 || username.length > 20)) {
            usernameError.textContent = 'Username must be 3-20 characters';
            isValid = false;
        } else if (!username) {
            isValid = false;
        }


        const fullname = fullnameInput.value.trim();
        if (fullname.length > 0 && fullname.split(' ').length < 2) {
            fullnameError.textContent = 'Please enter your full name';
            isValid = false;
        } else if (!fullname) {
            isValid = false;
        }

        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailPattern.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        } else if (!email) {
            isValid = false;
        }

        const passwordValid = checkPassword();
        if (!passwordValid) {
            isValid = false;
        }

        return isValid;
    }

    function updateSubmitButton() {
        submitBtn.disabled = !validateForm();
    }

    usernameInput.addEventListener('input', updateSubmitButton);
    fullnameInput.addEventListener('input', updateSubmitButton);
    emailInput.addEventListener('input', updateSubmitButton);
    passwordInput.addEventListener('input', updateSubmitButton);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            const formData = {
                username: usernameInput.value.trim(),
                fullname: fullnameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                timestamp: new Date().toLocaleString()
            };

            console.log('=== Form Submission Data ===');
            console.log('Username:', formData.username);
            console.log('Full Name:', formData.fullname);
            console.log('Email:', formData.email);
            console.log('Password:', formData.password);
            console.log('Submission Time:', formData.timestamp);
            console.log('===========================');

            successMessage.style.display = 'flex';

            submitBtn.disabled = true;

            setTimeout(() => {
                form.reset();

                usernameError.textContent = '';
                fullnameError.textContent = '';
                emailError.textContent = '';
                passwordError.textContent = '';

                [strengthRule, noPersonalRule, lengthRule, symbolRule].forEach(constraint => {
                    constraint.classList.remove('valid', 'invalid');
                });
                strengthRule.textContent = 'Password Strength: Weak';

                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';


                updateSubmitButton();
            }, 15000);
        } else {
            const missingFields = [];
            if (!usernameInput.value.trim()) missingFields.push('Username');
            if (!fullnameInput.value.trim()) missingFields.push('Full Name');
            if (!emailInput.value.trim()) missingFields.push('Email');
            if (!passwordInput.value) missingFields.push('Password');

            if (missingFields.length > 0) {
                alert('Please fill in all required fields:\n' + missingFields.join(', '));
            }
        }
    });
    updateSubmitButton();
});                