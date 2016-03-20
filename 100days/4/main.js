
// left selection hidden and show 
var friends = document.getElementsByTagName('h2')[0];
function shifticon () {
	var arrow = document.getElementById('icon'),
		friends = document.querySelector('.friends');
	if(arrow.className == 'arrow-bottom'){
		arrow.className = 'arrow-right';
		friends.style.cssText = 'opacity:0';
	}else{
		arrow.className = 'arrow-bottom';
		friends.style.cssText = 'opacity:1';
	}
}
friends.addEventListener('click',shifticon,false);


// send text
var btn = document.querySelector('.right button'),
	html = '';
function sendText () {
	var hash = location.hash,
		text = document.querySelector('.right input'),
		 msg = text.value;

	if(msg === ''){
		alert('please write a word');
		return false;
	}
	if(hash == ''){
		alert('please select a friend!');
		return false;
	}
	var chatContent = document.querySelector('.right > .top'),
 		date = new Date(),
 		time = date.getHours() + ':' + date.getSeconds();
	if(hash === '#jack'){
		var jackMsg = localStorage.jack;
		if(jackMsg){
			text.value='';
			localStorage.jack = jackMsg + ';' + msg;
			html += '<p>' + time + '>>> ' + msg+ '</p>'
		}else{
			localStorage.jack = text.value;
			html += '<p>' + time + '>>> ' + msg+ '</p>'
			text.value = '';
		}
		chatContent.innerHTML = html;

	}

	if(hash === '#rose'){
		alert('rose')
	}

	if(hash === '#peter'){
		alert('peter');
	}
}
btn.addEventListener('click',sendText, false);