(function(window, $)
{
	'use strict';

	const API_ROOT_URL 	= "http://greenvelvet.alwaysdata.net/kwick/api/";
	var $Inscri 		= $('#inscription');
	var $Connec 		= $('#connection');
	var $Deco 			= $('#btn-deco');
	var $EnvoieMessage 	= $('#envoie');
	var $inputMessage 	= $('#inputMessage');
	var $messages		= $('#messages');

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
		token: null,
		id: null,

		initialisation: function()
		{
			app.inscription();
			app.connexion();
			
		},
		initMessagerie: function()
		{
			app.deconnexion();
			app.utilisateur();
			app.listeMessage();
			app.envoieMessage();
			app.refresh();
		},
		
		// Fonction inscription
		inscription: function()
		{
			$Inscri.on('submit', app.getInscription);
		},

		getInscription: function(e)
		{
			e.preventDefault();
			var $nomIns 		= $('#nomInscritpion').val();
			var $mdpIns 		= $('#mdpInscription').val();
			var $mdpInsVerif 	= $('#mdpVerif').val();

			if($mdpIns === $mdpInsVerif)
			{
				callKwick('signup/' + $nomIns + '/' + $mdpIns, function (err, data)
				{
					if (err)
					{
						return alert(err);
					}
					if (data.result.status == 'failure')
					{
						$('#info-log').empty().append('<p id="info">Ce login n\'est pas valide.</p>');
					}
					else
					{
						app.setCredentials(data);
						window.location.href="messagerie.html"
					}
				});
			}
			else
			{
				$('#info-log').empty().append('<p id="info">Le mot de passe ne correspond.</p>');
				$mdpIns.val('');
			}
		},

		// Fonction connexion
		connexion: function()
		{
			$Connec.on('submit', app.getConnexion);
		},

		getConnexion: function(e)
		{
			e.preventDefault();
			var $nomCo = $('#nomConnexion').val();
			var $mdpCo = $('#mdpConnexion').val();

			callKwick('login/' + $nomCo + '/'+ $mdpCo, function (err, data)
			{
				if (err)
				{
					return alert(err);
				}
				if (data.result.status == 'failure')
				{
					$('#log').empty().append('<p id="cont">Votre nom ou votre mot de passe n\'est pas valide</p>');
				}
				else
				{
					app.setCredentials(data);
					window.location.href="messagerie.html"
				}
			});
		},

		// Fonction deconnexion
		deconnexion: function()
		{
			$Deco.on('click', function(e)
			{
				e.preventDefault();
				var $loginId 	= localStorage.getItem("id");
				var $token		= localStorage.getItem("token");
				app.getDeconnexion($loginId, $token);
			});
		},

		getDeconnexion: function($loginId, $token)
		{
			callKwick('logout/' + $token + '/' + $loginId, function(err, data)
			{
				if(err)
				{
					return alert(err);
				}
				console.log(data.result);

				window.location.href = "connection.html";
			});
		},

		// Fonction liste utilisateur
		utilisateur: function()
		{
			var $token = localStorage.getItem("token");
			app.getUtilisateur($token);
		},

		getUtilisateur: function($token)
		{
			callKwick('user/logged/' + $token, function(err, data)
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


		// Fonction affichage messagerie
		listeMessage: function()
		{
				$messages.empty();
				app.getListeMessage();
			
		},

		getListeMessage: function()
		{
			app.token = localStorage.getItem("token");
			callKwick('/talk/list/' + app.token + '/' + 0, function (err, data)
			{
				if(err)
				{
					return alert(err);
				}
				for (var j = 0; j < data.result.talk.length; j++)
				{
					$messages.append('<li class="message">' + '<span>' + data.result.talk[j].user_name+ "</span> : " + data.result.talk[j].content + '</>');
					$messages.scrollTop(10*1000000);
				};
			});
			
		},

		// Fonction envoie message
		envoieMessage: function()
		{
			$EnvoieMessage.on('submit', function(e)
			{
				e.preventDefault();
    			var $token 			= localStorage.getItem("token");
    			var $loginId 		= localStorage.getItem('id');
    			var $message 		= encodeURIComponent($inputMessage.val());
    			app.getEnvoieMessage($token, $loginId, $message);
    			$inputMessage.val('');
    		});
		},

		getEnvoieMessage: function($token, $loginId, $message)
		{
			callKwick('say/' + $token + '/' + $loginId + '/' + $message, function(err, data)
			{
				if(err)
				{
					alert(err);
				}
				app.getListeMessage();
			});
		},

		// Fonction token & id
		setCredentials: function(data)
		{
			app.token = data.result.token;
			app.id    = data.result.id;

			localStorage.setItem("token", data.result.token);
			localStorage.setItem("id", data.result.id);
		},
		getCredentials: function()
		{
			app.token = localStorage.getItem("token");
			app.id    = localStorage.getItem("id");
		},
		removeCredentials: function()
		{
			app.token = null;
			app.id    = null;

			localStorage.removeItem("token");
			localStorage.removeItem("id");
		},

		refresh: function()
		{	
			setInterval(function()
			{
				app.getUtilisateur();
				app.getListeMessage();
			}, 7000);
		}

	}

	window.app = app;
})(window, jQuery)