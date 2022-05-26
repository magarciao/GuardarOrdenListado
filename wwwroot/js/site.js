// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const lista = document.getElementById('lista');

Sortable.create(lista, {
    animation: 150,
    chosenClass: "itemTomado",
    dragClass: "drag",

    onEnd: () => {

    },

    group: "lista-opciones",
    store: {
        set: (sortable) => {
            const orderItems = sortable.toArray();

            var data = {
                keyList: $("#lista").attr("keyList"),
                orderItems: orderItems.join(",")
            };

            $("#load").modal({
                show: true,
                keyboard: false,
                backdrop: 'static'
            });
            $("#load").modal('show');

            postData("/Home/ResgisterList", data)
                .then(data => {
                    if (data.Successful) {
                        //Código que se ejecuta si el procedimiento ha sido exitoso.
                    } else {
                        //Código que se ejecuta si el procedimiento ha fallado.
                    }
                })
                .catch(error => {
                    //Código que se ejecuta si la conexión con el servidor y el procedimiento han fallado.
                });

            $("#load").modal('hide');
        }
    }
});

async function postData(url = '', data = {}) {
    // Opciones por defecto estan marcadas con un *
    const dataResponse = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    if (!dataResponse.ok) {
        const message = dataResponse.status;
        throw new Error(message);
    }

    const response = await dataResponse.json();
    return response; // parses JSON response into native JavaScript objects
}