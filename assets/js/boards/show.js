var game = (function (){
	var $number,
	$rows,boardId,userId ;
	var drawTable = function() {
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
		$(myTableDiv).html('');
		myTableDiv && myTableDiv.appendChild(table);
		$(myTableDiv).width($ladderImage.width());
		$number = $('#number'),
		$rows = $('#tables-container').find('tr');	
		$(document).trigger('triggerRoom');
	}
	var rollDice = function (argument) {
		io.socket.post('/diceRolled',{id: $('#board-page').data('id')});
	}
	var joinGame = function() {
		io.socket.post('/joinGame',{id: boardId },function serverResponded (body, JWR) {
			window.isMyturn = false;
			console.log('Sails responded with: ', body);
			if(body.error){
				$('#error-modal').find('#message').html(body.error);
				$('#error-modal').foundation('reveal', 'open');
			}else{
				$('#joinedModal').foundation('reveal', 'open');
			}
		});
	}
	var init =  function() {
		boardId = $('#board-page').data('id');

		$("#ladder-image").one("load", function() {
			drawTable();
		})
		
		bindEvents();
	}
	var showPlayerPanel = function() {
		var $scoreBoard = $('#score-board'),
		isOpen = $scoreBoard.hasClass('opened');
		if(isOpen){
			$scoreBoard.removeClass('opened')
		}else{
			$scoreBoard.addClass('opened')
		}
	}
	var bindEvents = function() {
		$('body').off('click','#dice').on('click','#dice',rollDice);
		$('body').off('click','#join').on('click','#join',joinGame);
		$('body').off('click','#show-button').on('click','#show-button',showPlayerPanel);
	}
	var updatePlayersList = function(data) {
		var board = data.board;
		App.render('players_template','players_target',board);
		App.render('players_icons_template','players_icons_target',board);
		var $scoreBoard = $('#score-board'),
		$players = $('#score-board').find('[data-user-id]'),
		$playerPositions = $('#players_icons_target').find('[data-user-id]');
		for (var  key in board.metaData) {
			var player = board.metaData[key],
			$player = $players.filter('[data-user-id="'+key+'"]'),
			$playerPosition = $playerPositions.filter('[data-user-id="'+key+'"]');
			$player.find('.profile-img').css('border-color',player.colour);
			$playerPosition.css('background',player.colour);
			placeIcon(player.position,$playerPosition);
		};
		updatePlayersTurn(board);
		
	}
	var updatePlayersTurn = function(data) {
		var $scoreBoard = $('#score-board'),
		metaData = data.metaData,
		turnUser = metaData.turn,
		$playerPositions = $('#players_icons_target').find('[data-user-id]');
		userId  = $('#board-page').data('currid');
		$currentUser = $scoreBoard.find('[data-user-id="'+turnUser+'"]');
		$scoreBoard.find('.profile-img').removeClass('active');
		$currentUser.css('	background-color', 'rgba(255,255,255,0.5');
			if(userId == turnUser){
				enableDiceButton();
			}else{
				disableDiceButton();
			}
			for (var  key in data.metaData) {
				var player = data.metaData[key],
				$playerPosition = $playerPositions.filter('[data-user-id="'+key+'"]');
				placeIcon(player.position,$playerPosition);
			};
		}
		var placeIcon  = function(position,$player){
			if(!position) return;
			var $node = $('#tables-container').find('[data-nodeid="'+position+'"]'),
			adjustX = $node.width()/2,
			adjustY = $node.height()/2,
			positionX = $node.offset().left + adjustX, 
			positionY = $node.offset().top + adjustY;
			$player.css({top: positionY, left: positionX});

		}
		var enableDiceButton = function() {
			$('#dice').removeClass('disabled');
		}
		var disableDiceButton = function() {
			$('#dice').addClass('disabled');
		}
		return {
			init: init,
			updatePlayersList: updatePlayersList,
			updatePlayersTurn:  updatePlayersTurn

		//updateView: updateView
	}
});
App.register('board-page',game);






	/*$( window ).resize(function() {
		drawTable();
		placeIcon($rows.find('[data-nodeId="'+playerOnePosition+'"]'),$playerOne);
		placeIcon($rows.find('[data-nodeId="'+playerTwoPosition+'"]'),$playerTwo);
	});*/


