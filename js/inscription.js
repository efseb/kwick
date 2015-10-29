inscription: function()
{
	$form.on('submit', function()
	{
		var nom = $('#nomInscritpion').val();
		var mdp = $('#mdpInscription').val();

		app.getInscription(nom, mdp);
	})

	getInscription: function(nom, mdp)
	{
		callKwick('signup/' + nom + '/' + mdp, function(err, data)
		{
			if(err)
			{
				return alert(err);
			}
		})
	}
}