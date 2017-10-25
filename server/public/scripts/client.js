console.log('js');
$(document).ready(readyNow);

var $userID;

function readyNow(){
    console.log('jq');
    
    $('#ownerRegisterButton').on('click', ownerRegClick );
    $('#petRegisterButton').on('click', petRegClick );
    $('#usernameHere').on('change', onOwnerChange);
    $('#petData').on('click', '#checkInBtn', checkInClick)
    $('#petData').on('click', '#checkOutBtn', checkOutClick)
    getOwners();
    getPets();
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
        console.log('added', response);
        getPets();
    }).fail(function(error){
        console.log('Failed: ', error);
    })
}

function getPets() {
    $.ajax({
        type: 'GET',
        url: '/pets',
    }).done(function(response){
        console.log('added', response);
        appendTable(response);
    }).fail(function(error){
        console.log('Failed: ', error);
    })
}

function appendTable(petsAndOwners) {
    for (var i = 0; i < petsAndOwners.length; i++) {
        var petData = petsAndOwners[i];
        console.log('pet data', petData);
        var $tr = $('<tr></tr>');
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

function onOwnerChange(event){
    $userID = $(this).find(':selected').data('id');
    console.log('status change')
    console.log($userID);
}