console.log('js');
$(document).ready(readyNow);

var $userID;
var toDeleteId;

function readyNow() {
    console.log('jq');

    $('#ownerRegisterButton').on('click', ownerRegClick);
    $('#petRegisterButton').on('click', petRegClick);
    $('#petData').on('click', '#updateBtn', onEdit);
    $('#petData').on('click', '#checkInBtn', checkInClick);
    $('#petData').on('click', '#checkOutBtn', checkOutClick);
    $('#petData').on('click', '#deleteBtn', confirmDelete);
    $('#delete-modal').on('click', '.delete', deleteTablerow);
    $('#editBtn').on('click', updatePets)
    getOwners();
    getPets();
}


function confirmDelete() {
    $('#delete-modal').modal();
    toDeleteId = $(this).closest('tr').data('id');
    console.log('id to delete', toDeleteId);
}

function deleteTablerow(){
    $('#delete-modal').modal('hide');
    $.ajax({
        type: 'DELETE',
        url: '/visits/' + toDeleteId
    }).done(function(response){
        reallyDeleteItThisTime();
        })
    }

function reallyDeleteItThisTime() {
    $.ajax({
        type: 'DELETE',
        url: '/pets/' + toDeleteId
    }).done(function(response){
        $('tr[data-id=' + toDeleteId + ']').fadeOut(400, function(){
            $(this).remove();
        })
    })
}

function checkInClick() {
    $('#checkOutBtn').removeClass('hidden');
    $('#checkInBtn').addClass('hidden');
}

function checkOutClick() {
    $('#checkInBtn').removeClass('hidden');
    $('#checkOutBtn').addClass('hidden');
}

function ownerRegClick() {
    console.log('in saveOwner');
    var ownerToSend = {
        firstName: $('#ownerFirst').val(),
        lastName: $('#ownerLast').val()
    }
    $.ajax({
        type: 'POST',
        url: '/owners',
        data: ownerToSend
    }).done(function (response) {
        console.log('added', response);
        getOwners();
    }).fail(function (error) {
        console.log('Failed: ', error);
    })
}

function getOwners() {
    $.ajax({
        type: 'GET',
        url: '/owners',
    }).done(function (response) {
        console.log('added', response);
        appendOwners(response);
    }).fail(function (error) {
        console.log('Failed: ', error);
    })
}

function appendOwners(usernameIn) {
    $('#usernameSelector').empty();
    $('#usernameSelector').append('<option>Select Owner Name</option>')
    for (var i = 0; i < usernameIn.length; i++) {
        var username = usernameIn[i];
        var first = username.first;
        var last = username.last;
        $('#usernameSelector').append('<option value="' + username.id + '">' + first + ' ' + last + '</option>');
    }
}

function petRegClick() {
    console.log('pet button clicked');
    var petId;
    var petToSend = {
        owner_id: $('#usernameSelector').val(),
        name: $('#petNameIn').val(),
        color: $('#petColorIn').val(),
        breed: $('#petBreedIn').val()
    }
    console.log(petToSend);
    $.ajax({
        type: 'POST',
        url: '/pets',
        data: petToSend
    }).done(function (response) {
        console.log('added', response[0].id);
        petId = (response[0].id)
        console.log(typeof (petId));
        postPetID(petId);
    }).fail(function (error) {
        console.log('Failed: ', error);
    })
}

function updatePets() {
    var petToSend = {
        owner_id: $('#usernameSelector').val(),
        name: $('#petNameIn').val(),
        color: $('#petColorIn').val(),
        breed: $('#petBreedIn').val()
    }
    console.log(petToSend);
    $.ajax({
        type: 'PUT',
        url: '/pets/' + updatedPetId,
        data: petToSend
    }).done(function (response) {
        console.log('added', response[0].id);
        petId = (response[0].id)
        console.log(typeof (petId));
        postPetID(petId);
        $('#petRegisterButton').removeClass('hidden')
        $('#editBtn').addClass('hidden');
        $('#petRegisterButton').text('Add Pet');
    }).fail(function (error) {
        console.log('Failed: ', error);
    })
}

function postPetID(value) {
    var petIDToSend = {
        id: value
    }
    $.ajax({
        type: 'POST',
        url: '/visits',
        data: petIDToSend
    }).done(function (response) {
        console.log('added', response);
        console.log('pet id sent:', petIDToSend);
        getPets();
    }).fail(function (error) {
        console.log('Failed: ', error);
    })
}

function getPets() {
    $.ajax({
        type: 'GET',
        url: '/pets'
    }).done(function (response) {
        appendTable(response)
    }).fail(function (error) {
        console.log('Failed:', error)
    })
}

function appendTable(petsAndOwners) {
    $('#petData').empty();
    for (var i = 0; i < petsAndOwners.length; i++) {
        var petData = petsAndOwners[i];
        console.log('pet data', petData);
        var $tr = $('<tr data-id="' + petData.id + '"></tr>');
        console.log('pet id', petData)
        var updateBtn = `<button id="updateBtn" class="btn btn-info">Update</button>`;
        var deleteBtn = `<button id="deleteBtn" class="btn btn-danger"><span class="glyphicon glyphicon-trash"</span></button>`;
        var checkInBtn = `<button id="checkInBtn" class="btn btn-success">In</button>`;
        var checkOutBtn = `<button id="checkOutBtn" class="btn btn-danger hidden">Out</button>`;
        $tr.append('<td>' + petData.first + ' ' + petData.last + '</td>');
        $tr.append('<td>' + petData.name + '</td>');
        $tr.append('<td>' + petData.breed + '</td>');
        $tr.append('<td>' + petData.color + '</td>');
        $tr.append('<td>' + updateBtn + '</td>');
        $tr.append('<td>' + deleteBtn + '</td>');
        $tr.append('<td>' + checkInBtn + checkOutBtn + '</td>');
        $tr.data('pet', petData);
        $('#petData').append($tr);
    }
}

var updatedPetId;
function onEdit() {
    var pet = $(this).closest('tr').data('pet');
    updatedPetId = pet.pet_id;
    console.log(pet);
    $('#usernameSelector').val(pet.owner_id);
    $('#petNameIn').val(pet.name);
    $('#petColorIn').val(pet.color);
    $('#petBreedIn').val(pet.breed);
    $('#petRegisterButton').text('Edit Mode');
    $('#petRegisterButton').addClass('hidden');
    $('#editBtn').removeClass('hidden');
}