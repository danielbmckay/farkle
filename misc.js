// shuffles an array; returns it
function shuffle(array) {
    var j,
    	x,
    	i;

    for (var i = array.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }

    return array;
}