$(function() {

	var accessToken = "fcbb3891ff1d42b592092355d5082d7d";
	var baseUrl = "https://api.api.ai/v1/";

	// chat aliases
	var you = 'ME   ';
	var robot = 'ECE BOT ';
	
	// slow reply by 400 to 800 ms
	var delayStart = 400;
	var delayEnd = 1500;
	
	// initialize
//	var bot = new chatBot2();
	var chat = $('.chat');
	var waiting = 0;
	$('.busy').text(robot + ' is typing...');
	
	// submit user input and get chat-bot's reply
	var submitChat = function() {
	
		var input = $('.input input').val();
		if(input == '') return;
		
		$('.input input').val('');
		updateChat(you, input);

		$.ajax({
			type: "POST",
			url: baseUrl + "query?v=20150910",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + accessToken
			},
			data: JSON.stringify({
				query: input,
				lang: "en",
				sessionId: "mysessionid"
			}),
			success: function(data) {
			
				//processResponse(data);
				this.text = data.result.fulfillment.speech;
				console.log("success finally");
				console.log(this.text);
				
 
				verify(data);
				//return data;
				
 
			   // return text.result.fulfillment.speech;
			
			},
			error: function() {
				//processResponse("Internal Server Error");
				text="Internal Server Error";
				console.log("Failllllllllllll");
			}
		});


		function verify(data){

			 res = data.result.fulfillment.speech;
			console.log("varify"+ res)
		
		
		
		var reply = res;
		//var reply=reply2.result.fulfillment.speech;
		console.log(reply);
		if(reply == null) return;
		
		var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
		$('.busy').css('display', 'block');
		waiting++;
		setTimeout( function() {
			if(typeof reply === 'string') {
				updateChat(robot, reply);
			} else {
				for(var r in reply) {
					updateChat(robot, reply[r]);
				}
			}
			if(--waiting == 0) $('.busy').css('display', 'none');
		}, latency);
	}
	}
	
	// add a new line to the chat
	var updateChat = function(party, text) {
	
		var style = 'you';
		if(party != you) {
			style = 'other';
		}
		
		var line = $('<div><span class="party"></span> <span class="text"></span></div>');
		line.find('.party').addClass(style).text(party + ' :');
		line.find('.text').text(text);
		
		chat.append(line);
		
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	
	}
	
	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);
	
	// initial chat state
	updateChat(robot, 'Welcome ! You can ask any question regarding ECE department .');

});