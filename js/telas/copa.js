function enviarPedido () {
    loader(1);
    var cpfVendedor = $('#slcVendedorCopa').val();
    var codItem = $('#slcCardapio').val();
    var observacao = $('#txtaObservacao').val();

    if(validarCopa()){
        carregarPagina('home', 'copa');

        var onSuccess = function(result) {
            ////console.log(result.resultado);
            if(result.resultado == "Cadastro efetuado com sucesso!"){
                $('#popSucessoPedido').popup("open");
            }else{
                $('#popFalhaPedido').popup("open");
            }
            loader(0);
        };
        //FALTA VERIFICAR OBSERVAÇÃO
        $.getJSON(servidor + '/sdp/sdp/common/tb_ped_pedido/tb_ped_pedidoInsertGWT.jsp?op=insertMobile&cpfUsuario=' + $('#login').text()
        + '&tb_ped_pedidoT.car_cdcardapio=' + codItem
        + '&tb_ped_pedidoT.ped_statuspedido=A'
        + '&tb_ped_pedidoT.ped_observacao=' + observacao
        + '&cpfReceber=' + cpfVendedor, onSuccess).fail(
            function() {
                alert("Falha na conexão, contate o administrador do sistema enviarPedido");
                loader(0);
            });
    }else{
        $('#popFalhaValidaCamposCopa').popup("open");
        loader(0);
    }
}

function carregarCardapio () {
    loader(1);
    var onSuccess = function(result) {
        var cardapio = new Object();
        cardapio = result.resultado;
        if (cardapio[1]) {
            for ( var i in cardapio) {
                if (i > 0) {
                    var id = cardapio[i].car_cdcardapio;
                    var nome = cardapio[i].car_nmcardapio;
                    $('#slcCardapio').last().append("<option value=" + id + ">" + nome +"</option>");
                }
            }
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/tb_car_cardapio/tb_car_cardapioConsultGWT.jsp?op=consult', onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema carregarCardapio");
            loader(0);
        });
}

function validarCopa () {
    var cpfVendedor = $('#slcVendedorCopa').val();
    var codItem = $('#slcCardapio').val();

    if(cpfVendedor && codItem != "titulo"){
        return true;
    }else{
        return false;
    }
}