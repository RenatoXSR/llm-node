/*
 *
 * /js/processos.js
 *
 */

function popularFiltro(loadUrl, id){
	$.getJSON({
		url: loadUrl,
		success: function(data){
			var fields = data.categorias;
			$( id ).empty(); //verificar se dá problema...
			if (fields==null) {
				$(id).append('<option>Nenhum filtro encontrado.<option>');
				}
			$.each( fields, function(i,option ) {
				$( id ).append( '<option value="' + option.id + '">' + option.alias + '</option>');
				});
			}
		});
	}

function popularFiltroCategoria(tipo, id){
	popularFiltro('/api/categorias/tipo/'+tipo, id);
	}

function carregarFiltros(){
	// tipos = { url , ID no HTML }
	var tipos = [
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
	var pessoas = [
		["/api/clientes","#cliente"],
		["/api/pessoas/filtro/parteCliente","#parteCliente"],
		["/api/pessoas/filtro/parteContraria","#parteContraria"]];
	$.each(tipos,function(i,obj){
		popularFiltroCategoria(obj[0], obj[1])
		});
	$.each(pessoas,function(i,obj){
		popularFiltro(obj[0], obj[1])
		});
	}

/*
 *
 * function carregarComarcas(uf)
 * returns: void
 * description: loads every courthouse and county.
 */
function carregarComarcas(uf){
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

function tabelaProcessosLinha(i,processo){
	var retorno = '<tr>';
	retorno += '<td>'+processo.acomp;
	if (processo.link!='') {
		retorno+= '&nbsp;(<a href="' + processo.link + '" target="_blank">Abrir link</a>)';
		}
	retorno += '</td>';
	retorno += '<td><a href="/processos/' + processo.id + '">' + processo.numero + '(Abrir)</a></td>';
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
	$.ajax({
		url: '/api/processos/',
		dataType: 'json',
		success: function(data){
			//var fields = $( ":input" ).serializeArray();
			var fields = data.items;
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
$( ":checkbox, :radio" ).click( carregarTabela );
$( "select" ).change( carregarTabela );
