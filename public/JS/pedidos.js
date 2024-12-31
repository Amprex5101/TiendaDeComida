async function imprimirPedido(pedidoId) {
    try {
        const response = await fetch(`/pedidos/Ventas/pedido/${pedidoId}`);
        const pedido = await response.json();

        let contenidoVentana = `
            <html>
            <head>
                <title>Detalle del Pedido</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .detalle-pedido { margin-bottom: 20px; }
                    .producto { margin: 10px 0; }
                    .total { font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Detalle del Pedido</h1>
                    <p>Fecha: ${new Date(pedido.fecha).toLocaleDateString()}</p>
                    <p>Cliente: ${pedido.usuario}</p>
                </div>
                <div class="detalle-pedido">
                    <h2>Productos:</h2>
                    ${pedido.productos.map(prod => `
                        <div class="producto">
                            ${prod.nombre_producto} - 
                            Cantidad: ${prod.cantidad_producto} - 
                            Precio: $${prod.precio_base_producto}
                        </div>
                    `).join('')}
                </div>
                <div class="total">
                    Total: $${pedido.total.toFixed(2)}
                </div>
            </body>
            </html>
        `;

        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(contenidoVentana);
        ventanaImpresion.document.close();
        ventanaImpresion.print();

    } catch (error) {
        console.error('Error al imprimir:', error);
        alert('Error al generar la impresión');
    }
}
