$(document).ready(function(){

	//load initial screen
	action.reset();

	$('#fight_btn').on('click', function() {
		var player = "";
		var defender = "";

		if ($('.player-box > .char-box').length > 0) {
			var player = $('.player-box > .char-box').attr('id');
		}
		if ($('.defender-box > .char-box').length > 0) {
			var defender = $('.defender-box > .char-box').attr('id');
		}

		if (player != "" && defender != "" && $("#"+player).attr('hp') > 0) {
			var playEl = "#" + player;
			var defEl = "#" + defender;

			//first decrement defender HP and see if still alive
			if (action.decDefHP(playEl, defEl) > 0) {
				//check if player still alive
				if (action.decPlayHP(playEl, defEl) <= 0) {
					//game over
					action.displayFight('lose');	
				} 
				else {
					action.displayFight('fight');	
				}
			}
			else {
				//eliminate defender
				$('#defender_box').empty();
				defender = "";

				//make char-row draggable again
				$('.gen-row > .char-box').attr('draggable', 'True');
				$('.gen-row > .char-box').attr('ondragstart','drag(event)');

				action.displayFight('choose');

				//check if won
				if ($("#defender_box > .char-box").length < 1 && $("#char_row > .char-box").length < 1) {
					action.displayFight('won');
				}
			}

			action.incPlayAP(playEl, defEl);
			action.displayAP(playEl, defEl);
			action.displayHP(playEl, defEl);
		}
	});

	//set reset button click
	$('#reset_btn').on('click', function() {
			action.reset();
	});

});

var action = {
	decDefHP: function(playEl, defEl) {
		var playAP = parseInt($(playEl).attr("ap"));
		var defHP = parseInt($(defEl).attr("hp"));
		var maxHP = parseInt($(defEl).attr("maxhp"));

		var intDefHP = defHP - playAP;
		$(defEl).attr("hp", intDefHP);

		var percentDefHP = (intDefHP/maxHP) * 100;
		var stringDefHP = percentDefHP+"%";

		$('.defender-bar').css('width', stringDefHP);

		return intDefHP;
	},
	decPlayHP: function(playEl, defEl) {
		var playHP = parseInt($(playEl).attr("hp"));
		var maxHP = parseInt($(playEl).attr("maxhp"));
		var defCP = parseInt($(defEl).attr("cp"));

		var intPlayHP = Math.max((parseInt(playHP) - parseInt(defCP)), 0);
		$(playEl).attr("hp", intPlayHP);

		var percentPlayHP = 100-((intPlayHP/maxHP) * 100);
		var stringPlayHP = percentPlayHP+"%";

		$('.player-bar').css('width', stringPlayHP);

		return intPlayHP;
	},
	incPlayAP: function(playEl, defEl) {
		var playAP = $(playEl).attr("ap");
		var playInc = $(playEl).attr("inc");

		var intPlayAP = parseInt(playAP) + parseInt(playInc);
		$(playEl).attr("ap", intPlayAP);
	},
	displayHP: function(playEl, defEl) {
		var playHP = $(playEl).attr("hp");
		var defHP = $(defEl).attr("hp");

		$(playEl+"_hp").text(playHP);
		$(defEl+"_hp").text(defHP);

	},
	displayAP: function(playEl, defEl) {
		var playAP = $(playEl).attr("ap");
		var defCP = $(defEl).attr("cp");

		$(playEl+"_attack").text(playAP);
		$(defEl+"_attack").text(defCP);

	},
	displayAttacks: function() {
		$('#char_row').children('div').each(function() { 
			var playerAP = $(this).attr("ap");
			$("#"+this.id+"_attack").text(playerAP);
		});

		$('#enemy_row').children('div').each(function() { 
			var enemyCP = $(this).attr("cp");
			$("#"+this.id+"_attack").text(enemyCP);
		});

		$('.stats-box').removeClass('stats-hover');
	},
	displayFight: function(status) {
		if (status === 'init') {
			$('#fight_info').text("Drag-n-Drop");
			$('#fight_info').css("font-size", "20px");
			$('#fight_info').css("color", "red");
			$('#arrow_down').hide();
			$('#arrow_left').show();
			$('#arrow_right').show();
		}
		else if (status === 'fight') {
			$('#fight_info').text("Fight!");
			$('#fight_info').css("font-size", "30px");
			$('#arrow_down').show();
			$('#arrow_left').hide();
			$('#arrow_right').hide();
		}
		else if (status === 'lose') {
			$('#fight_info').text("You Lose");
			$('#fight_info').css("font-size", "30px");
			$('#arrow_down').hide();
			$('#arrow_left').hide();
			$('#arrow_right').hide();
		}
		else if (status === 'won') {
			$('#fight_info').text("You Win!");
			$('#fight_info').css("font-size", "30px");
			$('#fight_info').css("color", "yellow");
			$('#arrow_down').hide();
			$('#arrow_left').hide();
			$('#arrow_right').hide();
		}
		else { //defender defeated, choose another
			$('#fight_info').text("Choose");
			$('#fight_info').css("font-size", "30px");
			$('#arrow_right').show();
			$('#arrow_down').hide();
			$('#arrow_left').hide();
		}
	},
	reset: function() {
		//clear all char rows
		$('.gen-row').html("");
		$('.player-box').empty();
		$('.defender-box').empty();

		//regenerate characters
		$('#char_row').append(make.elem("ryu"));
		$('#char_row').append(make.elem("ken"));
		$('#char_row').append(make.elem("blanka"));
		$('#char_row').append(make.elem("vega"));

		action.displayFight('init');

		//empty meters
		$(".defender-bar").css("width", "0%");
		$(".player-bar").css("width", "100%");

		//reset screen
		$('.arena-img').attr('src', "assets/images/stage_base.jpg");
	}
}

