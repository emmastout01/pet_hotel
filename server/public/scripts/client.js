console.log('js');
$(document).ready(readyNow);

function readyNow(){
    console.log('jq');
    getOwners();
    $('#ownerRegisterButton').on('click', ownerRegClick );
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
 for (var i = 0; i < usernameIn.length; i++) {
     var username = usernameIn[i];
     var firstName = username.firstName;
     var lastName = username.lastName;
     $('#usernameHere').append('<option>' + firstName + ' ' + lastName + '</option>');
 }
}