document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.card');
        let counterDiv = card.querySelector('.counter');
        const precioBase = parseFloat(card.querySelector('.precio-base').textContent);
        const precioTotalSpan = card.querySelector('.precio-total');

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

            // Actualizar precio cuando se aumenta la cantidad
            plusButton.addEventListener('click', function () {
                const newValue = parseInt(counterValue.textContent) + 1;
                counterValue.textContent = newValue;
                precioTotalSpan.textContent = `$${(precioBase * newValue).toFixed(2)}`;
            });

            // Actualizar precio cuando se disminuye la cantidad
            minusButton.addEventListener('click', function () {
                const currentValue = parseInt(counterValue.textContent);
                if (currentValue > 1) {
                    const newValue = currentValue - 1;
                    counterValue.textContent = newValue;
                    precioTotalSpan.textContent = `$${(precioBase * newValue).toFixed(2)}`;
                } else {
                    counterDiv.remove();
                    button.style.display = 'block';
                    card.querySelector('.agregar-carrito-container').style.display = 'none';
                    precioTotalSpan.textContent = `$${precioBase.toFixed(2)}`;
                }
            });

            counterDiv.appendChild(minusButton);
            counterDiv.appendChild(counterValue);
            counterDiv.appendChild(plusButton);

            card.appendChild(counterDiv);
            this.style.display = 'none';
            card.querySelector('.agregar-carrito-container').style.display = 'block';
        }
    });
});

function mostrarDatosProducto(boton) {
    const card = boton.closest('.card');
    const nombreProducto = card.querySelector('.nombre-producto').textContent;
    const precioTotal = card.querySelector('.precio-total').textContent;
    
    console.log('Nombre del producto:', nombreProducto);
    console.log('Precio total:', precioTotal);
}
