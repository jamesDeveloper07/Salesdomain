function carregarVendas () {
    loader(1);
    var onSuccess = function(result) {
        var cdAtendimento = $('#cdAtendimento').text();
        var arrayVendas = new Object();
        arrayVendas = result.resultado;
        //console.log(arrayVendas);
        if (arrayVendas[1]) {
            var lista = "";
            for ( var i in arrayVendas) {
                if (i > 0) {
                    var nmProduto = arrayVendas[i].pro_nmproduto;
                    var nmCliente = arrayVendas[i].pes_nmpessoa;
                    var cdVenda = arrayVendas[i].ven_cdvenda;
                    lista = lista + "<li><a><h2>" + nmCliente + "</h2><p>Produto: " + nmProduto + "</p></a><a href='' onclick='vincularAtendimento("+ cdAtendimento + "," + cdVenda +")'></a></li>";
                }
            }
            $('#listaVendas').html(lista);
            $("#listaVendas").listview( "refresh" );
            loader(0);
        }else{
            $('#listaVendas').html("Sem Vendas a listar");
            loader(0);
        }
        var cdMotivoProspeccao = $('#cdMotivoEncerramento').text();
        if(cdMotivoProspeccao == null || cdMotivoProspeccao == "titulo" || cdMotivoProspeccao == "0") {
            $('.AvisoProspeccaoJaEncerrada').hide();
        }else{
            $('.MotivoEncerramentoProspeccao').hide();
            $('.AvisoProspeccaoJaEncerrada').show();
        }
    };

    $.getJSON(servidor + '/sdp/sdp/sales/vw_prevenda_venda/vw_prevenda_vendaConsultGWT.jsp?op=getAtendimentoMobileEmpty&cpfFuncionario=' + $('#login').text(), onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema carregarVendas");
            loader(0);
        });;
}

function carregarVendasNovo () {
    if(localStorage.getItem('loginOff') == 'false'){
        loader(1);
        var onSuccess = function(result) {
            var arrayVendas = new Object();
            arrayVendas = result.resultado;
            //console.log(arrayVendas);
            if (arrayVendas[1]) {
                var lista = "";
                for ( var i in arrayVendas) {
                    if (i > 0) {
                        var cdVenda = arrayVendas[i].ven_cdvenda;
                        var cdCliente = arrayVendas[i].pes_cdpessoa;
                        var nmCliente = arrayVendas[i].pes_nmpessoa;
                        var cdProduto = arrayVendas[i].pro_cdproduto;
                        var nmProduto = arrayVendas[i].pro_nmproduto;
                        var quantidade = 1;
                        //var quantidade = arrayVendas[i].quantidade;
                        var cdFuncionario = $('#codigo').text();
                        var tipoPessoa = '"' + arrayVendas[i].pes_tppessoa + '"';

                        var verAtendimento = [cdVenda, cdCliente, cdProduto, quantidade, cdFuncionario, tipoPessoa];
                        lista = lista + "<li><a><h2>" + nmCliente + "</h2><p>Produto: " + nmProduto + "</p></a><a href='' onclick='visualizarAtendimentoComProposta(" + verAtendimento +")'></a></li>";
                    }
                }
                $('#listaVendas').html(lista);
                $("#listaVendas").listview( "refresh" );
                loader(0);
            }else{
                $('#listaVendas').html("Sem Vendas sem a listar");
                loader(0);
            }
        };

        $.getJSON(servidor + '/sdp/sdp/sales/vw_prevenda_venda/vw_prevenda_vendaConsultGWT.jsp?op=getAtendimentoMobileEmpty&cpfFuncionario=' + $('#login').text(), onSuccess).fail(
            function() {
                alert("Falha na conexão, contate o administrador do sistema");
                loader(0);
            });;
    }else{
        $('#listaVendas').html("Não foi possível listar suas vendas!");
    }
}

function vincularAtendimento (cdAtendimento, cdVenda) {
    loader(1);
    var onSuccess = function(result) {
        //console.log(result.resultado.msg);
        if(result.resultado.msg == "Atendimento vinculado com sucesso!"){
            $('#popSucessoVinculo').popup("open");
            $('.BtnEncerrar').hide();
            $('.MotivoEncerramentoProspeccao').hide();
            $('.VendasSemVinculos').hide();
            $('.AvisoProspeccaoJaEncerrada').show();
            loader(0);
        }else{
            $('#popFalhaVinculo').popup("open");
            loader(0);
        }
    };

    var json = servidor + '/sdp/sdp/sales/tb_ven_venda/tb_ven_vendaUpdateDeleteGWT.jsp?op=vincularAtendimento&tb_ven_vendaT.ven_cdvenda=' + cdVenda + '&tb_ven_vendaT.ate_cdatendimento=' + cdAtendimento;
    $.getJSON(json, onSuccess).fail(
        function() {
            //salvabanco
        }
    );
}

function encerrarAtendimentoComMotivo (cdAtendimento, cdMotivo) {
    loader(1);
    var onSuccess = function(result) {
        //console.log(result.resultado.msg);
        if(result.resultado.msg == "Atendimento encerrado com sucesso!"){
            $('#popSucessoEncerramento').popup("open");
            $('.BtnEncerrar').hide();
            $('.MotivoEncerramentoProspeccao').hide();
            $('.AvisoProspeccaoJaEncerrada').show();
            loader(0);
        }else{
            $('#popFalhaEncerramento').popup("open");
            loader(0);
        }


    };

    var json = servidor + '/sdp/sdp/sales/tb_ate_atendimento/tb_ate_atendimentoUpdateDeleteGWT.jsp?op=encerrarAtendimentoComMotivo&tb_ate_atendimentoT.ate_cdatendimento=' + cdAtendimento+ '&tb_ate_atendimentoT.moe_cdmotivoencerramento=' + cdMotivo;
    $.getJSON(json, onSuccess).fail(
        function() {
            //salvabanco
        }
    );
}

function mostrarVendas(idClass, idBtn, cdMotivoProspeccao, cdMotivoBox, callback){

    console.log(cdMotivoProspeccao);

    if(cdMotivoProspeccao == null || cdMotivoProspeccao == "titulo" || cdMotivoProspeccao == "0") {
        $('.AvisoProspeccaoJaEncerrada').hide();
        if (cdMotivoBox == null || cdMotivoBox == "titulo") {
            $(idClass).hide();
            $(idBtn).hide();
        } else {
            if (cdMotivoBox == "1" && localStorage.getItem('fluxoEncerramentoIntegradoVenda') == 'true') {
                $(idClass).show();
                $(idBtn).hide();
            } else {
                $(idClass).hide();
                $(idBtn).show();
            }
        }
    }else{
        $(idClass).hide();
        $(idBtn).hide();
        $('.MotivoEncerramentoProspeccao').hide();
        $('.AvisoProspeccaoJaEncerrada').show();
    }

    if ( typeof callback == "function") {
        callback();
    }
}

function carregarMotivoEncerramentoProspeccao(id, callback) {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM motivoEncerramentoProspeccao', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $(id).last().append("<option value=" + row.moe_cdmotivoencerramento + ">" + row.moe_nmmotivoencerramento + "</option>");
            }

            if ( typeof callback == "function") {
                callback();
            }
        }, function(tx, error) {
            alert('Error ao carregar ' + error.message);
        });
    });
}