var make = {
	ryu: {
		hp: "180",
		ap: "7",
		cp: "20",
		stage: "assets/images/stage_ryu.jpg"
	},
	ken: {
		hp: "180",
		ap: "7",
		cp: "20",
		stage: "assets/images/stage_ken.jpg"
	},
	blanka: {
		hp: "240",
		ap: "6",
		cp: "15",
		stage: "assets/images/stage_blanka.jpg"
	},
	vega: {
		hp: "160",
		ap: "10",
		cp: "25",
		stage: "assets/images/stage_vega.jpg"
	},
	elem: function(fighter) {
		var fighterObj;

		if (fighter === "ryu") {fighterObj = this.ryu;}
		else if (fighter === "ken") {fighterObj = this.ken;}
		else if (fighter === "blanka") {fighterObj = this.blanka;}
		else {fighterObj = this.vega;}

		//create/populate char row element
		var nameTag = $('<p>').attr('id', 'char_col');
		var name = fighter[0].toUpperCase();
		for (var i = 1; i < fighter.length; i++) {
			name += " " + fighter[i].toUpperCase();
		}
		nameTag.text(name);
		var imgTag = $('<img>').addClass('char-img').attr('src', 'assets/images/'+ fighter +'.jpg');
		imgTag.attr('draggable','false');
		var rowTag = $('<div>').addClass('char-row');
		rowTag.append(imgTag);
		rowTag.append(nameTag);

		//create/populate stats row element
		var hpTag = $('<p>').attr('id', fighter+'_hp');
		hpTag.text(fighterObj.hp);
		var attTag = $('<p>').attr('id', fighter+'_attack');
		var statRowTag = $('<div>').addClass('stats-row');
		statRowTag.append(hpTag);
		statRowTag.append(attTag);

		var contTag = $('<div>').addClass('char-content').attr('id', 'content_'+ fighter);
		contTag.append(rowTag);
		contTag.append(statRowTag);

		//create/populate stats box element
		var hiddenStatsTag = $('<p>').addClass('stats-ap');
		var hiddenStats = "AP: " + fighterObj.ap + " CP: " + fighterObj.cp;
		hiddenStatsTag.text(hiddenStats);
		var statsBoxTag = $('<div>').addClass('stats-box stats-hover');
		statsBoxTag.append(hiddenStatsTag);

		//create and populate character element
		var divTag = $('<div>').addClass('char-box').attr('id', fighter);
		divTag.attr('hp', fighterObj.hp);
		divTag.attr('maxhp', fighterObj.hp);
		divTag.attr('ap', fighterObj.ap);
		divTag.attr('inc', fighterObj.ap);
		divTag.attr('cp', fighterObj.cp);
		divTag.attr('stage', fighterObj.stage);
		divTag.attr('draggable','true');
		divTag.attr('ondragstart','drag(event)');

		divTag.append(contTag);
		divTag.append(statsBoxTag);	

		return divTag;		
	}
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dropPlayer(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    //remove drag attributes
    var player = $('.player-box > .char-box').attr('id');
    $("#"+player).removeAttr('draggable ondragstart');

    //remove hover and show attack
    $('#'+player+' > .stats-box').removeClass('stats-hover');
    $("#"+player+"_attack").text($("#"+player).attr('ap'));

    //hide left arrow
    $('#arrow_left').hide();

    //fill hp gauge
    $('.player-bar').css('width', '0%');

    //check if both player and defender, if so then halt all draggable
    if ($('.player-box > .char-box').length > 0 && $('.defender-box > .char-box').length > 0) {
    	$('.char-box').removeAttr('draggable ondragstart');
    	//change fight info
    	action.displayFight('fight');
    }
}

function dropDefender(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    //remove drag elements
    var defender = $('.defender-box > .char-box').attr('id');
    $("#"+defender).removeAttr('draggable ondragstart');

    //remove hover and show attack
    $('#'+defender+' > .stats-box').removeClass('stats-hover');
    $("#"+defender+"_attack").text($("#"+defender).attr('cp'));

    //hide right arrow
    $('#arrow_right').hide();

    //change stage
    var stage = $("#"+defender).attr('stage');
    $('.arena-img').attr('src', stage);

    //fill hp gauge
    $('.defender-bar').css('width', '100%');

    //check if both player and defender, if so then halt all draggable
    if ($('.player-box > .char-box').length > 0 && $('.defender-box > .char-box').length > 0) {
    	$('.char-box').removeAttr('draggable ondragstart');
    	//change fight info
    	action.displayFight('fight');
    }
}

function allowDrop(ev) {
  ev.preventDefault();
}