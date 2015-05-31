function drawTable() {


	var $ladderImage  =$('#ladder-image'),
	cellWidth = $ladderImage.width()/10,
	cellHeight = $ladderImage.height()/10,
	myTableDiv = document.getElementById("tables-container"),
	table = document.createElement('TABLE'),
	tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	table.border='1';

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
				td.appendChild(document.createTextNode(nodeId));
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
				td.appendChild(document.createTextNode(nodeId));
				tr.appendChild(td);
			}
		}


	}
	myTableDiv.appendChild(table);
	$(myTableDiv).width($ladderImage.width());
}

drawTable();


var $number = $('#number'),
$playerOne = $('#player-one'),
playerOnePosition = 0,
playerTwoPosition = 0,
$rows = $('#tables-container').find('tr');


$('#dice').on('click',function (argument) {
	var number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
	$number.text(number);
	playerOnePosition+=number;
	playerOnePosition = decidePosition(playerOnePosition);
});

function decidePosition(position){
	var positionChange = ladders[position] || snakes[position] || position;
	placeIcon($rows.find('[data-nodeId="'+position+'"]'));
	setTimeout(function(){
		placeIcon($rows.find('[data-nodeId="'+positionChange+'"]'));
	},1000);
	return positionChange;
}
function placeIcon(node){
	var $node = $(node),
	positionX = $node.offset().left, 
	positionY = $node.offset().top;
	$playerOne.css({top: positionY, left: positionX});

}


var ladders = {
	8: 26,
	21:82,
	50:91,
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