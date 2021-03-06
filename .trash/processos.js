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
/*
function popularFiltroOld(loadUrl, id){
	$.getJSON({
		url: loadUrl,
		success: function(data){
			var fields = data.categorias || data;
			$( id ).empty(); //verificar se dá problema...
			if (fields==null) {
				$(id).append('<option>Nenhum filtro encontrado.<option>');
				return;
				}
			$(id).append('<option>Selecione uma opção</option>');
			$.each( fields, function(i,option ) {
				if (option.alias != '' && option.alias != undefined) {
					$( id ).append( '<option value="' + option.id + '">' + option.alias + '</option>');
				} else if (option.fullName!='' && option.fullName != undefined) {
					$( id ).append( '<option value="' + option.id.$oid + '">' + option.fullName + '</option>');
					}
				});
			}
		});
	}

function popularFiltroCategoria(tipo, id){
	popularFiltro('/api/categorias/tipo/'+tipo, id);
	}
*/

function carregarFiltros(){
/*	const infos = [
		["/api/clientes","#clientes","alias"],
		["/api/pessoas","#parteCliente","fullName"],
		["/api/pessoas","#parteContraria","fullName"],
		["/api/categorias"]
		];
*/

	$.getJSON({
		url: "/api/clientes?perPage=10000",
		success: function(data){
			const id = "#cliente"; 
		//	window.alert(JSON.stringify(data));
			$(id).empty();
			if (data.items==null) {
				$(id).append('<option value="null" disabled>Nenhum filtro encontrado.<option>');
				return;
			}
			$(id).append('<option value="null" disabled>Selecione uma opção:</option>');

///
			data.items.forEach(function(item,index,arr){
				$(id).append( '<option value="' + item.id + '">' + item.num + '&nbsp;&mdash;&nbsp;' + item.alias + ' &nbsp; (' + item.fullName + ')</option>');
			});


//			for (item in data.items) {
//				$(id).append( '<option value="' + item.id + '">' + item.alias + ' ' + item.fullName + '</option>');
//			};

		}});
	
	// tipos = { url , ID no HTML }
	/*const tipos = [
		["acomp","#acomp"],
		["adv","#advogado"],
		["resp","#responsavel"],
		["uf","#estado"],
		["instancia","#comarca"],
		["numVara","#numVAra"],
		["natAcao","#natAcao"],
		["natVara","#natVara"],
		["status","#status"],
		["fase","#fase"]];
*/
/*	var pessoas = [
		["/api/clientes","#cliente"],
		["/api/pessoas/filtro/parteCliente","#parteCliente"],
		["/api/pessoas/filtro/parteContraria","#parteContraria"]];
*/
/*	var pessoas = [
		["l=100&sk=0&f={alias:1,_id:1}}&s={alias:1}}&q={}","#cliente"],
		['l=100&sk=0&f={fullName:1,_id:1}}&s={fullName:1}}&q={eParteClienteLegado:"S"}',"#parteCliente"],
		['l=100&sk=0&f={fullName:1,_id:1}}&s={fullName:1}}&q={eParteContrariaLegado:"S"}',"#parteContraria"]];*/
/*	$.each(tipos,function(i,obj){
		popularFiltroCategoria(obj[0], obj[1])
		});
	$.each(pessoas,function(i,obj){
		popularFiltro(obj[0], obj[1])
		});
	*/

	$.getJSON({
		url: "/api/categorias",
		success: function(data){
			console.log(JSON.stringify(data));
			var filtros = {};
			data.items.forEach(function(item,index,array){
				if (filtros[item.tipo]===undefined){
					console.log("Filtro "+ item.tipo +" ainda não definido. Vamos definir agora.");
					filtros[item.tipo]=[];
					console.log(filtros[item.tipo].length);
					$(item.tipo).empty();
					$(item.tipo).append('<option value="null" disabled>Selecione uma opção:</option>');
				}
				console.log(JSON.stringify(item));
				filtros[item.tipo].push(item);
			});
			// // //
			for (filtro in filtros){
console.log(JSON.stringify(filtro));
				for (filtroItem in filtro) {
				// filtro.forEach(function(filtroItem,index,arr) {
//				console.log(JSON.stringify(filtroItem.alias));
					$(filtroItem.tipo).append( '<option value="' + filtroItem.id + '">' + filtroItem.alias + ' ' + filtroItem.fullName + '</option>');
				//});
				}
			}
			//window.alert(JSON.stringify(filtros));

// // // 			
/*
			tipos.forEach(function (tipo,ind,arr){
				$( tipo[1] ).empty(); //verificar se dá problema...
				if (filtros==null) {
					$(tipo[1]).append('<option value="null" disabled>Nenhum filtro encontrado.<option>');
					return;
				}
				$(tipo[1]).append('<option value="null" disabled>Selecione uma opção:</option>');
				for (item in data.items) {
					if (item.tipo == tipo[0]) {
						$( tipo[1] ).append( '<option value="' + item.id + '">' + item.alias + ' ' + item.fullName + '</option>');
					}
				};
			});*/
			
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
$( "select" ).change( carregarTabela );


