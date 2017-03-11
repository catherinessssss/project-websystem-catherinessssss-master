var div = document.getElementById('bs-navbar-collapse');

div.addEventListener('click', function(e) {
    var target = e.target,
        isActive = target.parentElement.className === 'active';
    if(isActive) {
        return;
    }

    div.getElementsByClassName('active')[0].className = '';

    e.target.parentElement.className = 'active';
});