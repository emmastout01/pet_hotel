console.log('js');
$(document).ready(readyNow);

var $userID;

function readyNow(){
    console.log('jq');
    
    $('#ownerRegisterButton').on('click', ownerRegClick );
    $('#petRegisterButton').on('click', petRegClick );
    $('#usernameHere').on('change', onOwnerChange);
    getOwners();
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
        $tr.append('<td>' + petData.first + ' ' + petData.last + '</td>');
        $tr.append('<td>' + petData.name + '</td>');
        $tr.append('<td>' + petData.breed + '</td>');
        $tr.append('<td>' + petData.color + '</td>');
        $('#petData').append($tr);
    }


}

function onOwnerChange(event){
    $userID = $(this).find(':selected').data('id');
    console.log('status change')
    console.log($userID);
}