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
$player-one = $('#playre-one'),
playerOnePosition = 0,
playerTwoPosition = 0,
$rows = $('#tables-container').find('tr');


$('#dice').on('click',function (argument) {
	var number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
	$number.text(number);
	playerOnePosition+=number;
	placeIcon($rows.find('[data-nodeId="'+number+'"]'));
});

function placeIcon(node){
	var $node = $(node),
	positionX = $node.offset().left, 
	positionY = $node.offset().top;


}