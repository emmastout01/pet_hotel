console.log('js');
$(document).ready(readyNow);

var $userID;
var toDeleteId;

function readyNow(){
    console.log('jq');
    
    $('#ownerRegisterButton').on('click', ownerRegClick );
    $('#petRegisterButton').on('click', petRegClick );
    $('#usernameHere').on('change', onOwnerChange);
    $('#petData').on('click', '#updateBtn', updatePets);
    $('#petData').on('click', '#checkInBtn', checkInClick);
    $('#petData').on('click', '#checkOutBtn', checkOutClick);
    $('#petData').on('click', '#deleteBtn', confirmDelete);
    $('#delete-modal').on('click', '.delete', deleteTablerow);
    getOwners();
    getPets();
}

function confirmDelete(){
    $('#delete-modal').modal();
    toDeleteId = $(this).closest('tr').data('id');
    console.log('id to delete', toDeleteId)
}

function deleteTablerow(){
    $('#delete-modal').modal('hide');
    $.ajax({
        type: 'DELETE',
        url: '/pets/' + toDeleteId
    }).done(function(response){
        $('tr[data-id=' + toDeleteId + ']').fadeOut(400, function(){
            $(this).remove();
        })
    })
}

function checkInClick(){
    $('#checkOutBtn').removeClass('hidden');
    $('#checkInBtn').addClass('hidden');
}

function checkOutClick(){
    $('#checkInBtn').removeClass('hidden');
    $('#checkOutBtn').addClass('hidden');
}

function ownerRegClick(){
    console.log('in saveOwner' );
    var ownerToSend = {
        firstName: $('#ownerFirst').val(),
        lastName: $('#ownerLast').val()
    }
    $.ajax({
        type: 'POST',
        url: '/owners',
        data: ownerToSend
    }).done(function(response){
        console.log('added', response);
        getOwners();
    }).fail(function(error){
        console.log('Failed: ', error);
    })
}

function getOwners() {
    $.ajax({
        type: 'GET',
        url: '/owners',
    }).done(function(response){
        console.log('added', response);
        appendOwners(response);
    }).fail(function(error){
        console.log('Failed: ', error);
    })
}

function appendOwners(usernameIn){
    $('#usernameHere').empty();
    $('#usernameHere').append('<option>Select Owner Name</option>')
    for (var i = 0; i < usernameIn.length; i++) {
     var username = usernameIn[i];
     var first = username.first;
     var last = username.last;
     $('#usernameHere').append('<option data-id ="' + username.id + '">' + first + ' ' + last + '</option>');
 }
}

function petRegClick() {
    console.log('pet button clicked');
    var petId;
    var petToSend = {
        owner_id: $userID,
        name: $('#petName').val(),
        color: $('#petColor').val(),
        breed: $('#petBreed').val()
    }
    console.log( 'user id', $userID);
    console.log(petToSend);
    $.ajax({
        type: 'POST',
        url: '/pets',
        data: petToSend
    }).done(function(response){
        console.log('added', response[0].id);
        petId = (response[0].id)
        console.log(typeof(petId));
        postPetID(petId);
    }).fail(function(error){
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
    }).done(function(response){
        console.log('added', response);
        console.log('pet id sent:', petIDToSend);
        getPets();
    }).fail(function(error){
        console.log('Failed: ', error);
    })
}

function getPets(){
    $.ajax({
        type: 'GET',
        url: '/pets'
    }).done(function(response){
        appendTable(response)
    }).fail(function(error){
        console.log('Failed:', error)
    })
}

function appendTable(petsAndOwners) {
    $('#petData').empty();
    for (var i = 0; i < petsAndOwners.length; i++) {
        var petData = petsAndOwners[i];
        console.log('pet data', petData);
        var $tr = $('<tr data-id="'+ i + '"></tr>');
        var updateBtn = `<button id="updateBtn" class="btn btn-info">Update</button>`;
        var deleteBtn = `<button id="deleteBtn" class="btn btn-danger"><span class="glyphicon glyphicon-trash"</span></button>`;
        var checkInBtn = `<button id="checkInBtn" class="btn btn-success">In</button>`;
        var checkOutBtn = `<button id="checkOutBtn" class="btn btn-success hidden">Out</button>`;
        $tr.append('<td>' + petData.first + ' ' + petData.last + '</td>');
        $tr.append('<td>' + petData.name + '</td>');
        $tr.append('<td>' + petData.breed + '</td>');
        $tr.append('<td>' + petData.color + '</td>');
        $tr.append('<td>' + updateBtn + '</td>');
        $tr.append('<td>' + deleteBtn + '</td>');
        $tr.append('<td>' + checkInBtn + checkOutBtn +'</td>');
        $('#petData').append($tr);
    }


}

function updatePets() {
    console.log('in updatePets');
}

function onOwnerChange(event){
    $userID = $(this).find(':selected').data('id');
    console.log('status change')
    console.log($userID);
}