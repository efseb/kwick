(function(window, $)
{
	'use strict';

	const API_ROOT_URL 	= "http://greenvelvet.alwaysdata.net/kwick/api";
	var $Inscri 		= $('#inscription');
	var $Connec 		= $('#connection');
	var $Deco 			= $('#btn-deco');
	var $EnvoieMessage 	= $('#envoie');
	var $inputMessage 	= $('#inputMessage');

	function callKwick(url, callBack)
	{
		var request = $.ajax(
							{
								type		: 'GET',
								url 		: API_ROOT_URL + url,
								dataType 	: 'jsonp'
							});
		// En cas d'erreur... 
		request.fail(function(jqXHR, textStatus, errorThrown)
		{
			callBack(textStatus, null);
		});

		// En cas de succès...
		request.done(function(data)
		{
			callBack(null, data);
		});
	}

	var app = 
	{
		initialisation: function()
		{
			app.inscription();
			app.connexion();
			app.deconnexion();
			app.utilisateur();
			app.listeMessage();
			app.envoieMessage();
		},
		

		// Inscription a la messagerie... 
		inscription: function()
		{
			$Inscri.on('submit', function(e)
			{
				e.preventDefault();
				var nomIns = $('#nomInscritpion').val();
				var mdpIns = $('#mdpInscription').val();

				app.getInscription(nomIns, mdpIns);
			});
		},

		getInscription: function(nomIns, mdpIns)
		{
			callKwick('/signup/' + nomIns + '/' + mdpIns, function(err, data)
			{
				if(err)
				{
					return alert(err);
				}
				console.log(data.result);

				window.location.href = "connection.html";
			});
		},


		// Connexion à la messagerie... 
		connexion: function()
		{
			$Connec.on('submit', function(e)
			{
				e.preventDefault();
				var nomCo = $('#nomConnexion').val();
				var mdpCo = $('#mdpConnexion').val();

				app.getConnexion(nomCo, mdpCo);	
			});
		},

		getConnexion: function(nomCo, mdpCo)
		{
			callKwick('/login/' + nomCo + '/' + mdpCo, function(err, data)
			{
				if(err)
				{
					return alert(err);
				}
				console.log(data.result);

				localStorage.setItem("loginId", data.result.id);
				localStorage.setItem("token", data.result.token);

				window.location.href = "messagerie.html";
			});
		},


		// Déconnexion de la messagerie...
		deconnexion: function()
		{
			$Deco.on('click', function(e)
			{
				e.preventDefault();
				var $loginId 	= localStorage.getItem("loginId");
				var $token		= localStorage.getItem("token");
				app.getDeconnexion($loginId, $token);
			});
		},

		getDeconnexion: function($loginId, $token)
		{
			callKwick('/logout/' + $token + '/' + $loginId, function(err, data)
			{
				if(err)
				{
					return alert(err);
				}
				console.log(data.result);

				window.location.href = "index.html";
			});
		},


		// Affichage liste utilisateur...
		utilisateur: function()
		{
			var $token = localStorage.getItem("token");
			app.getUtilisateur($token);
		},

		getUtilisateur: function($token)
		{
			callKwick('/user/logged/' + $token, function(err, data)
			{
			    if(err)
			    {
			    	return alert(err);
			    }
			    console.log(data.result);

			    for(var i = 0; i < data.result.user.length; i++)
			    {
					$('#list-user').append('<li class="user">' + data.result.user[i] + '</li>');
			    }
			});
		},


		// Affichage liste des messages...
		listeMessage: function()
		{
			var $token = localStorage.getItem("token");
			app.getListeMessage($token);
		},

		getListeMessage: function($token)
		{
			callKwick('/talk/list/' + $token + '/' + 0, function(err, data)
			{
				if(err)
				{
					return alert(err);
				}
				console.log(data.result);
				for(var j = 0; j < data.result.talk.length; j++)
				{
					$('#messages').append('<div class="message">' +'<strong>' + data.result.talk[j].user_name + " : " + '</strong>' + data.result.talk[j].content + '</div>');
				}
			});
		},


		// Envoie d'un message...
		envoieMessage: function()
		{
			$EnvoieMessage.on('submit', function(e)
			{
				e.preventDefault();
    			var $Token 			= localStorage.getItem("token");
    			var $LoginId 		= localStorage.getItem('loginId');
    			var $Message 		= encodeURIComponent($inputMessage.val());
    			console.log($Message);
    			app.getEnvoieMessage($Token, $LoginId, $Message);
    			$inputMessage.val('');
    		});
		},

		getEnvoieMessage: function($Token, $LoginId, $Message)
		{
			callKwick('/say/' + $Token + '/' + $LoginId + '/' + $Message, function(err, data)
			{
				if(err)
				{
					alert(err);
				}
				console.log(data.result);
			});
		}
	}

	window.app = app;
})(window, jQuery)