var game = {
	$number: null,
	$rows: null,
	boardId: null,
	userId: null,
	boardPlayers: null, 
	drawTable : function() {
		var $ladderImage  =$('#ladder-image'),
		cellWidth = $ladderImage.width()/10,
		cellHeight = $ladderImage.height()/10,
		myTableDiv = document.getElementById("tables-container"),
		table = document.createElement('TABLE'),
		tableBody = document.createElement('TBODY');
		table.appendChild(tableBody);
		var _this = this;

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
		_this.$number = $('#number'),
		_this.$rows = $('#tables-container').find('tr');	
		$(document).trigger('triggerRoom');
	},
	rollDice : function (event) {
		var _this = this;
		io.socket.post('/diceRolled',{id: $('#board-page').data('id')});
	},
	joinGame : function(event) {
		var _this = this;
		io.socket.post('/joinGame',{id: _this.boardId },function serverResponded (body, JWR) {
			window.isMyturn = false;
			console.log('Sails responded with: ', body);
			if(body.error){
				$('#error-modal').find('#message').html(body.error);
				$('#error-modal').foundation('reveal', 'open');
			}else{
				$('#joinedModal').foundation('reveal', 'open');
			}
		});
	},
	init :  function() {
		var _this = this;
		_this.boardId = $('#board-page').data('id');
		_this.boardPlayers = {};
		$("#ladder-image").one("load", function() {
			_this.drawTable();
		})
		
		_this.bindEvents();
	},
	showPlayerPanel : function() {
		var $scoreBoard = $('#score-board'),
		isOpen = $scoreBoard.hasClass('opened');
		if(isOpen){
			$scoreBoard.removeClass('opened')
		}else{
			$scoreBoard.addClass('opened')
		}
	},
	bindEvents : function() {
		var _this = this;
		$('body').off('click','#dice').on('click','#dice',_this.rollDice.bind(_this) );
		$('body').off('click','#join').on('click','#join',_this.joinGame.bind(_this ) );
		$('body').off('click','#show-button').on('click','#show-button',_this.showPlayerPanel.bind(_this) );
	},
	updatePlayersList : function(data) {
		var _this = this;
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
		};
		board.players.forEach(function(value,index){
			_this.boardPlayers[value.id] =value;
		});
		_this.updatePlayersTurn(board);
		
	},
	updatePlayersTurn : function(data) {
		var _this = this;
		var $scoreBoard = $('#score-board'),
		metaData = data.metaData,
		turnUser = metaData.turn,
		$playerPositions = $('#players_icons_target').find('[data-user-id]');
		_this.userId  = $('#board-page').data('currid');
		$currentUser = $scoreBoard.find('[data-user-id="'+turnUser+'"]');
		$scoreBoard.find('.profile-img').removeClass('active');
		$currentUser.css('	background-color', 'rgba(255,255,255,0.5');
			if(_this.userId == turnUser){
				alertify.success('Your Turn');
				_this.enableDiceButton();
			}else{
				_this.disableDiceButton();
				if(turnUser)
					alertify.log(_this.boardPlayers[turnUser].name + ' has to play');
				else{
					alertify.log('Game Over');
				}

			}
			for (var  key in data.metaData) {
				var player = data.metaData[key],
				$playerPosition = $playerPositions.filter('[data-user-id="'+key+'"]');
				if(player)
					_this.placeIcon(player.positions,$playerPosition);
			};
		},
		placeIcon  : function(positions,$player){
			var _this = this;
			if(!positions || positions[0] == 0) return;
			positions.forEach(function(value,index){
				var time = (index + 1) * 500;
				setTimeout(function (argument) {
					var $node = $('#tables-container').find('[data-nodeid="'+value+'"]'),
					adjustX = $node.width()/2,
					adjustY = $node.height()/2,
					positionX = $node.offset().left + adjustX, 
					positionY = $node.offset().top + adjustY;
					$player.css({top: positionY, left: positionX});
				},time);
			});
			


		},
		enableDiceButton : function() {
			$('#dice').removeClass('disabled');
		},
		disableDiceButton : function() {
			$('#dice').addClass('disabled');
		}
	};
	App.register('board-page',game);






	/*$( window ).resize(function() {
		drawTable();
		placeIcon($rows.find('[data-nodeId="'+playerOnePosition+'"]'),$playerOne);
		placeIcon($rows.find('[data-nodeId="'+playerTwoPosition+'"]'),$playerTwo);
	});*/


