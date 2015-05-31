var ladders = {
	8: 26,
	21:82,
	50:91,
	54:93,
	62:96,
	66:87,
	80:100
};

var snakes  = {
	44:19,
	46:5,
	48:9,
	52:11,
	55:7,
	59:17,
	64:36,
	69:33,
	73:1,
	83:19,
	92:51,
	95:24,
	98:28
}

function drawTable() {
	var $ladderImage  =$('#ladder-image'),
	cellWidth = $ladderImage.width()/10,
	cellHeight = $ladderImage.height()/10,
	myTableDiv = document.getElementById("tables-container"),
	table = document.createElement('TABLE'),
	tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);


	for (var i=9; i>=0; i--){
		var tr = document.createElement('TR');
		tableBody.appendChild(tr);
		if(i%2===0){
			for (var j=1; j<=10; j++){
				var td = document.createElement('TD'),
				$td = $(td),
				nodeId = i*10 + j;
				$td.width(cellWidth+'px');
				$td.height(cellHeight+'px')
				$td.attr('data-nodeId',nodeId+'');
				tr.appendChild(td);
			}
		}else{
			for (var j=10; j>0; j--){
				var td = document.createElement('TD'),
				$td = $(td),
				nodeId = i*10 + j;
				$td.width(cellWidth+'px');
				$td.height(cellHeight+'px')
				$td.attr('data-nodeId',nodeId+'');
				td.height=cellHeight;
				tr.appendChild(td);
			}
		}
	}
	myTableDiv && myTableDiv.appendChild(table);
	$(myTableDiv).width($ladderImage.width());
}
try{
	drawTable();
}catch(e){

}


var $number = $('#number'),
isMyturn = true,
$playerOne = $('#player-one'),
$playerTwo = $('#player-two'),
playerOnePosition = 0,
playerTwoPosition = 0,
$rows = $('#tables-container').find('tr');
$('#dice').on('click',function (argument) {
	var number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
	$number.text(number);
	playerOnePosition+=number;
	playerOnePosition = decidePosition(playerOnePosition,$playerOne);
	io.socket.get('/diceRolled', {number :number});

});

window.onPlay = function(data){
	playerTwoPosition+=data.number;
	decidePosition(playerTwoPosition,$playerTwo);
}

function decidePosition(position,$player){
	var positionChange = ladders[position] || snakes[position] || position;
	placeIcon($rows.find('[data-nodeId="'+position+'"]'),$player);
	setTimeout(function(){
		placeIcon($rows.find('[data-nodeId="'+positionChange+'"]'),$player);
	},1000);
	return positionChange;
}
function placeIcon(node,$player){
	var $node = $(node),
	adjustX = $node.width()/2,
	adjustY = $node.height()/2,
	positionX = $node.offset().left + adjustX, 
	positionY = $node.offset().top + adjustY;
	$player.css({top: positionY, left: positionX});

}


