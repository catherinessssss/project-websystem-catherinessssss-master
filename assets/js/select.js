var select = document.getElementsByTagName('select')[0];

if(select) {
    var value = select.dataset.value;
    for(var i = 0, length = select.options.length; i < length; i++) {
        if(select.options[i].value === value) {
            select.options[i].selected = true;
            break;
        }
    }
}


