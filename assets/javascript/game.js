	var player = "";
	var defender = "";

$(document).ready(function(){

	//load initial screen
	action.reset();

	// $('#player_meter').css('width', 0);
	$(".defender-bar").css("width", "0%");
	$(".player-bar").css("width", "100%");

	$('#fight_btn').on('click', function() {
		if (player != "" && defender != "" && $("#"+player).attr('hp') > 0) {
			var playEl = "#" + player;
			var defEl = "#" + defender;

			//first decrement defender HP and see if still alive
			if (action.decDefHP(playEl, defEl) > 0) {
				//check if player still alive
				if (action.decPlayHP(playEl, defEl) <= 0) {
					//game over
					action.displayInfo(playEl, defEl, "lost");	
				} 
				else {
					action.displayInfo(playEl, defEl, "attacking");	
				}
			}
			else {
				//eliminate defender
				$('#defender_box').html("");
				defender = "";
				//make char-row draggable again
				$('.gen-row > .char-box').attr('draggable', 'True');
				$('.gen-row > .char-box').attr('ondragstart','drag(event)');

				//check if won
				if ($("#defender_box > .char-box").length < 1 && $("#enemy_row > .char-box").length < 1) {
					action.displayInfo(playEl, defEl, "won");
				}
				else {
					action.displayInfo(playEl, defEl, "oneDown");
				}
			}

			action.incPlayAP(playEl, defEl);
			action.displayAP(playEl, defEl);
			action.displayHP(playEl, defEl);
		}
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
	displayInfo: function(playEl, defEl, status) {
		var info;
		var reset="";
		if (status === "attacking") {
			var playAP = $(playEl).attr("ap");
			var defCP = $(defEl).attr("cp");

			info = "<p>You attacked " + defender + " for " + playAP + " damage.</p>";
			info += "<p>" + defender + " countered for " + defCP + " damage.</p>";
		}
		else if (status === "lost") {
			info = "You have been defeated...<br>";
			reset = $('<button>Reset</button>').on('click', function() {
				action.reset();
			});
		}
		else if (status === "won") {
			info = "Congratulations, you won!<br>";
			reset = $('<button>Reset</button>').on('click', function() {
				action.reset();
			});
		}
		else if (status === "clear") {
			info = "";
		}
		else {
			info = "<p>You have defeated " + defender + "!</p>";
			info += "<p>Choose another enemy.</p>";
		}

		$('#info').html(info);
		$('#info').append(reset);
	},
	reset: function() {
		//restore global vars
		player = "";
		defender = "";

		//clear all char rows
		$('.gen-row').html("");

		//regenerate characters
		$('#char_row').append(make.elem("ryu"));
		$('#char_row').append(make.elem("ken"));
		$('#char_row').append(make.elem("blanka"));
		$('#char_row').append(make.elem("vega"));

		//clear info 
		$('#info').html("");
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