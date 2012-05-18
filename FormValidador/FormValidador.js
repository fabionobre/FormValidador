(function($) {
	$.fn.FormValidator = function(settings) {

		var fn = null;
		
		if (typeof(arguments[arguments.length - 1]) == 'function') {
			
			fn = arguments[arguments.length - 1];
		}
	
		settings = $.extend({
			mensagem : "msg_padrao",
			ajax: false,
			divErro: 'mensagem-erro'
		}, settings);

		$(this).each(function() {		
							
			$(this).submit(function(e) {
					
				var passou = validaFormulario($(this));
				var validou = passou;
				var json = new Object();
				
				$(window).trigger('resize');
															
				if (passou && settings.ajax == true) {
					
					var url = $(this).attr('action');
					var dados = $(this).serialize();

					$.ajax({
				        type: "POST",
				        url: url,
				        data: dados,
				        async: false,
				        success: function( resposta )
				        {			        	
				        	json = eval('(' + resposta + ')');
				        	
				        	if (json.status == 'erro') {
								$('#' + settings.divErro).show();
								validou = false;
				        	}
				        	
				        },
				        error:function(XMLHttpRequest, textStatus, errorThrown)
				        {
				        	console.log('Ocorreu um erro');
				        }
					});
					
					passou = false;					
				}
			
				if (validou && fn != null) {

					passou = fn.call(this, json);
				}								
			
				if (settings.ajax == true) {
					
					return false;
					
				} else {
					
					return passou;
				}				
			});
		});

		function validaFormulario($this) {
			
			$('#' + settings.divErro).hide();
			
			var formElements = $this.find('textarea, input');
			var erro = true;

			for ( var i = 0; i < formElements.length; i++) {

				$(formElements[i]).removeClass('error');

				if ($(formElements[i]).attr('validate') != null) {

					elemento = formElements[i];
					validacao = $(elemento).attr('validate');

					campoErro = validaCampo(elemento);

					if ($(formElements[i]).next().attr('class') == 'error') {

						$(formElements[i]).next().html(campoErro);

					} else {

						$(formElements[i]).after(
								'<div class="error">' + campoErro + '</div>');
					}

					if (campoErro != "") {

						erro = false;
						$('#' + settings.divErro).show();

						if ($(elemento).attr('divDestaque') == null) {

							$(formElements[i]).addClass('error');

						} else {

							$('#' + $(elemento).attr('divDestaque')).addClass('error');
						}
					}

				}
			}

			return erro;
		}

		function addErroDiv(divErro) {

		}

		function validaCampo(campo) {

			var retorno = validaTamanho(campo);
			
			if (retorno != null) {
				
				return retorno;
			}
			
			var RegExp = [];

			switch ($(campo).attr('validate')) {
			
				case 'cpf':
					RegExp.push(/^[\d]{3}\.[\d]{3}\.[\d]{3}\-[\d]{2}$/);
					RegExp.push(/^[\d]{11}$/);
					retorno = validaRegex(campo, RegExp);					
					break;
	
				case 'nome':
					RegExp.push(/^[a-zA-Z0-9-\s]+$/);
					retorno = validaRegex(campo, RegExp);
					break;
	
				case 'telefone':
					RegExp.push(/^[\d]{4,5}-[\d]{4,5}$/);
					RegExp.push(/^[\d]{8,10}$/);
					RegExp.push(/^$/);
					retorno = validaRegex(campo, RegExp);					
					break;
	
				case 'telefoneOuVazio':
					RegExp.push(/^[\d]{4,5}-[\d]{4,5}$/);
					RegExp.push(/^[\d]{8,10}$/);
					RegExp.push(/^$/);
					retorno = validaRegex(campo, RegExp);					
					break;
	
				case 'idade':
					RegExp.push(/^[\d]{1,3}$/);
					retorno = validaRegex(campo, RegExp);					
					break;
	
				case 'ano':
					RegExp.push(/^[\d]{4}$/);
					retorno = validaRegex(campo, RegExp);					
					break;
	
				case 'vazio':
					RegExp.push(/^\s*\S.*$/);
					retorno = validaRegex(campo, RegExp);
					break;

				case 'senha':
					retorno = validaSenha(campo);
					break;
					
				default:
					break;

			}

			return retorno;
		}

		function validaRegex(campo, RegExp) {
			
			var erro = true;

			for ( var i = 0; i < RegExp.length; i++) {

				if (RegExp[i].test($(campo).attr('value'))) {
					erro = false;
				}
			}

			if (erro) {

				if ($(campo).attr('msgErro') != null) {

					return $(campo).attr('msgErro');

				} else {

					return 'campo inv�lido';
				}
			} else {

				return "";
			}			
		}
		
		function validaTamanho(campo) {
			
			if ($(campo).attr('tmMinimo') != null && $(campo).val().length < $(campo).attr('tmMinimo')) {
				
				return 'o campo precisa ter pelo menos ' + $(campo).attr('tmMinimo') + ' caracteres';
			}
			
			if ($(campo).attr('tmMaximo') != null && $(campo).val().length >= $(campo).attr('tmMaximo')) {
				
				return 'o campo precisa ter no m�ximo ' + $(campo).attr('tmMaximo') + ' caracteres';
			}		
			
			return null;
		}
		
		function validaSenha(campo) {
			
			senha = $('#' + $(campo).attr('campoConfere')).val();
			
			if ($(campo).val() != senha) {
				
				return "senha n�o confere";				
			}
			
			return "";
		}		
	};
})(jQuery);