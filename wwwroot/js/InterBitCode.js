//Versión: 1.0.0

function ibc_DateFormat(date, sumDays = 0) {
    var startDate = new Date(date);
    startDate.setDate(startDate.getDate() + sumDays + 1);

    return `${startDate.getFullYear()}-${TwoDigits(startDate.getMonth() + 1)}-${TwoDigits(startDate.getDate())}`
}

function TwoDigits(number) {
    return (number > 9 ? number : "0" + number);
}

function ValidDataForm() {
    var passValid = true;

    //Si hay un span de error activo, lo elimina.
    document.querySelectorAll("[id^=err-]").forEach((item, index) => {
        item.remove();
    });

    document.querySelectorAll("[valid-data-id]").forEach((item, index) => {
        //Lee el nombre del campo a validar
        var itemName = item.getAttribute("valid-data-id")

        //Esta validación se hace por que algunos elementos no tienen tagname, como por ejemplo los Checkbox.
        if (!item.hasAttribute("valid-data-type")) {
            //Si es un input desmarca del error.
            if (document.getElementById(itemName).tagName == "INPUT") {
                document.getElementById(itemName).classList.remove("input-validation-error");
            }
        }

        if (item.hasAttribute("valid-data-type")) {
            switch (item.getAttribute("valid-data-type")) {
                case "chkbox":
                    var NoEmpty = true;
                    document.querySelectorAll('[valid-data-chkbox="' + itemName + '"]').forEach((itemcb, index) => {
                        if (NoEmpty) {
                            if (itemcb.checked) {
                                NoEmpty = false;
                            }
                        }
                    });
                    if (NoEmpty) {
                        showValidError(item, itemName, item.getAttribute("valid-data-noempty"));
                        passValid = false;
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (document.getElementById(itemName).tagName) {
                case "INPUT":
                    //Valida el tipo de input
                    switch (document.getElementById(itemName).getAttribute("type")) {
                        case "text":
                            //Valida si el campo debe contener un valor.
                            if (item.hasAttribute("valid-data-noempty")) {
                                if (document.getElementById(itemName).value.length == 0) {
                                    document.getElementById(itemName).classList.add("input-validation-error");
                                    showValidError(item, itemName, item.getAttribute("valid-data-noempty"));
                                    passValid = false;
                                }
                            }

                            //Valida si el texto está limitado en el campo
                            if (item.hasAttribute("valid-data-max")) {
                                var param = item.getAttribute("valid-data-max").split("|")
                                if (document.getElementById(itemName).value.length > parseInt(param[0])) {
                                    document.getElementById(itemName).classList.add("input-validation-error");
                                    showValidError(item, itemName, param[1]);
                                    passValid = false;
                                }
                            }

                            break;
                        case "date":
                            //Valida si el campo debe contener un valor.
                            if (item.hasAttribute("valid-data-noempty")) {
                                if (document.getElementById(itemName).value.length == 0) {
                                    document.getElementById(itemName).classList.add("input-validation-error");
                                    showValidError(item, itemName, item.getAttribute("valid-data-noempty"));
                                    passValid = false;
                                }
                            }

                            //Valida si la fecha no es menor que la fecha de otro elemento
                            if (item.hasAttribute("date-max-id")) {
                                var param = item.getAttribute("date-max-id").split("|")
                                //Compara las fechas
                                var f1 = document.getElementById(itemName).value.substring(0, 4) + document.getElementById(itemName).value.substring(5, 7) + document.getElementById(itemName).value.substring(8);
                                var f2 = document.getElementById(param[0]).value.substring(0, 4) + document.getElementById(param[0]).value.substring(5, 7) + document.getElementById(param[0]).value.substring(8);
                                if (f1 >= f2) {
                                    document.getElementById(param[0]).classList.add("input-validation-error");
                                    showValidError(item, param[0], param[1]);
                                    passValid = false;
                                }
                            }

                            break;
                        default:
                            // code block
                            break;
                    }
                    break;
                case "SELECT":
                    //Valida si la lista desplegable debe tener un item seleccionado.
                    if (item.hasAttribute("valid-data-noempty")) {
                        if (document.getElementById(itemName).value < 1) {
                            showValidError(item, itemName, item.getAttribute("valid-data-noempty"));
                            passValid = false;
                        }
                    }
                    break;
                case "TEXTAREA":
                    //Valida si el campo debe contener un valor.
                    if (item.hasAttribute("valid-data-noempty")) {
                        if (document.getElementById(itemName).value.length == 0) {
                            showValidError(item, itemName, item.getAttribute("valid-data-noempty"));
                            passValid = false;
                        }
                    }

                    //Valida si el texto está limitado en el campo
                    if (item.hasAttribute("valid-data-max")) {
                        var param = item.getAttribute("valid-data-max").split("|")
                        if (document.getElementById(itemName).value.length > parseInt(param[0])) {
                            showValidError(item, itemName, param[1]);
                            passValid = false;
                        }
                    }
                    break;
                default:
                    // code block
                    break;
            }
        }
    });

    return passValid;
}

function showValidError(item, itemName, message) {
    //Activa el error
    var node = document.createElement("span");
    node.id = "err-" + itemName;
    node.classList.add("text-danger");
    node.innerHTML = message;
    item.appendChild(node);
}

function ibc_SelectAll(elmnt) {
    var lstchkbox = document.querySelectorAll('[valid-data-chkbox="' + elmnt.getAttribute("valid-data-chkbox") + '"][ibc-selectall="child"]');

    if (elmnt.getAttribute("ibc-selectall") == "father") {
        lstchkbox.forEach((item, index) => {
            item.checked = elmnt.checked;
        });
    } else {
        var allChecked = true;
        lstchkbox.forEach((item, index) => {
            if (allChecked) {
                if (!item.checked) {
                    allChecked = false;
                }
            }
        });
        document.querySelector('[valid-data-chkbox="' + elmnt.getAttribute("valid-data-chkbox") + '"][ibc-selectall="father"]').checked = allChecked;
    }
}

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