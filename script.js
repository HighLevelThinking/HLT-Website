$(document).ready(function () {

    $('#upload-button')
    .mouseenter(function () {
        $(this).css('background-color', 'blue').css('color', 'white');
    })
    .mouseleave(function () {
        $(this).css('background-color', 'white').css('color', 'black');
    })
    .click(function () {
        $(this).text('Uploading...');
    });

    $('#cancel-button')
    .mouseenter(function () {
        $(this).css('background-color', 'blue').css('color', 'white');
    })
    .mouseleave(function () {
        $(this).css('background-color', 'white').css('color', 'black');
    })
    .click(function () {
        $('#upload-button').text('Upload');
    })

    

});