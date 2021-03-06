/*
 *
 * /js/processos.js
 *
 */

(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

function carregarFiltros(){
	// Carregar JSON com nome dos clientes e popular o filtro correspondente (#cliente)
	$.getJSON({
		url: "/api/clientes?perPage=10000",
		success: function(data){
			const id = "#cliente"; 
			//$(id).empty();
			if (data.items==null) {
				$(id).append('<option value="null">Nenhum filtro encontrado.<option>');
				return;
			}
			$(id).append('<option value="null">Selecione uma opção:</option>');
			data.items.forEach(function(item,index,arr){
				// na linha abaixo, substituir o primeiro .alias por .id
				$(id).append( '<option value="' + item.alias + '">' + item.num + '&nbsp;&mdash;&nbsp;' + item.alias + ' &nbsp; (' + item.fullName + ')</option>'); 
			});

		}});
	// Carregar JSON com nome das pessoas e popular filtros de parte cliente e parte contraria
	$.getJSON({
		url: "/api/pessoas?perPage=10000",
		success: function(data){
			//$('#parteCliente').empty();
			//$('#parteContraria').empty();
			if (data.items==null) {
				$('#parteCliente').append('<option value="null" disabled>Nenhum filtro encontrado.<option>');
				$('#parteContraria').append('<option value="null" disabled>Nenhum filtro encontrado.<option>');
				return;
			}
			$('#parteCliente').append('<option value="null" disabled>Selecione uma opção:</option>');
			$('#parteContraria').append('<option value="null" disabled>Selecione uma opção:</option>');
			data.items.forEach(function(item,index,arr){
				if (item.eParteClienteLegado == 'S' || item.eParteCliente == true) {
				// na linha abaixo, substituir o primeiro .alias por .id
					$('#parteCliente').append( '<option value="' + item.alias + '">' + item.fullName + '</option>');
				}
				if (item.eParteContrariaLegado == 'S' || item.eParteContraria == true) {
				// na linha abaixo, substituir o primeiro .alias por .id
					$('#parteContraria').append( '<option value="' + item.alias + '">' + item.fullName + '</option>');
				}
			});

		}});
	// Carregor JSON com as categorias, iterar sobre eles para mapear por 'tipo', e popular os filtros correspondentes, pelo nome do campo (deve ser idêntico no view renderizado)
	$.getJSON({
		url: "/api/categorias",
		success: function(data){
			//console.log(JSON.stringify(data));
			var filtros = [];
			for (var h = 0; h < data.items.length; h++ ) {	
				if (filtros[data.items[h]['tipo']]===undefined){
					//console.log("Filtro "+ data.items[h]['tipo'] +" ainda não definido. Vamos definir agora.");
					filtros[data.items[h]['tipo']]=[];
					//console.log(filtros[item.tipo].length);
					//$('#'+data.items[h]['tipo']).empty();
					$('#'+data.items[h]['tipo']).append('<option value="null">Selecione uma opção:</option>');
				}
			//	console.log(JSON.stringify(data.items[h]));
			//	//filtros[data.items[h]['tipo'].push(item);
				// na linha abaixo, substituir o primeiro .alias por .id
				$('#'+data.items[h]['tipo']).append('<option value="' + data.items[h].alias + '">' + data.items[h].alias + ' ' + data.items[h].fullName + '</option>');
			}
			
		}
	});
}

/*
 *
 * function carregarComarcas(uf)
 * returns: void
 * description: loads every courthouse and county.
 */
/*function carregarComarcas(uf){
	$.getJSON({
		url:'/api/comarcas',
		success: function comarcasSucesso(data){
			var fields=data.comarcas;
			$.each(fields, function(i,option){
				$('comarca').append('<option name="' + option.id + '">' + option.alias + '</option>');
				});
			}
		});
	} // [END] carregarComarcas
*/
function tabelaProcessosLinha(i,processo){
	var retorno = '<tr>';
	retorno += '<td>'+processo.acomp;
	if (processo.link!='') {
		retorno+= '&nbsp;(<a href="' + processo.link + '" target="_blank">Abrir link</a>)';
		}
	retorno += '</td>';
	retorno += '<td><a href="/processos/' + processo.id + '">' + processo.numero + '&nbsp;<small>(Abrir)</small></a></td>';
	retorno += '<td>'+ processo.cliente + '</td>';
	retorno += '<td>'+ processo.parteCliente + '</td>';
	retorno += '<td>'+ processo.parteContraria + '</td>';
	retorno += '<td>'+ processo.advogado + '</td>';
	retorno += '<td>'+ processo.responsavel + '</td>';
	retorno += '<td>'+ processo.comarca + '/'+ processo.estado + '&nbsp;(' + processo.instancia + ')<br /><small>' + processo.legacyComarca + '</small></td>';
	retorno += '<td>'+ processo.numVara + '&nbsp;' + processo.natVara + '</td>';
	retorno += '<td>'+ processo.fase + '/' + processo.status+ '</td>';
	retorno += '<td>'+ processo.observacoes + '</td>';
	retorno += '</tr>';
	return retorno;
	}

function carregarTabela() {
	$("#tdCarregando").addClass("fa fa-spinner fa-spin fa-lg")
	var filtros = $('#filtro').serializeArray();
	//window.alert(JSON.stringify(filtros));
	qs = '/api/processos';
	if ($.QueryString.pageToken || $.QueryString.perPage) {
		qs += '?'
	}
	if ($.QueryString.pageToken) {
		qs +='pageToken='+$.QueryString.pageToken;
		if ($.QueryString.perPage) {
			qs+='&';
		}
	}
	if ($.QueryString.perPage) {
		qs +='perPage='+$.QueryString.perPage;
	}
	
	$.ajax({
		url: qs,
		dataType: 'json',
		success: function(data){
			//var fields = $( ":input" ).serializeArray();
			var fields = data.items;
			//window.alert(JSON.stringify(fields));
			$( "#tabelaProcessos" ).empty();
			if (fields==null) {
				$("tabelaProcessos").append("Nenhum processo encontrado");
				}
			$.each( fields, function(i,linha ) {
				$( "#tabelaProcessos" ).append( tabelaProcessosLinha(i,linha));
				});
			}
		});
	}
//$( ":checkbox, :radio" ).click( carregarTabela );
//$( "select" ).change( carregarTabela );


