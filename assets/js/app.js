var cl = console.log;

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`;
const POST_URL = `${BASE_URL}/products.json`

const productsArr = [];

const pName = document.getElementById("pName")
const pType = document.getElementById("pType")
const stock = document.getElementById("stock")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const tbody = document.getElementById("tbody")
const form = document.getElementById("form")
const spinner = document.getElementById("spinner")


//========================== CREATE ====================================
function createProduct(ele) {
    ele.preventDefault()

    let newProduct = {
        prodName: pName.value,
        prodType: pType.value,
        stock: stock.value,
    }
    let xhr = new XMLHttpRequest()
    showSpinner()
    xhr.open("POST", POST_URL)
    xhr.send(JSON.stringify(newProduct))
    // xhr.setRequestHeader("Content-Type", "application/json")
    // xhr.setRequestHeader("Auth", "JWT FROM LS")
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.stringify(xhr.response)

            let tr = document.createElement("tr");
            tr.id = res.name
            tr.innerHTML = ` <td>1</td>
                            <td> ${newProduct.prodName} </td>
                            <td> ${newProduct.prodType} </td>
                            <td> ${newProduct.stock} </td>
                            <td> <i role=button p-2 onClick="editProduct(this)" class="fa-solid fa-pen-to-square text-primary"></i> </td>
                            <td> <i role=button p-2 onClick="removeProduct(this)" class="fa-solid fa-trash text-danger"></i></td>`
            tbody.prepend(tr)
            setSrNumber()
            form.reset()
            hideSpinner()
            snackBar("Added!", "Product Added Successfully!!!")
        } else {
            hideSpinner()
            cl("Something went wrong")
        }
    }
}
//========================== READ ====================================
function fetchProducts() {
    let xhr = new XMLHttpRequest()
    showSpinner()
    xhr.open("GET", POST_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            for (const key in res) {
                res[key].id = key
                productsArr.unshift(res[key])
            }

            for (const key in res) {

                let result = ""
                result = `<tr id=${res[key].id}>
                            <td>1</td>
                            <td> ${res[key].prodName} </td>
                            <td> ${res[key].prodType} </td>
                            <td> ${res[key].stock} </td>
                            <td> <i role=button p-2 onClick="editProduct(this)" class="fa-solid fa-pen-to-square text-primary"></i> </td>
                            <td> <i role=button p-2 onClick="removeProduct(this)" class="fa-solid fa-trash text-danger"></i></td>
                        </tr>`

                tbody.innerHTML += result
            }
            setSrNumber()
            hideSpinner()
        } else {
            hideSpinner()
            cl("Something went wrong")
        }
    }
}
fetchProducts()
//========================== EDIT ====================================
function editProduct(ele) {
    let EDIT_ID = ele.closest("tr").id;
    localStorage.setItem("EDIT_ID", EDIT_ID)
    let EDIT_URL = `${BASE_URL}/products/${EDIT_ID}.json`;
    let xhr = new XMLHttpRequest()
    showSpinner()
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            pName.value = res.prodName
            pType.value = res.prodType
            stock.value = res.stock

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            hideSpinner()

        } else {
            hideSpinner()
            cl("Something went wrong")
        }
    }

}
//========================== Update ====================================
function updateProduct(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID")
    let UPDATE_URL = `${BASE_URL}/products/${UPDATE_ID}.json`
    let updatedObj = {
        prodName: pName.value,
        prodType: pType.value,
        stock: stock.value,
        id: UPDATE_ID
    }
    let xhr = new XMLHttpRequest()
    showSpinner()
    xhr.open("PATCH", UPDATE_URL)
    xhr.send(JSON.stringify(updatedObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            let getIndex = productsArr.findIndex(ele => ele.id === UPDATE_ID)
            productsArr[getIndex] = updatedObj

            document.getElementById(UPDATE_ID).innerHTML = `                            <td>1</td>
                            <td> ${updatedObj.prodName} </td>
                            <td> ${updatedObj.prodType} </td>
                            <td> ${updatedObj.stock} </td>
                            <td> <i role=button p-2 onClick="editProduct(this)" class="fa-solid fa-pen-to-square text-primary"></i> </td>
                            <td> <i role=button p-2 onClick="removeProduct(this)" class="fa-solid fa-trash text-danger"></i></td>`

            addBtn.classList.remove("d-none");
            updateBtn.classList.add("d-none")
            form.reset()
            hideSpinner()
            snackBar("Updated!", "Product Updated Successfully!!!")
        } else {
            hideSpinner()
            cl("Something went wrong")
        }
    }
}
//========================== Delete ====================================
function removeProduct(ele) {
    let DELETE_ID = ele.closest("tr").id;
    let DELETE_URL = `${BASE_URL}/products/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let xhr = new XMLHttpRequest()
            showSpinner()
            xhr.open("DELETE", DELETE_URL)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response);
                    let getIndex = productsArr.findIndex(ele => ele.id === DELETE_ID)
                    productsArr.splice(getIndex, 1)
                    ele.closest("tr").remove()
                    setSrNumber()
                    hideSpinner()
                    snackBar("Deleted!", "Product Delete Successfully")

                } else {
                    hideSpinner()
                    cl("Something went wrong")
                }
            }
        }
    });

}
function setSrNumber() {
    let td = [...document.querySelectorAll("#tbody tr")]
    td.forEach(((td, i) => td.querySelector("td").innerText = i + 1))

}
function showSpinner() {
    spinner.classList.remove("d-none")
}
function hideSpinner() {
    spinner.classList.add("d-none")
}
function snackBar(title, msg) {
    Swal.fire({
        title: title,
        text: msg,
        icon: "success"
    });
}

form.addEventListener("submit", createProduct)
updateBtn.addEventListener("click", updateProduct)





























