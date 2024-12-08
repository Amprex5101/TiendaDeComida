document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.card');
        let counterDiv = card.querySelector('.counter');

        if (!counterDiv) {
          
            counterDiv = document.createElement('div');
            counterDiv.classList.add('counter');

            
            const minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.classList.add('counter-button');

           
            const counterValue = document.createElement('span');
            counterValue.textContent = '1';
            counterValue.classList.add('counter-value');

            
            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.classList.add('counter-button');

            
            plusButton.addEventListener('click', function () {
                counterValue.textContent = parseInt(counterValue.textContent) + 1;
            });

           
            minusButton.addEventListener('click', function () {
                const currentValue = parseInt(counterValue.textContent);
                if (currentValue > 1) {
                    counterValue.textContent = currentValue - 1;
                } else {
                    counterDiv.remove(); 
                    button.style.display = 'block'; 
                }
            });

            
            counterDiv.appendChild(minusButton);
            counterDiv.appendChild(counterValue);
            counterDiv.appendChild(plusButton);

         
            card.appendChild(counterDiv);

           
            this.style.display = 'none';
        }
    });
});