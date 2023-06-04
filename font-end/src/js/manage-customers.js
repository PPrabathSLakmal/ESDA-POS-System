const REST_API_URL = "http://localhost:8080/pos";
const txtIdElm = $("#txtId");
const txtNameElm = $("#txtName");
const txtAddressElm = $("#txtAddress");
const txtContactElm = $("#txtContact");
const btnSave = $("#btn-save-customer");
const btnNewCustomer = $("#btn-new-customer");
const tbodyElm = $("tbody");
const txtSearchElm = $("#txt-search-customer");
const allCustomerQuery = "";
let customerList =[];

const customerDetails = [txtIdElm, txtNameElm, txtAddressElm, txtContactElm];
// let customer = { name, address, contact}

btnNewCustomer.on('click',()=>{
    txtIdElm.val(`${getId()}`);
})
customerDetails.forEach(txt => {
    txt.addClass("animate__animated");
    txt.on('input',()=>{
        txt.removeClass("animate__shakeX is-invalid");
    })
});
getAllCustomers(allCustomerQuery);

btnSave.on('click', () => {
    if (!isValid()) return false;
    const customerJson = JSON.stringify({
        name: txtNameElm.val().trim(),
        address: txtAddressElm.val().trim(),
        contact: txtContactElm.val().trim()
    });
    const jqxhr = $.ajax(`${REST_API_URL}/customers`, {
        method: 'POST',
        contentType: 'application/json',
        data: customerJson
    });
    jqxhr.done(() => {
        resetForm("clearData");
        getAllCustomers(allCustomerQuery);
    })
    jqxhr.fail(() => {
    })
});
txtSearchElm.on('input',(eventData)=>{
    getAllCustomers(txtSearchElm.val().trim());
})
tbodyElm.on('click',(eventData)=>{
    if($(eventData.target).hasClass('delete')){
        const customerId = $(eventData.target).parents("tr").children("th").text();
        console.log(customerId)
        deleteCustomer(customerId);
    }
});

function deleteCustomer(customerId){
   const jqxhr = $.ajax(`${REST_API_URL}/customers?id=${customerId}`,{
        method: 'DELETE',
        contentType: 'application/x-www-form-urlencoded'
    })
    jqxhr.done(()=>{
        getAllCustomers(allCustomerQuery);
    });
    jqxhr.fail(()=>{});

}
function getAllCustomers(txtSearch){
    const jqxhr = $.ajax(`${REST_API_URL}/customers`,{
        method: 'GET',
        contentType: 'application/json',
        data: {q:txtSearch}
    });
    jqxhr.done(()=>{
        tbodyElm.empty();
        customerList = JSON.parse(jqxhr.responseText);
        customerList.forEach(customer => {
            tbodyElm.append(`
                  <tr>
                    <th scope="row">${customer.id}</th>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.contact}</td>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil edit" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi delete bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                        </svg>
                    </td>
                </tr>
            `);
        });
    });
    jqxhr.fail(()=>{});
}
function isValid() {
    const name = txtNameElm.val().trim();
    const address = txtAddressElm.val().trim();
    const contact = txtContactElm.val().trim();
    let validity = true;
    resetForm();
    if (!address) {
        validity = invalidate(txtAddressElm, "Address can not be empty");
    } else if (!/^.{3,}$/.test(address)) {
        validity = invalidate(txtAddressElm, "Invalid address");
    }
    if(!contact){
        validity = invalidate(txtContactElm, "Contact can not be empty");
    }else if (!/^\d{3}-\d{7}$/.test(contact)) {
        validity = invalidate(txtContactElm, "Invalid number");
    }
    if (!name){
        validity = invalidate(txtNameElm, "Name can not be empty");
    }else if (!/^[A-Za-z ]+$/.test(name)) {
        validity = invalidate(txtNameElm, "Invalid name");
    }

    return validity;

}

function resetForm(clearData) {
    customerDetails.forEach(txt => {
        txt.removeClass("animate__shakeX is-invalid");
        if (clearData) {
            txt.val('');
        }
    });
    if (clearData) txtNameElm.focus();
}

function invalidate(txt,msg){
    setTimeout(()=>txt.addClass("animate__shakeX is-invalid"),0);
    txt.trigger('select');
    txt.trigger('focus');
    txt.next().text(msg);
    return false;
}

function getId(){
    if (!customerList.length){
        txtIdElm.val("C001");
    }else {
       let lastId = customerList[customerList.length-1].id;
       let newId = lastId+1;
       return `C${newId.toString().padStart(3,'0')}`;

    }
}