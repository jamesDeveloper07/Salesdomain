var usuarioLogado = null;
var servidor = localStorage.getItem('servidor');
/*
 *
 * So para web*/

var url = servidor;
var logo = null;


if(servidor) {
    url = url.toString();
    url = url.split(".");
    urlCont = url[3].split("/");
    url = 'http://'+url[1] + '.salesdomain.com.br';
    logo = url + '/images/logo_empresa.png';
}else{
    console.log("\n\nELSE: ");
    console.log("\nSERVIDOR: " + servidor);
    console.log("\nLOGO: "+logo);
}


/*
//servidor localName  ||  http://localhost:8080
if(servidor) {
    var logo = url + '/sdp/images/logomarca.jpg';
}else{
    console.log("\n\nELSE: ");
    console.log("\nSERVIDOR: " + servidor);
    console.log("\nLOGO: "+logo);
}
*/


console.log(logo);
$('#logoEmpresa').attr("src", logo);

//Define transição padrão para 'nenhum'
$.mobile.defaultPageTransition = 'none';
$.mobile.defaultDialogTransition = 'none';
$.mobile.useFastClick = true;

$(document).delegate('#login', 'pageshow', function(event) {
    if(servidor == null){
        $.mobile.changePage( "#insereServidor", { role: "dialog" } );
    }
});

$(document).delegate('#home', 'pageshow', function(event) {
    atualizarIndiceSync();
});

// CARREGAR SCRIPTS DE ATENDIMENTO
$(document).delegate('#atendimento', 'pageinit', function () {
    $.getScript('js/telas/atendimento.js', function () {
        syncronizarBanco(carregarAtendimentos);
        carregarTipoProduto('#slcTipoProdutoAtendimento1');
        carregarMotivoEncerramentoProspeccao('#slcMotivoEncerramentoAtendimento');
    });
});

// CARREGAR SCRIPTS DE LEAD
$(document).delegate('#lead', 'pageinit', function () {
    $.getScript('js/telas/lead.js', function () {
        carregarMotivoEncerramentoLead('#slcMotivoEncerramentoLead');
    });
});

// CARREGAR SCRIPTS DE NOVO ATENDIMENTO
$(document).delegate('#novoAtendimento', 'pageinit', function () {
    //  $('#txtTelefoneAtendimento').mask("(99)9999-9999");
    // $('#txtTelefoneAtendimento1').mask("(99)9999-9999");
    //$('#txtTelefoneAtendimento2').mask("(99)9999-9999");
    //$('#txtTelefoneAtendimento3').mask("(99)9999-9999");
    //$('#txtDataHoraAtendimento').text(dataAtual(0));
    carregarTipoProduto('#slcTipoProdutoAtendimento');
});

// CARREGAR SCRIPTS DE COPA
$(document).delegate('#copa', 'pageinit', function () {
    $.getScript('js/telas/copa.js', function () {
        carregarVendedores('#slcVendedorCopa');
        carregarCardapio();
    });
});

// CARREGAR SCRIPTS DE encerrarAtendimento
$(document).delegate('#encerrarAtendimento', 'pageinit', function () {
    $.getScript('js/telas/vendas.js', function () {
        carregarMotivoEncerramentoProspeccao('#slcMotivoEncerramentoAtendimento2');
    });
});


$(document).delegate('#visaoGeral', 'pageshow', function () {
    carregarVisaoGeral();
});

$(document).delegate('#veiculosGestao', 'pageshow', function () {
    attVmMonetario();
});