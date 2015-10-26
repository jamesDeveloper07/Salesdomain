function limpaCampos() {
    document.getElementById('txtPrecoAtendimento').value = "";
    document.getElementById('txtTotalAtendimento').value = "";
    //document.getElementById('txtComissaoAtendimento').value = "";
}

function calculaValores() {
    var quantidade = $('#sldQuantidadeAtendimento').val();
    var valorUnitario = $('#txtPrecoAtendimento').val().replace(".", "");
    var desconto = $('#txtDescontoAtendimento').val().replace(".", "");
    var total = parseFloat((quantidade * parseFloat(valorUnitario)) - parseFloat(desconto));
    //var percentComissao = 0.9;
    //var comissao = parseFloat((total * percentComissao) / 100);
    var respostaTotal = new Number(total).formatMoney(2, ',', '.');
    //var respostaComissao = new Number(comissao).formatMoney(2, ',', '.');
    document.getElementById('txtTotalAtendimento').value = respostaTotal;
    //document.getElementById('txtComissaoAtendimento').value = respostaComissao;
}

function atualizarValores(cdProduto) {
    limpaCampos();
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM produtos WHERE pro_cdproduto = "' + cdProduto + '"', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var dadosProduto = results.rows.item(i);
                if (dadosProduto) {
                    var valorProduto = new Number(dadosProduto.pro_vlprecoatual).formatMoney(2, ',', '.');
                    document.getElementById('txtPrecoAtendimento').value = valorProduto;
                    document.getElementById('sldQuantidadeAtendimento').value = 1;
                    calculaValores();
                    galeriaExterna(dadosProduto);
                } else {
                    document.getElementById('txtPrecoAtendimento').value = "";
                    document.getElementById('sldQuantidadeAtendimento').value = 1;
                }
            }
        }, function(tx, error) {
            alert('Ops' + error.message);
        });
    });

    loader(0);
}

function galeriaExterna(dadosProduto) {
    $('#btnDetalheProdutoAtendimento').button('disable');
    var hotsite = '"' + dadosProduto.pro_lkhotsite + '"';
    if (hotsite != "") {
        $('#btnDetalheProdutoAtendimento').button('enable');
        $('#btnDetalheProdutoAtendimento').attr("onclick", "mostrarGaleria(" + hotsite + ")");
    }
}

function carregarAtendimentos() {
    if (localStorage.getItem('loginOff') == 'false') {
        loader(1);
        var onSuccess = function(result) {
            var arrayAtendimentos = new Object();
            arrayAtendimentos = result.resultado;
            //console.log(arrayAtendimentos);
            if (arrayAtendimentos[1]) {
                var lista = "";
                for (var i in arrayAtendimentos) {
                    if (i > 0) {
                        var nmCliente = arrayAtendimentos[i].nomecliente;
                        var cdCliente = arrayAtendimentos[i].codigocliente;
                        var nmProduto = arrayAtendimentos[i].pro_nmproduto;
                        var nmExpectativa = arrayAtendimentos[i].exp_nmexpectativa;
                        var cdExpectativa = arrayAtendimentos[i].exp_cdexpectativa;
                        var valorProduto = arrayAtendimentos[i].pra_vlproduto;
                        var cdProduto = arrayAtendimentos[i].pro_cdproduto;
                        var cdTipoProduto = arrayAtendimentos[i].tip_cdtipoproduto;
                        var quantidade = arrayAtendimentos[i].pra_vlquantidade;
                        var situacao = arrayAtendimentos[i].exp_flsituacao;
                        var cdAtendimento = arrayAtendimentos[i].ate_cdatendimento;
                        var dtQuando = '"' + arrayAtendimentos[i].ate_dtquando + '"';
                        var dtInicio = '"' + arrayAtendimentos[i].ate_dtinicio + '"';
                        var dtFim = '"' + arrayAtendimentos[i].ate_dtfim + '"';
                        var cdFuncionario = arrayAtendimentos[i].codigofuncionario;
                        var tipoPessoa = '"' + arrayAtendimentos[i].tipopessoacliente + '"';
                        var observacao = '"' + arrayAtendimentos[i].ate_dsobservacao + '"';
                        var cdMotivoEncerramento = arrayAtendimentos[i].moe_cdmotivoencerramento;

                        observacao = observacao.replace (/'/g, "~"); //burlar bug do metodo visualizarLead

                        //if (situacao != 'E') {
                            var verAtendimento = [cdAtendimento, cdCliente, dtInicio, cdExpectativa, cdProduto, cdTipoProduto, quantidade, cdFuncionario, tipoPessoa, dtQuando, observacao, dtFim, cdMotivoEncerramento];
                            lista = lista + "<li><a onclick='visualizarAtendimento(" + verAtendimento + ")'> <h2>" + nmCliente + "</h2><p>Produto: " + nmProduto + "</p></a><a href='' onclick='encerrarPropeccao(" + cdAtendimento + ", " + cdMotivoEncerramento + ")'> Encerrar </a></li>";
                        //}
                    }
                }
                $('#listaAtendimentos').html(lista);
                $("#listaAtendimentos").listview("refresh");
                loader(0);
            } else {
                $('#listaAtendimentos').html("Sem Prospecções a listar");
                loader(0);
            }
        };

        var dtInicio = $('#dtInicio').val();
        var dtFim  =  $('#dtFim').val();

        var busca = "&cpfFuncionario="+$('#login').text();

        if($('#cdProspeccao').val() != "")
            busca += "&cdAtendimento="+$('#cdProspeccao').val();

        if($('#nmCliente').val() != "")
            busca += "&cliente="+$('#nmCliente').val();

        if(dtInicio != "")
            busca += "&dtInicio="+dtInicio;
        if(dtFim != "")
            busca += "&dtFinal="+dtFim;

        if($('#dtInicioCompra').val() != "")
            busca += "&prev_dtinicio="+$('#dtInicioCompra').val();
        if($('#dtFimCompra').val() != "")
            busca += "&prev_dtfim="+$('#dtFimCompra').val();

        if($('#slcTipoProdutoAtendimento1').val() != "" && $('#slcTipoProdutoAtendimento1').val() != "titulo") {
            busca += "&cdTipoPro=" + $('#slcTipoProdutoAtendimento1').val();
            if($('#slcProdutoAtendimento1').val() != "" && $('#slcProdutoAtendimento1').val() != "titulo")
                busca += "&cdProduto=" + $('#slcProdutoAtendimento1').val();
        }

        // $.getJSON(servidor + '/sdp/sdp/sales/vw_atendimento/vw_atendimentoConsultGWT.jsp?op=consultMobile&dtInicio=01/01/1900&dtFinal=' + dataAtual('1') + '&cliente=&tipo=A&cpf=&cpfFuncionario=' + $('#login').text(), onSuccess).fail(function() {
        $.getJSON(servidor + '/sdp/sdp/sales/vw_atendimento/vw_atendimentoConsultGWT.jsp?op=consultMobile'+ busca, onSuccess).fail(function() {
            alert("Falha na conexão, não foi possível resgatar os atendimentos! (carregarAtendimentos)");
            loader(0);
        });
    } else {
        $('#atendimentosOff').css('display', '');
    }
}


function carregarBuscaAtendimentos() {
    if (localStorage.getItem('loginOff') == 'false') {
        loader(1);
        var onSuccess = function(result) {
            var arrayAtendimentos = new Object();
            arrayAtendimentos = result.resultado;
            //console.log(arrayAtendimentos);
            if (arrayAtendimentos[1]) {
                var lista = "";
                for (var i in arrayAtendimentos) {
                    if (i > 0) {
                        var nmCliente = arrayAtendimentos[i].nomecliente;
                        var cdCliente = arrayAtendimentos[i].codigocliente;
                        var nmProduto = arrayAtendimentos[i].pro_nmproduto;
                        var nmExpectativa = arrayAtendimentos[i].exp_nmexpectativa;
                        var cdExpectativa = arrayAtendimentos[i].exp_cdexpectativa;
                        var valorProduto = arrayAtendimentos[i].pra_vlproduto;
                        var cdProduto = arrayAtendimentos[i].pro_cdproduto;
                        var cdTipoProduto = arrayAtendimentos[i].tip_cdtipoproduto;
                        var quantidade = arrayAtendimentos[i].pra_vlquantidade;
                        var situacao = arrayAtendimentos[i].exp_flsituacao;
                        var cdAtendimento = arrayAtendimentos[i].ate_cdatendimento;
                        var dtQuando = '"' + arrayAtendimentos[i].ate_dtquando + '"';
                        var dtInicio = '"' + arrayAtendimentos[i].ate_dtinicio + '"';
                        var dtFim = '"' + arrayAtendimentos[i].ate_dtfim + '"';
                        var cdFuncionario = arrayAtendimentos[i].codigofuncionario;
                        var tipoPessoa = '"' + arrayAtendimentos[i].tipopessoacliente + '"';
                        var observacao = '"' + arrayAtendimentos[i].ate_dsobservacao + '"';
                        var cdMotivoEncerramento = arrayAtendimentos[i].moe_cdmotivoencerramento;

                        observacao = observacao.replace(/'/g, "~"); //burlar bug do metodo visualizarLead


                        var verAtendimento = [cdAtendimento, cdCliente, dtInicio, cdExpectativa, cdProduto, cdTipoProduto, quantidade, cdFuncionario, tipoPessoa, dtQuando, observacao, dtFim, cdMotivoEncerramento];
                        lista = lista + "<li><a onclick='visualizarAtendimento(" + verAtendimento + ")'> <h2>" + nmCliente + "</h2><p>Produto: " + nmProduto + "</p></a> <a href='' onclick='encerrarPropeccao(" + cdAtendimento + ", " + cdMotivoEncerramento + ")'> Encerrar </a></li>";

                    }
                }
                $('#listaAtendimentos').html(lista);
                $("#listaAtendimentos").listview("refresh");
                loader(0);
            } else {
                $('#listaAtendimentos').html("Sem Prospecções a listar");
                loader(0);
            }
        };
        var dtInicio = $('#dtInicio').val();
        var dtFim  =  $('#dtFim').val();
        /*
         if(dtInicio == ""){
         dtInicio = "01/01/1900";
         }
         if(dtFim == ""){
         var dt = new Date();
         var month = dt.getMonth()+1;
         var day = dt.getDate();
         var year = dt.getFullYear();
         if(month < 10){month = "0"+month;}
         dtFim = day + '/' + month + '/' + year
         }
         */ //Comentado, pq o background já faz isto... (james)

        var busca = "&cpfFuncionario="+$('#login').text();

        if($('#cdProspeccao').val() != "")
            busca += "&cdAtendimento="+$('#cdProspeccao').val();

        if($('#nmCliente').val() != "")
            busca += "&cliente="+$('#nmCliente').val();

        if($('#telCliente').val() != "")
            busca += "&telefone="+$('#telCliente').val();

        if($('#cpfCnpjCliente').val() != "")
            busca += "&cpf="+$('#cpfCnpjCliente').val();

        if(dtInicio != "")
            busca += "&dtInicio="+dtInicio;
        if(dtFim != "")
            busca += "&dtFinal="+dtFim;

        if($('#dtInicioCompra').val() != "")
            busca += "&prev_dtinicio="+$('#dtInicioCompra').val();
        if($('#dtFimCompra').val() != "")
            busca += "&prev_dtfim="+$('#dtFimCompra').val();

        if($('#slcTipoProdutoAtendimento1').val() != "" && $('#slcTipoProdutoAtendimento1').val() != "titulo") {
            busca += "&cdTipoPro=" + $('#slcTipoProdutoAtendimento1').val();
            if($('#slcProdutoAtendimento1').val() != "" && $('#slcProdutoAtendimento1').val() != "titulo")
                busca += "&cdProduto=" + $('#slcProdutoAtendimento1').val();
        }

        if($('#slcSituacaoAtendimento').val() != "" && $('#slcSituacaoAtendimento').val() != "titulo") {
            busca += "&tipo=" + $('#slcSituacaoAtendimento').val();
            if($('#slcMotivoEncerramentoAtendimento').val() != "" && $('#slcMotivoEncerramentoAtendimento').val() != "titulo")
                busca += "&cdMotivoEncerramento=" + $('#slcMotivoEncerramentoAtendimento').val();
        }

        $.getJSON(servidor + '/sdp/sdp/sales/vw_atendimento/vw_atendimentoConsultGWT.jsp?op=consultByVariousByFunLogado'+busca, onSuccess).fail(function() {
            alert("Falha na conexão, não foi possível resgatar os atendimentos!");
            loader(0);
        });
    } else {
        $('#atendimentosOff').css('display', '');
    }
}

function encerrarPropeccao(cdAtendimento, cdMotivo) {
    $.ajax({
        type : "POST",
        url : 'pages/encerrarAtendimento.html',
        dataType : "html",
        success : function(data) {
            $('#encerrarAtendimento').html(data);
            mudarPagina('#encerrarAtendimento');
            apagarPagina('atendimento');
            $('#cdAtendimento').text(cdAtendimento);
            $('#cdMotivoEncerramento').text(cdMotivo);
            carregarVendas();
        }
    });
}

function novoComProposta() {
    $.ajax({
        type : "POST",
        url : 'pages/vendas.html',
        dataType : "html",
        success : function(data) {
            $('#vendas').html(data);
            mudarPagina('#vendas');
            apagarPagina('atendimento');
            carregarVendasNovo();
        }
    });
}

function adicionarAtendimento() {

    var cdLead =  $('#cdLead').text();
    //console.log("CODIGO LEAD parametro: " + cdLead);

    loader(1);
    var tipoPessoa = $('#slcTipoPessoaAtendimento').val();
    var cpfVendedor = $('#login').text();
    var codPessoaCliente = $('#txtNomeAtendimento').attr('name');
    var nomeCliente = $('#txtNomeAtendimento').val();
    var cpfCliente = $('#txtCPFAtendimento').val();
    var telCliente = "";
    var telCliente1 = "";
    var telCliente2 = "";
    var telCliente3 = "";
    var sexoCliente = $('#flpSexoAtendimento').val();

    //console.log("SEXO CLIENTE: "+sexoCliente)

    if (!codPessoaCliente) {
        codPessoaCliente = 0;
    }
    var txtTelefoneAtendimento = $('#txtTelefoneAtendimento').val();
    var txtDDDTelefoneAtendimento = $('#txtDDDTelefoneAtendimento').val();
    txtTelefoneAtendimento = txtDDDTelefoneAtendimento+''+txtTelefoneAtendimento;

    var txtTelefoneAtendimento1 = $('#txtTelefoneAtendimento1').val();
    var txtDDDTelefoneAtendimento1 = $('#txtDDDTelefoneAtendimento1').val();
    txtTelefoneAtendimento1 = txtDDDTelefoneAtendimento1+''+txtTelefoneAtendimento1;

    var txtTelefoneAtendimento2 = $('#txtTelefoneAtendimento2').val();
    var txtDDDTelefoneAtendimento2 = $('#txtDDDTelefoneAtendimento2').val();
    txtTelefoneAtendimento2 = txtDDDTelefoneAtendimento2+''+txtTelefoneAtendimento2;

    var txtTelefoneAtendimento3 = $('#txtTelefoneAtendimento3').val();
    var txtDDDTelefoneAtendimento3 = $('#txtDDDTelefoneAtendimento3').val();
    txtTelefoneAtendimento3 = txtDDDTelefoneAtendimento3+''+txtTelefoneAtendimento3;

    if (txtTelefoneAtendimento) {
        telCliente = txtTelefoneAtendimento.replace(/[^\d+]/g, "");
        telCliente1 = txtTelefoneAtendimento1.replace(/[^\d+]/g, "");
        telCliente2 = txtTelefoneAtendimento2.replace(/[^\d+]/g, "");
        telCliente3 = txtTelefoneAtendimento3.replace(/[^\d+]/g, "");
    }

    var codExpectativa = $('#slcExpectativaAtendimento').val();
    var email = $('#txtEmailAtendimento').val();
    var txtDtNascimento = $('#txtDtNascimento').val();
    // var dt = txtDtNascimento.split("-");
    //txtDtNascimento =dt[2]+"/"+dt[1]+"/"+dt[0];
    var dataQuando = $('#dataQuando').val();
    var dataInicio = dataAtual(1);
    var codProduto = $('#slcProdutoAtendimento').val();
    var quantidade = $('#sldQuantidadeAtendimento').val();
    var valorTotal = $('#txtTotalAtendimento').val().replace(".", "");
    var desconto = $('#txtDescontoAtendimento').val().replace(".", "");

    var txObservacao = $('#txObservacao').html();
    var observacao = encodeQueryStringImpl(txObservacao);

    var comentario = $('#txComentario').val();

    //console.log("OBSERVAÇÃO ENCODE: " + observacao);
//	txObservacao += 'latitude: ' + sessionStorage.getItem('latitude') + 'longitude' + sessionStorage.getItem('longitude');

    if (validarNovoAtendimento()) {
        carregarPagina('atendimento', 'novoAtendimento');
        var onSuccess = function(result) {
            //console.log(result.resultado);
            if (result.resultado == "Cadastro efetuado com sucesso!") {
                $('#popSucessoCadastro').popup("open");
                limparNovoAtendimento();
                carregarAtendimentos();
            } else {
                $('#popFalhaCadastro').popup("open");
                limparNovoAtendimento();
            }
        };
        var formaPagamento = $('#formaPagamento').val();
        var qtPodePagar = $('#qtPodePagar').val();
        var qtPodePagarParcelas = $('#qtPodePagarParcelas').val();
        var qtParcelas = $('#qtParcelas').val();
        if (qtPodePagar == "") {
            qtPodePagar = 0;
        }
        if (isNaN(parseFloat(qtPodePagarParcelas))) {
            qtPodePagarParcelas = 0;
        }
        if (qtParcelas == "") {
            qtParcelas = 0;
        }

        var canalProspeccao = $('#canalProspeccao').val();
        var origemProspeccao = $('#origemProspeccao').val();
        var produtoAtual = $('#produtoAtual').val();
        var anoModelo = $('#anoModelo').val();
        var marcaModeloReal = $('#marcaModeloReal').val();

        var latitude =0;// sessionStorage.getItem('latitude');
        var longitude =0;// sessionStorage.getItem('longitude');

        if(sessionStorage.getItem('latitude')){
            latitude = sessionStorage.getItem('latitude');
        }
        if(sessionStorage.getItem('longitude')){
            longitude = sessionStorage.getItem('longitude');
        }



        /*  Endereço     */

        var localidade_cep = $("#localidade_cep").val();
        var localidade_estado = $("#localidade_estado").val();
        var localidade_cidade = $("#localidade_cidade").val();
        var localidade_bairro = $("#localidade_bairro").val();
        var localidade_complemento = $("#localidade_complemento").val();
        var localidade_numero = $("#localidade_numero").val();
        var localidade_descritivo = $("#localidade_descritivo").val();
        var localidade_logradouro = $("#buscaLocalidade").val();
        var json_endereco = "";
        if(localStorage.getItem('loginOff')== "false"){
            if(localidade_bairro != "" && localidade_cidade != "" ){
                json_endereco += "&enderecoT.bairro_codigo="+localidade_bairro;
                json_endereco += "&enderecoT.cidade_codigo="+localidade_cidade;
                json_endereco += "&enderecoT.endereco_cep="+localidade_cep;
                json_endereco += "&enderecoT.endereco_logradouro="+localidade_logradouro;
                json_endereco += "&enderecoT.endereco_complemento="+localidade_complemento;
                json_endereco += "&enderecoT.endereco_numero="+localidade_numero;
            }
        }else{
            json_endereco += "&enderecoT.endereco_descritivo="+localidade_descritivo;
        }

        /*FIM ENDEREÇO*/

        var json = servidor + '/sdp/sdp/sales/tb_ate_atendimento/tb_ate_atendimentoInsertGWT.jsp?op=insert&isSystemWeb=true&tb_ate_atendimentoT.pes_cdpessoacliente=' + codPessoaCliente + '&tb_ate_atendimentoT.exp_cdexpectativa=' + codExpectativa + '&email=' + email + '&tb_ate_atendimentoT.ate_dtquando=' + dataQuando + '&tb_ate_atendimentoT.ate_dtinicio=' + dataInicio + '&cpfFuncionario=' + cpfVendedor + '&pro=' + codProduto + '*' + quantidade + '*' + parseFloat(desconto) + '*' + parseFloat(valorTotal) + '*' + formaPagamento + '*' + qtParcelas + '*' + parseFloat(qtPodePagar) + '*' + parseFloat(qtPodePagarParcelas) + '&nmCliente=' + nomeCliente + '&cpfCliente=' + cpfCliente;

        json += '&tb_ate_atendimentoT.ate_dsobservacao=' + observacao;

        if(cdLead != null && cdLead > 0){
            json += '&cdLead=' + cdLead;
        }
        if (telCliente > 0) {
            json += '&telClienteArray=' + telCliente;
        }
        if (telCliente1 > 0) {
            json += '&telClienteArray=' + telCliente1;
        }
        if (telCliente2 > 0) {
            json += '&telClienteArray=' + telCliente2;
        }
        if (telCliente3 > 0) {
            json += '&telClienteArray=' + telCliente3;
        }
        json += '&dtNascimento=' + txtDtNascimento;
        json += '&sexoCliente=' + sexoCliente;
        json += '&tipoPessoa=' + tipoPessoa;
        json += '&tb_ate_atendimentoT.pro_cdveiculoatual=' + produtoAtual;
        json += '&tb_ate_atendimentoT.ate_anoveiculo=' + anoModelo;
        json += '&tb_ate_atendimentoT.ate_veiculoreal=' + marcaModeloReal;
        json += '&tb_ate_atendimentoT.tpc_cd_tipo_contato=' + canalProspeccao;
        json += '&tb_ate_atendimentoT.acm_cdacaomarketing=' + origemProspeccao;
        json += '&tb_ate_atendimentoT.ate_vllatitude='+latitude;
        json += '&tb_ate_atendimentoT.ate_vllongitude='+longitude;

        if(comentario != null && comentario != ""){
            json += '&comentario='+comentario;
        }

        json += json_endereco;
        console.log(json);
        $.getJSON(json, onSuccess).fail(function() {
            salvarJSON(json);
        });
    } else {
        $('#popFalhaValidaCampos').popup("open");
        loader(0);
    }


}

function adicionarAtendimentoComVenda() {
    loader(1);
    var tipoPessoa = $('#slcTipoPessoaAtendimento').val();
    var cpfVendedor = $('#login').text();
    var codPessoaCliente = $('#txtNomeAtendimento').attr('name');
    var nomeCliente = "";
    var cpfCliente = "";
    var telCliente = "";
    var telCliente1 = "";
    var telCliente2 = "";
    var telCliente3 = "";
    var sexoCliente = "";
    if (!codPessoaCliente) {
        nomeCliente = $('#txtNomeAtendimento').val();
        cpfCliente = $('#txtCPFAtendimento').val();
        sexoCliente = $('#flpSexoAtendimento').val();
        codPessoaCliente = 0;
    }
    var txtTelefoneAtendimento = $('#txtTelefoneAtendimento').val();
    var txtDDDTelefoneAtendimento = $('#txtDDDTelefoneAtendimento').val();
    txtTelefoneAtendimento = txtDDDTelefoneAtendimento+''+txtTelefoneAtendimento;

    var txtTelefoneAtendimento1 = $('#txtTelefoneAtendimento1').val();
    var txtDDDTelefoneAtendimento1 = $('#txtDDDTelefoneAtendimento1').val();
    txtTelefoneAtendimento1 = txtDDDTelefoneAtendimento1+''+txtTelefoneAtendimento1;

    var txtTelefoneAtendimento2 = $('#txtTelefoneAtendimento2').val();
    var txtDDDTelefoneAtendimento2 = $('#txtDDDTelefoneAtendimento2').val();
    txtTelefoneAtendimento2 = txtDDDTelefoneAtendimento2+''+txtTelefoneAtendimento2;

    var txtTelefoneAtendimento3 = $('#txtTelefoneAtendimento3').val();
    var txtDDDTelefoneAtendimento3 = $('#txtDDDTelefoneAtendimento3').val();
    txtTelefoneAtendimento3 = txtDDDTelefoneAtendimento3+''+txtTelefoneAtendimento3;

    if (txtTelefoneAtendimento) {
        telCliente = txtTelefoneAtendimento.replace(/[^\d+]/g, "");
        telCliente1 = txtTelefoneAtendimento1.replace(/[^\d+]/g, "");
        telCliente2 = txtTelefoneAtendimento2.replace(/[^\d+]/g, "");
        telCliente3 = txtTelefoneAtendimento3.replace(/[^\d+]/g, "");
    }

    var codExpectativa = $('#slcExpectativaAtendimento').val();
    var dataQuando = dataAtual(1);
    var codProduto = $('#slcProdutoAtendimento').val();
    var quantidade = $('#sldQuantidadeAtendimento').val();
    var valorTotal = $('#txtTotalAtendimento').val().replace(".", "");
    var desconto = $('#txtDescontoAtendimento').val().replace(".", "");

    if (validarNovoAtendimento()) {
        carregarPagina('atendimento', 'verAtendimentoComVenda');
        var onSuccess = function(result) {
            //console.log(result);
            if (result.resultado == "Atendimento adicionado e proposta vinculada com sucesso!") {
                $('#popSucessoCadastroVinculado').popup("open");
            } else {
                $('#popFalhaCadastroVinculado').popup("open");
            }
        };

        var email = $('#txtEmailAtendimento').val();
        var txtDtNascimento = $('#txtDtNascimento').val();

        //var txObservacao = $('#txObservacao').val();
        var txObservacao = $('#txObservacao').html();
        var observacao = encodeQueryStringImpl(txObservacao);

        var formaPagamento = $('#formaPagamento').val();
        var qtPodePagar = $('#qtPodePagar').val();
        var qtPodePagarParcelas = $('#qtPodePagarParcelas').val();
        var qtParcelas = $('#qtParcelas').val();
        if (qtPodePagar == "") {
            qtPodePagar = 0;
        }
        if (isNaN(parseFloat(qtPodePagarParcelas))) {
            qtPodePagarParcelas = 0;
        }
        if (qtParcelas == "") {
            qtParcelas = 0;
        }

        var canalProspeccao = $('#canalProspeccao').val();
        var origemProspeccao = $('#origemProspeccao').val();
        var produtoAtual = $('#produtoAtual').val();
        var anoModelo = $('#anoModelo').val();
        var marcaModeloReal = $('#marcaModeloReal').val();

        var json = servidor + '/sdp/sdp/sales/tb_ate_atendimento/tb_ate_atendimentoInsertGWT.jsp?op=inserirVinculando&tb_ate_atendimentoT.pes_cdpessoacliente=' + codPessoaCliente + '&tb_ate_atendimentoT.exp_cdexpectativa=' + codExpectativa + '&tb_ate_atendimentoT.ate_dtquando=' + dataQuando + '&tb_ate_atendimentoT.ate_dtinicio=' + dataQuando + '&cpfFuncionario=' + cpfVendedor + '&pro=' + codProduto + '*' + quantidade + '*' + parseFloat(desconto) + '*' + parseFloat(valorTotal) + '&nmCliente=' + nomeCliente + '&cpfCliente=' + cpfCliente + '&telCliente=' + telCliente + '&sexoCliente=' + sexoCliente + '&tipoPessoa=' + tipoPessoa + '&ven_cdvenda=' + $('#cdVenda').text();

        json += '&tb_ate_atendimentoT.ate_dsobservacao=' + observacao;

        if (telCliente > 0) {
            json += '&telClienteArray=' + telCliente;
        }
        if (telCliente1 > 0) {
            json += '&telClienteArray=' + telCliente1;
        }
        if (telCliente2 > 0) {
            json += '&telClienteArray=' + telCliente2;
        }
        if (telCliente3 > 0) {
            json += '&telClienteArray=' + telCliente3;
        }

        json += '&dtNascimento=' + txtDtNascimento;
        json += '&sexoCliente=' + sexoCliente;
        json += '&tipoPessoa=' + tipoPessoa;
        json += '&tb_ate_atendimentoT.pro_cdveiculoatual=' + produtoAtual;
        json += '&tb_ate_atendimentoT.ate_anoveiculo=' + anoModelo;
        json += '&tb_ate_atendimentoT.ate_veiculoreal=' + marcaModeloReal;
        json += '&tb_ate_atendimentoT.tpc_cd_tipo_contato=' + canalProspeccao;
        json += '&tb_ate_atendimentoT.acm_cdacaomarketing=' + origemProspeccao;
        $.getJSON(json, onSuccess).fail(function() {
            salvarJSON(json);
        });
    } else {
        $('#popFalhaValidaCampos').popup("open");
        loader(0);
    }
}

function visualizarAtendimento(cdAtendimento, cdCliente, dtInicio, cdExpectativa, cdProduto, cdTipoProduto, quantidade, cdFuncionario, tipoPessoa, dtQuando, observacao, dtFim, cdMotivoEncerramento) {

    observacao = observacao.replace (/~/g, "'");  // desfaz replace anterior

    $.ajax({
        type : "POST",
        url : 'pages/verAtendimento.html',
        dataType : "html",
        success : function(data) {
            $('#verAtendimento').html(data);
            mudarPagina('#verAtendimento');
            apagarPagina('atendimento');

            function facaAlgo(oResto1, oResto2) {
                carregarTipoProduto('#slcTipoProdutoAtendimento', oResto1);
                carregarProdutos('#slcProdutoAtendimento', cdTipoProduto, oResto2);
            }

            function oResto1() {
                loader(1);
                $('#cdAtendimento').text(cdAtendimento);
                $('#cdMotivoEncerramento').text(cdMotivoEncerramento);
                $('#dataInicio').text(dtInicio);
                $('#dataQuando').val(dtQuando);

                //$('#txObservacao').val(observacao);
                $('#txObservacao').html(observacao);

                $('#codFuncionario').text(cdFuncionario);
                $('#slcTipoPessoaAtendimento').val(tipoPessoa);
                $('#slcTipoPessoaAtendimento').selectmenu('refresh');
                $('#slcTipoProdutoAtendimento').val(cdTipoProduto);
                $('#slcTipoProdutoAtendimento').selectmenu('refresh');
                buscarPorCdPessoa(cdCliente);
                $('#slcExpectativaAtendimento').val(cdExpectativa);
                $('#slcExpectativaAtendimento').selectmenu('refresh');
                $('#sldQuantidadeAtendimento').val(quantidade);
            }

            function oResto2() {
                loader(1);
                $('#slcProdutoAtendimento').val(cdProduto);
                $('#slcProdutoAtendimento').selectmenu('refresh');
                var nomeProduto = $('#slcProdutoAtendimento :selected').text();
                atualizarValores(cdProduto);
            }

            function callback(tpProduto) {
                console.log(tpProduto);
                return tpProduto;
            }

            facaAlgo(oResto1, oResto2);

            enableBtnEditar(dtFim);

        }
    });

    maisInformacoes(cdAtendimento, cdCliente);
}

function maisInformacoes(cdAtendimento, cdCliente) {

    var onSuccessPagamento = function(result) {
        loader(1);
        var valor = result.resultado[1];

        $('#formaPagamento').val(valor.fop_cdformapagamento);
        $('#formaPagamento').selectmenu('refresh');
        $('#qtPodePagar').val(valor.pra_vlentrada);
        $('#qtPodePagarParcelas').val(valor.pra_vlparcela);
        $('#qtParcelas').val(valor.pra_qtdparcela);
        loader(0);
    };

    var onSuccessMarcketing = function(result) {
        loader(1);
        var valor = result.resultado;
        valor = valor['tb_ate_atendimento'];
        $('#canalProspeccao').val(valor.tpc_cd_tipo_contato);
        $('#canalProspeccao').selectmenu('refresh');
        $('#origemProspeccao').val(valor.acm_cdacaomarketing);
        $('#origemProspeccao').selectmenu('refresh');
        $('#produtoAtual').val(valor.pro_cdveiculoatual);
        $('#produtoAtual').selectmenu('refresh');
        $('#anoModelo').val(valor.ate_anoveiculo);
        $('#marcaModeloReal').val(valor.ate_veiculoreal);
        loader(0);
    };

    var onSuccessCliente = function(result) {
        loader(1);
        var valor = result.resultado;
        valor = valor['vw_pessoa_fisica'];
        $('#txtDtNascimento').val(valor.pef_dtnascimento);
        $('#txtCPFAtendimento').val(valor.pef_cdcpf);
        loader(0);
    };

    $.getJSON(servidor + '/sdp/sdp/common/vw_pessoa_fisica/vw_pessoa_fisicaUpdateDeleteGWT.jsp?op=findbyid&vw_pessoa_fisicaT.pes_cdpessoa=' + cdCliente, onSuccessCliente).fail(function() {
        alert("Falha na conex�o, essa busca so poder� ser realizada online!");
        loader(0);
    });

    $.getJSON(servidor + '/sdp/sdp/sales/tb_pra_produto_atendimento/tb_pra_produto_atendimentoConsultGWT.jsp?op=consultByAtendimento&tb_pra_produto_atendimentoT.ate_cdatendimento=' + cdAtendimento, onSuccessPagamento).fail(function() {
        alert("Falha na conex�o, essa busca so poder� ser realizada online!");
        loader(0);
    });

    $.getJSON(servidor + '/sdp/sdp/sales/tb_ate_atendimento/tb_ate_atendimentoUpdateDeleteGWT.jsp?op=findbyid&tb_ate_atendimentoT.ate_cdatendimento=' + cdAtendimento, onSuccessMarcketing).fail(function() {
        alert("Falha na conex�o, essa busca so poder� ser realizada online!");
        loader(0);
    });
}

function visualizarAtendimentoComProposta(cdVenda, cdCliente, cdProduto, quantidade, cdFuncionario, tipoPessoa) {

    $.ajax({
        type : "POST",
        url : 'pages/verAtendimentoComVenda.html',
        dataType : "html",
        success : function(data) {
            $('#verAtendimentoComVenda').html(data);
            mudarPagina('#verAtendimentoComVenda');
            apagarPagina('vendas');

            getCdTipoProduto(cdProduto, callback);

            function callback(cdTipoProduto) {
                facaAlgo(oResto1, oResto2);

                function facaAlgo(oResto1, oResto2) {
                    carregarTipoProduto('#slcTipoProdutoAtendimento', oResto1);
                    carregarProdutos('#slcProdutoAtendimento', cdTipoProduto, oResto2);
                }

                function oResto1() {
                    loader(1);
                    $('#cdVenda').text(cdVenda);
                    $('#codFuncionario').text(cdFuncionario);
                    $('#slcTipoPessoaAtendimento').val(tipoPessoa);
                    $('#slcTipoPessoaAtendimento').selectmenu('refresh');
                    $('#slcTipoProdutoAtendimento').val(cdTipoProduto)
                    $('#slcTipoProdutoAtendimento').selectmenu('refresh');
                    buscarPorCdPessoa(cdCliente);
                    $('#sldQuantidadeAtendimento').val(quantidade);
                }

                function oResto2() {
                    loader(1);
                    $('#slcProdutoAtendimento').val(cdProduto);
                    $('#slcProdutoAtendimento').selectmenu('refresh');
                    var nomeProduto = $('#slcProdutoAtendimento :selected').text();
                    atualizarValores(cdProduto);
                }

            }

        }
    });
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

function carregarTipoProduto(id, callback) {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tipoProduto', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $(id).last().append("<option value=" + row.tip_cdtipoproduto + ">" + row.tip_nmtipoproduto + "</option>");
            }

            if ( typeof callback == "function") {
                callback();
            }
        }, function(tx, error) {
            alert('Error ao carregar ' + error.message);
        });
    });

}

function mostrarMotivos(idClass, idBox, codigoSituacao, callback){
    if(codigoSituacao != null && codigoSituacao != "titulo" && codigoSituacao != "A"  ){
        $(idClass).show();
    }else{
        $(idBox).val("titulo");
        $(idBox).selectmenu('refresh');
        $(idClass).hide();
    }

    if ( typeof callback == "function") {
        callback();
    }

}

function carregarProdutos(id, codigoTipoProduto, callback) {
    loader(1);
    limparSelect(id, "Selecione um Produto");
    $(id).selectmenu('refresh', true);
    var codTipoProduto = codigoTipoProduto;

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM produtos WHERE tip_cdtipoproduto = "' + codTipoProduto + '"', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $(id).last().append("<option value=" + row.pro_cdproduto + ">" + row.pro_nmproduto + "</option>");
            }

            if ( typeof callback == "function") {
                callback();
            }
        }, function(tx, error) {
            alert('Error ao carregar ' + error.message);
        });
    });

    loader(0);
}

function buscarPorCdPessoa(cdPessoa) {
    loader(1);

    var onSuccess = function(result) {
        var dadosCliente = result.resultado[1];
        if (dadosCliente) {

            $('#txtCPFAtendimento').val(dadosCliente.documento);

            $('#txtNomeAtendimento').val(dadosCliente.pes_nmpessoa);
            $('#txtEmailAtendimento').val(dadosCliente.pes_txemail);
            $('#txtNomeAtendimento').attr("name", dadosCliente.pes_cdpessoa);

            $('#slcTipoPessoaAtendimento').val(dadosCliente.pes_tppessoa);
            $('#slcTipoPessoaAtendimento').selectmenu('refresh');
            $('#slcTipoPessoaAtendimento').selectmenu("disable");

            if(dadosCliente.pes_tppessoa == "J") {
                //$('#flpSexoAtendimento').slider('refresh');
                $('#flpSexoAtendimento').slider('disable');
            }else {
                var onSuccessPef = function (result3) {
                    var dadosPef = result3.resultado[1];
                    $('#flpSexoAtendimento').val(dadosPef.pef_tpsexo);
                    $('#flpSexoAtendimento').slider('refresh');
                    $('#flpSexoAtendimento').slider('disable');
                };

                $.getJSON(servidor + '/sdp/sdp/common/tb_pef_pessoa_fisica/tb_pef_pessoa_fisicaConsultGWT.jsp?op=consultByPes_cdpessoa&tb_pef_pessoa_fisicaT.pes_cdpessoa=' + dadosCliente.pes_cdpessoa, onSuccessPef).fail(function () {
                    alert("Falha na conex�o, essa busca so poder� ser realizada online (Consult PEF)!");
                    loader(0);
                });
            }

            var onSuccess2 = function(result2) {
                dadosCliente2 = result2.resultado[1];
                if (dadosCliente2) {
                    var strTel = new String(dadosCliente2.tel_nrtelefone);
                    var telefone =  strTel.substring(0, 4) + "-" + strTel.substring(4, 8);
                    $('#txtDDDTelefoneAtendimento').val(dadosCliente2.tel_cdddd);
                    $('#txtDDDTelefoneAtendimento').attr("name", dadosCliente2.tel_cdddd);
                    $('#txtTelefoneAtendimento').val(telefone);
                    $('#txtTelefoneAtendimento').attr("name", telefone);
                } else {
                    $('#txtTelefoneAtendimento').val("");
                    $('#txtTelefoneAtendimento').attr("name", "");
                }

                if (result2.resultado[2]) {
                    var telCli = result2.resultado[2];
                    var strTe2 = new String(telCli.tel_nrtelefone);
                    var telefone2 =  telCli.tel_nrtelefone.substring(0, 4) + '-' + telCli.tel_nrtelefone.substring(4, 8);
                    $('#telefone1').show();
                    $('#txtDDDTelefoneAtendimento1').val( telCli.tel_cdddd);
                    $('#txtTelefoneAtendimento1').val(telefone2);
                }

                if (result2.resultado[3]) {
                    var telCli = result2.resultado[3];
                    var strTe2 = new String(telCli.tel_nrtelefone);
                    var telefone3 =  telCli.tel_nrtelefone.substring(0, 4) + '-' + telCli.tel_nrtelefone.substring(4, 8);
                    $('#telefone2').show();
                    $('#txtDDDTelefoneAtendimento2').val( telCli.tel_cdddd);
                    $('#txtTelefoneAtendimento2').val(telefone3);
                }

                if (result2.resultado[4]) {
                    var telCli = result2.resultado[4];
                    var strTe2 = new String(telCli.tel_nrtelefone);
                    var telefone4 = telCli.tel_nrtelefone.substring(0, 4) + '-' + telCli.tel_nrtelefone.substring(4, 8);
                    $('#telefone3').show();
                    $('#txtDDDTelefoneAtendimento3').val( telCli.tel_cdddd);
                    $('#txtTelefoneAtendimento3').val(telefone4);
                }
            };

            $.getJSON(servidor + '/sdp/sdp/common/tb_tel_telefone/tb_tel_telefoneConsultGWT.jsp?op=consultByCodPessoa&tb_tel_telefoneT.pes_cdpessoa=' + dadosCliente.pes_cdpessoa, onSuccess2).fail(function() {
                alert("Falha na conex�o, essa busca so poder� ser realizada online (Consult TEL)!");
                loader(0);
            });

            //console.log(result);
        } else {
            $('#txtNomeAtendimento').val("");
            $('#txtNomeAtendimento').attr("name", "");
            $('#txtTelefoneAtendimento').val("");
            $('#txtTelefoneAtendimento').attr("name", "");
            var cpf = $('#txtCPFAtendimento').val();
            if (cpf.length == 14) {
                $('#flpSexoAtendimento').slider('disable');
            } else {
                $('#flpSexoAtendimento').slider('enable');
            }
            //$('#flpSexoAtendimento').slider('refresh');
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/vw_pessoa/vw_pessoaConsultGWT.jsp?op=consultByPes_cdpessoa&vw_pessoaT.pes_cdpessoa=' + cdPessoa, onSuccess).fail(function() {
        alert("Falha na conex�o, essa busca so poder� ser realizada online (Consult PES)!");
        loader(0);
    });
}

function buscarDadosCliente() {
    var CPF = $('#txtCPFAtendimento').val();
    var nome = $('#txtNomeAtendimento').val();
    var telefone = $('txtTelefoneAtendimento').val();

    if (CPF != "") {
        buscarPorCPF(CPF);
    } else if (nome != "") {
        if (nome.length < 5) {
            $('#popNomeInvalido').popup("open");
        } else {
            var cpfLogado = $('#login').text();
            buscarPorNome(nome, cpfLogado);
        }
    } else {
        //buscarPorTelefone();
    }
}

function buscarPorNome(nome, cpfLogado) {
    loader(1);
    var onSuccess = function(result) {
        loader(0);
        var arrayClientes = result.resultado;
        var lista = "";
        if (arrayClientes[1]) {
            for (var i in arrayClientes) {
                if (i > 0) {
                    var tipoPessoa = arrayClientes[i].pes_tppessoa;
                    var tipoPessoa2 = '"' + arrayClientes[i].pes_tppessoa + '"';
                    var cdCliente = arrayClientes[i].pes_cdpessoa;
                    var nome = arrayClientes[i].pes_nmpessoa;
                    var nome = arrayClientes[i].pes_nmpessoa;
                    var nomeString = '"' + arrayClientes[i].pes_nmpessoa + '"';
                    if (tipoPessoa == "F") {
                        var cpf = arrayClientes[i].documento;
                        lista = lista + "<li><a onclick='exibirCliente(" + cpf + "," + cdCliente + "," + nomeString + "," + tipoPessoa2 + ")'> <h2>" + nome + "</h2><p>CPF: " + cpf + "</p></a></li>";
                    } else {
                        var cnpj = arrayClientes[i].documento;
                        lista = lista + "<li><a onclick='exibirCliente(" + cnpj + "," + cdCliente + "," + nomeString + "," + tipoPessoa2 + ")'> <h2>" + nome + "</h2><p>CNPJ: " + cnpj + "</p></a></li>";
                    }
                }
            }
            $('#listaCliente').html(lista);
            var maxHeight = $(window).height() - 30;
            $('#popListaClientes').css('max-height', maxHeight + 'px');
            $("#popListaClientes").css('overflow-y', 'scroll');
            $("#popListaClientes").popup("open");
            $('#listaCliente').listview("refresh");
        } else {
            $('#txtNomeAtendimento').attr("name", "");
            $('#txtTelefoneAtendimento').attr("name", "");
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/vw_pessoa/vw_pessoaConsultGWT.jsp?op=consultByNome&vw_pessoaT.pes_nmpessoa=' + nome + "&cpfFuncionario=" + cpfLogado, onSuccess).fail(function() {
        alert("Falha na conexão, contate o administrador do sistema buscarPorNome");
        loader(0);
    });
}


function exibirCliente(cpf, cdCliente, nome, tipoPessoa) {
    $('#popListaClientes').popup("close");
    loader(1);
    $('#txtCPFAtendimento').val(cpf);
    $('#txtNomeAtendimento').val(nome);
    $('#txtNomeAtendimento').attr("name", cdCliente);
    $('#flpSexoAtendimento').slider('disable');
    $('#slcTipoPessoaAtendimento').val(tipoPessoa);
    $('#slcTipoPessoaAtendimento').selectmenu("refresh");
    $('#slcTipoPessoaAtendimento').selectmenu("disable");
    $('#txtCPFAtendimento').attr('readonly', 1);
    $('#txtNomeAtendimento').attr('readonly', 1);
    var onSuccess = function(result) {
        loader(0);
        var dadosCliente = result.resultado[1];
        if (dadosCliente) {
            var strTel = new String(dadosCliente.tel_nrtelefone);
            var telefone =  strTel.substring(0, 4) + "-" + strTel.substring(4, 8);

            $('#txtDDDTelefoneAtendimento').val(dadosCliente.tel_cdddd);
            $('#txtDDDTelefoneAtendimento').attr("name", dadosCliente.tel_cdddd);
            $('#txtTelefoneAtendimento').val(telefone);
            $('#txtTelefoneAtendimento').attr("name", telefone);

        } else {
            $('#txtTelefoneAtendimento').val("");
            $('#txtTelefoneAtendimento').attr("name", "");
        }

        if (result.resultado[2]) {
            var telCli = result.resultado[2];
            var strTe2 = new String(telCli.tel_nrtelefone);
            var telefone2 =  telCli.tel_nrtelefone.substring(0, 4) + '-' + telCli.tel_nrtelefone.substring(4, 8);
            $('#telefone1').show();
            $('#txtDDDTelefoneAtendimento1').val( telCli.tel_cdddd);
            $('#txtTelefoneAtendimento1').val(telefone2);
        }

        if (result.resultado[3]) {
            var telCli = result.resultado[3];
            var strTe2 = new String(telCli.tel_nrtelefone);
            var telefone3 =  telCli.tel_nrtelefone.substring(0, 4) + '-' + telCli.tel_nrtelefone.substring(4, 8);
            $('#telefone2').show();
            $('#txtDDDTelefoneAtendimento2').val( telCli.tel_cdddd);
            $('#txtTelefoneAtendimento2').val(telefone3);
        }

        if (result.resultado[4]) {
            var telCli = result.resultado[4];
            var strTe2 = new String(telCli.tel_nrtelefone);
            var telefone4 = telCli.tel_nrtelefone.substring(0, 4) + '-' + telCli.tel_nrtelefone.substring(4, 8);
            $('#telefone3').show();
            $('#txtDDDTelefoneAtendimento3').val( telCli.tel_cdddd);
            $('#txtTelefoneAtendimento3').val(telefone4);
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/tb_tel_telefone/tb_tel_telefoneConsultGWT.jsp?op=consultByCodPessoa&tb_tel_telefoneT.pes_cdpessoa=' + cdCliente, onSuccess).fail(function() {
        alert("Falha na conexão, contate o administrador do sistema exibirCliente");
        loader(0);
    });
}

function buscarPorCPF(CPF) {

    loader(1);

    var onSuccess = function(result) {
        if (!validarCpfCnpj()) {
            $('#popCpfCnpjInvalido').popup("open");
            loader(0);
        } else {
            var dadosCliente = result.resultado[1];
            if (dadosCliente) {
                $('#txtNomeAtendimento').val(dadosCliente.pes_nmpessoa);
                $('#txtNomeAtendimento').attr("name", dadosCliente.pes_cdpessoa);
                $('#slcTipoPessoaAtendimento').val(dadosCliente.pes_tppessoa);
                $('#slcTipoPessoaAtendimento').selectmenu("refresh");
                $('#slcTipoPessoaAtendimento').selectmenu("disable");
                $('#flpSexoAtendimento').slider('disable');
                $('#txtCPFAtendimento').attr('readonly', 1);
                $('#txtNomeAtendimento').attr('readonly', 1);
                $('#txtEmailAtendimento').val(dadosCliente.pes_txemail);

                var onSuccess2 = function(result2) {
                    loader(0);
                    dadosCliente2 = result2.resultado[1];
                    if (result2.resultado[1]) {
                        dadosCliente2 = result2.resultado[1];
                        var strTel = new String(dadosCliente2.tel_nrtelefone);
                        var ddd = dadosCliente2.tel_cdddd;
                        var telefone = strTel.substring(0, 4) + "-" + strTel.substring(4, 8);
                        $('#txtDDDTelefoneAtendimento').val(ddd);
                        $('#txtTelefoneAtendimento').val(telefone);
                        $('#txtTelefoneAtendimento').attr("name", telefone);
                    } else {
                        $('#txtTelefoneAtendimento').val("");
                        $('#txtTelefoneAtendimento').attr("name", "");
                    }

                    if (result2.resultado[2]){
                        var dados = result2.resultado[2];
                        var strTel = new String(dados.tel_nrtelefone);
                        var ddd1 = dados.tel_cdddd;
                        var telefone1 = strTel.substring(0, 4) + "-" + strTel.substring(4, 8);
                        $('#txtDDDTelefoneAtendimento1').val(ddd1);
                        $('#txtTelefoneAtendimento1').val(telefone1);
                        $('#txtTelefoneAtendimento1').attr("name", telefone1);
                        $('#telefone1').show();
                    }

                    if (result2.resultado[3]){
                        var dados = result2.resultado[3];
                        var strTel = new String(dados.tel_nrtelefone);
                        var ddd1 = dados.tel_cdddd;
                        var telefone1 = strTel.substring(0, 4) + "-" + strTel.substring(4, 8);
                        $('#txtDDDTelefoneAtendimento2').val(ddd1);
                        $('#txtTelefoneAtendimento2').val(telefone1);
                        $('#txtTelefoneAtendimento2').attr("name", telefone1);
                        $('#telefone2').show();
                    }

                    if (result2.resultado[4]){
                        var dados = result2.resultado[4];
                        var strTel = new String(dados.tel_nrtelefone);
                        var ddd1 = dados.tel_cdddd;
                        var telefone1 = strTel.substring(0, 4) + "-" + strTel.substring(4, 8);
                        $('#txtDDDTelefoneAtendimento3').val(ddd1);
                        $('#txtTelefoneAtendimento3').val(telefone1);
                        $('#txtTelefoneAtendimento3').attr("name", telefone1);
                        $('#telefone3').show();
                    }
                };
                $.getJSON(servidor + '/sdp/sdp/common/tb_tel_telefone/tb_tel_telefoneConsultGWT.jsp?op=consultByCodPessoa&tb_tel_telefoneT.pes_cdpessoa=' + dadosCliente.pes_cdpessoa, onSuccess2);
                //console.log(result);
            } else {
                $('#txtNomeAtendimento').val("");
                $('#txtNomeAtendimento').attr("name", "");
                $('#txtTelefoneAtendimento').val("");
                $('#txtTelefoneAtendimento').attr("name", "");
                var cpf = $('#txtCPFAtendimento').val();
                $('#flpSexoAtendimento').slider('enable');
                if (cpf.length == 14) {
                    $('#flpSexoAtendimento').slider('disable');
                } else {
                    $('#flpSexoAtendimento').slider('enable');
                }
                loader(0);
            }
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/tb_pes_pessoa/tb_pes_pessoaConsultGWT.jsp?op=consultByDocumento&documento=' + CPF, onSuccess).fail(function() {
        alert("Falha na conexão, para realizar essa busca você precisa estar online!");
        loader(0);
    });
}

function enderecos(cdPessoa) {
    loader(1);
    var onSuccess = function (result) {
        loader(0);
        var arrayEnderecos = result.resultado;
        var lista = "";
        if (arrayEnderecos[1]) {
            for (var i in arrayEnderecos) {
                if (i > 0) {
                    var endereco_numero = '"' + arrayEnderecos[i].endereco_numero + '"';
                    var endereco_cep = '"' + arrayEnderecos[i].endereco_cep + '"';
                    var endereco_logradouro = arrayEnderecos[i].endereco_logradouro;
                    var endereco_complemento = arrayEnderecos[i].endereco_complemento;
                    var cidade_codigo = arrayEnderecos[i].cidade_codigo;
                    var bairro_codigo = arrayEnderecos[i].bairro_codigo;
                    var endereco_descritivo = arrayEnderecos[i].endereco_descritivo;
                    var endereco_codigo = arrayEnderecos[i].endereco_codigo;

                    if(cidade_codigo != 0) {
                        buscaBairro(bairro_codigo,endereco_codigo) ;
                        buscaCidade(cidade_codigo,endereco_codigo);
                        lista += "<li>" +
                        "<p><strong>Estado:</strong> <span id='valorEstado"+endereco_codigo+"'</p>" +
                        "<p><strong>Cidade:</strong> <span id='valorCidade"+endereco_codigo+"'</p>" +
                        "<p><strong>Bairro:</strong> <span id='valorBairro"+endereco_codigo+"'</p>" +
                        "<p><strong>Logradouro:</strong> " + endereco_logradouro + "</p>" +
                        "<p><strong>Número:</strong> " + endereco_numero.replace(/"/g,"") + "</p>" +
                        "<p><strong>Complemento:</strong> " + endereco_complemento + "</p>" +
                        "<p><strong>CEP:</strong> " + endereco_cep.replace(/"/g,"") + "</p>" +
                        "</li>";
                    }else{
                        lista += "<li>" +
                        "<p><strong>Descrição:</strong> " + endereco_descritivo + "</p>" +
                        "</li>";
                    }
                }
            }
            $('#listaEnderecos').html(lista);
            var maxHeight = $(window).height() - 30;
            $('#popListaEnderecos').css('max-height', maxHeight + 'px');
            $("#popListaEnderecos").css('overflow-y', 'scroll');
            $("#popListaEnderecos").popup("open");
            $('#listaEnderecos').listview("refresh");
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/endereco/enderecoConsultGWT.jsp?op=consultByPessoa&pesCodigo=' + cdPessoa, onSuccess).fail(function () {
        alert("Falha na conexão, contate o administrador do sistema buscarPorNome");
        loader(0);
    });
}


function comentarios(cdAtendimento) {
    loader(1);
    var onSuccess = function (result) {
        loader(0);
        var arrayComentarios = result.resultado;
        var lista = "";
        if (arrayComentarios[1]) {
            for (var i in arrayComentarios) {
                if (i > 0) {
                    var coa_cdcomentario = arrayComentarios[i].coa_cdcomentario;
                    var ate_cdatendimento = arrayComentarios[i].ate_cdatendimento;
                    var coa_cdcomentariopai = arrayComentarios[i].coa_cdcomentariopai;
                    var coa_dtcadastro = arrayComentarios[i].coa_dtcadastro;
                    var coa_dscomentario = arrayComentarios[i].coa_dscomentario;
                    var pes_cdpessoacriador = arrayComentarios[i].pes_cdpessoacriador;
                    var coa_flleitura = arrayComentarios[i].coa_flleitura;

                    if(pes_cdpessoacriador != 0) {
                        buscarNomeFuncionario(pes_cdpessoacriador, coa_cdcomentario);
                        lista += "<li>" +
                        "<p><strong>Comentario:</strong> " + coa_dscomentario + "</p>" +
                        "<p><strong>De:</strong> <span id='valorNomeFuncionario"+coa_cdcomentario+"'</p>" +
                        "<p><strong>Em:</strong> " + coa_dtcadastro + "</p>" +
                        "</li>";
                    }else{
                        lista += "<li>" +
                        "<p><strong>Comentario:</strong> " + coa_dscomentario + "</p>" +
                        "<p><strong>De:</strong>  Desconhecido</p>" +
                        "<p><strong>Em:</strong> " + coa_dtcadastro + "</p>" +
                        "</li>";
                    }
                }
            }
            $('#listaComentarios').html(lista);
            var maxHeight = $(window).height() - 30;
            $('#popListaComentarios').css('max-height', maxHeight + 'px');
            $("#popListaComentarios").css('overflow-y', 'scroll');
            $("#popListaComentarios").popup("open");
            $('#listaComentarios').listview("refresh");
        }
    };
    $.getJSON(servidor + '/sdp/sdp/sales/tb_coa_comentario_atendimento/tb_coa_comentario_atendimentoConsultGWT.jsp?op=consultByAte_cdatendimento&tb_coa_comentario_atendimentoT.ate_cdatendimento=' + cdAtendimento, onSuccess).fail(function () {
        alert("Falha na conexão, contate o administrador do sistema Comentarios");
        loader(0);
    });
}


function buscaBairro(cdBairro,enderecoCodigo){
    var onSuccess = function (result) {
        var bairro = result.resultado;
        $("#valorBairro"+enderecoCodigo).text(bairro.bairro.bairro_descricao);
    };
    $.getJSON(servidor + '/sdp/sdp/common/bairro/bairroUpdateDeleteGWT.jsp?op=findbyid&bairroT.bairro_codigo=' + cdBairro, onSuccess).fail(function () {
        loader(0);
    });
}

function buscaCidade(cdCidade,enderecoCodigo){
    var onSuccess = function (result) {
        var cidade = result.resultado;
        $("#valorCidade"+enderecoCodigo).text(cidade.cidade.cidade_descricao);
        $("#valorEstado"+enderecoCodigo).text(buscaEstados(cidade.cidade.uf_codigo));
    };
    $.getJSON(servidor + '/sdp/sdp/common/cidade/cidadeUpdateDeleteGWT.jsp?op=findbyid&cidadeT.cidade_codigo=' + cdCidade, onSuccess).fail(function () {
        loader(0);
    });
}

function buscaEstados(cdEstado){
    var estados = [];
    estados[1] = "Acre";
    estados[2] = "Alagoas";
    estados[3] = "Amapá";
    estados[4] = "Amazonas";
    estados[5] = "Bahia";
    estados[6] = "Ceará";
    estados[7] = "Distrito Federal";
    estados[8] = "Espirito Santo";
    estados[10] = "Goiás";
    estados[11] = "Maranhão";
    estados[12] = "Mato Grosso";
    estados[13] = "Mato Grosso do Sul";
    estados[14] = "Minas Gerais";
    estados[15] = "Pará";
    estados[16] = "Paraiba";
    estados[17] = "Paraná";
    estados[18] = "Pernambuco";
    estados[19] = "Piauí";
    estados[20] = "Rio de Janeiro";
    estados[21] = "Rio Grande do Norte";
    estados[22] = "Rio Grande do Sul";
    estados[23] = "Rondônia";
    estados[9] = "Roraima";
    estados[25] = "Santa Catarina";
    estados[26] = "São Paulo";
    estados[27] = "Sergipe";
    estados[24] = "Tocantis";
    return estados[cdEstado];
}



function encerrarAtendimento(cdAtendimento) {
    $('#popConfirmaExclusao').popup("open");
    $("#btnExcluirAtendimento").click(function() {
        loader(1);
        var onSuccess = function(result) {
            carregarAtendimentos();
        };
        $.getJSON(servidor + '/sdp/sdp/sales/tb_ate_atendimento/tb_ate_atendimentoUpdateDeleteGWT.jsp?op=encerrarAtendimento&tb_ate_atendimentoT.ate_cdatendimento=' + cdAtendimento, onSuccess).fail(function() {
            alert("Falha na conex�o, contate o administrador do sistema encerrarAtendimento");
            loader(0);
        });
    });
}



function editarAtendimento() {
    loader(1);
    var tipoPessoa = $('#slcTipoPessoaAtendimento').val();
    var nomeCliente = $('#txtNomeAtendimento').val();
    var cpfVendedor = $('#login').text();
    var cdAtendimento = $('#cdAtendimento').text();
    var cpfCliente = $('#txtCPFAtendimento').val();
    var dataInicio = $('#dataInicio').text();
    var codFuncionario = $('#codFuncionario').text();
    var codPessoaCliente = $('#txtNomeAtendimento').attr('name');
    var codExpectativa = $('#slcExpectativaAtendimento').val();
    var dataQuando = $('#dataQuando').val();
    var codProduto = $('#slcProdutoAtendimento').val();
    var quantidade = $('#sldQuantidadeAtendimento').val();
    var valorTotal = $('#txtTotalAtendimento').val().replace(".", "");
    var desconto = $('#txtDescontoAtendimento').val().replace(".", "");
    var sexoCliente = $('#flpSexoAtendimento').val();
    var telCliente = "";
    var telCliente1 = "";
    var telCliente2 = "";
    var telCliente3 = "";

    var txtTelefoneAtendimento = $('#txtTelefoneAtendimento').val();
    var txtDDDTelefoneAtendimento = $('#txtDDDTelefoneAtendimento').val();
    txtTelefoneAtendimento = txtDDDTelefoneAtendimento+''+txtTelefoneAtendimento;

    var txtTelefoneAtendimento1 = $('#txtTelefoneAtendimento1').val();
    var txtDDDTelefoneAtendimento1 = $('#txtDDDTelefoneAtendimento1').val();
    txtTelefoneAtendimento1 = txtDDDTelefoneAtendimento1+''+txtTelefoneAtendimento1;

    var txtTelefoneAtendimento2 = $('#txtTelefoneAtendimento2').val();
    var txtDDDTelefoneAtendimento2 = $('#txtDDDTelefoneAtendimento2').val();
    txtTelefoneAtendimento2 = txtDDDTelefoneAtendimento2+''+txtTelefoneAtendimento2;

    var txtTelefoneAtendimento3 = $('#txtTelefoneAtendimento3').val();
    var txtDDDTelefoneAtendimento3 = $('#txtDDDTelefoneAtendimento3').val();
    txtTelefoneAtendimento3 = txtDDDTelefoneAtendimento3+''+txtTelefoneAtendimento3;

    if (txtTelefoneAtendimento) {
        telCliente = txtTelefoneAtendimento.replace(/[^\d+]/g, "");
        telCliente1 = txtTelefoneAtendimento1.replace(/[^\d+]/g, "");
        telCliente2 = txtTelefoneAtendimento2.replace(/[^\d+]/g, "");
        telCliente3 = txtTelefoneAtendimento3.replace(/[^\d+]/g, "");
    }


    var email = $('#txtEmailAtendimento').val();
    var txtDtNascimento = $('#txtDtNascimento').val();

    //var txObservacao = $('#txObservacao').val();
    var txObservacao = $('#txObservacao').html();
    var observacao = encodeQueryStringImpl(txObservacao);

    var formaPagamento = $('#formaPagamento').val();
    var qtPodePagar = $('#qtPodePagar').val();
    var qtPodePagarParcelas = $('#qtPodePagarParcelas').val();
    var qtParcelas = $('#qtParcelas').val();
    if (qtPodePagar == "") {
        qtPodePagar = 0;
    }
    if (isNaN(parseFloat(qtPodePagarParcelas))) {
        qtPodePagarParcelas = 0;
    }
    if (qtParcelas == "") {
        qtParcelas = 0;
    }

    var canalProspeccao = $('#canalProspeccao').val();
    var origemProspeccao = $('#origemProspeccao').val();
    var produtoAtual = $('#produtoAtual').val();
    var anoModelo = $('#anoModelo').val();
    var marcaModeloReal = $('#marcaModeloReal').val();


    /*ENDEREÇOS
     var localidade_cep = $("#localidade_cep").val();
     var localidade_estado = $("#localidade_estado").val();
     var localidade_cidade = $("#localidade_cidade").val();
     var localidade_bairro = $("#localidade_bairro").val();
     var localidade_complemento = $("#localidade_complemento").val();
     var localidade_numero = $("#localidade_numero").val();
     var localidade_descritivo = $("#localidade_descritivo").val();
     var localidade_logradouro = $("#buscaLocalidade").val();
     var json_endereco = "";
     if(localStorage.getItem('loginOff')== "false"){
     json_endereco += "&enderecoT.bairro_codigo="+localidade_bairro;
     json_endereco += "&enderecoT.cidade_codigo="+localidade_cidade;
     json_endereco += "&enderecoT.endereco_cep="+localidade_cep;
     json_endereco += "&enderecoT.endereco_logradouro="+localidade_logradouro;
     json_endereco += "&enderecoT.endereco_complemento="+localidade_complemento;
     json_endereco += "&enderecoT.endereco_numero="+localidade_numero;
     }else{
     json_endereco += "&enderecoT.endereco_descritivo="+localidade_descritivo;
     }
     */
    var json = servidor + '/sdp/sdp/sales/tb_ate_atendimento/tb_ate_atendimentoUpdateDeleteGWT.jsp?op=update&isSystemWeb=true&tb_ate_atendimentoT.ate_dtinicio=' + dataInicio ;
    json +='&tb_ate_atendimentoT.ate_cdatendimento=' + cdAtendimento ;
    json += '&tb_ate_atendimentoT.pes_cdpessoafuncionario=' + codFuncionario ;
    json +='&tb_ate_atendimentoT.pes_cdpessoacliente=' + codPessoaCliente ;
    json +='&tb_ate_atendimentoT.exp_cdexpectativa=' + codExpectativa ;

    json +='&tb_ate_atendimentoT.ate_dtquando=' + dataQuando ;


    json +='&pro=' + codProduto + '*' + quantidade + '*' + parseFloat(desconto) + '*' + parseFloat(valorTotal)+'*'+formaPagamento+'*'+qtParcelas + '*' + parseFloat(qtPodePagar) + '*' + parseFloat(qtPodePagarParcelas);

    json +='&tb_ate_atendimentoT.ate_dsobservacao=' + observacao;

    if (telCliente > 0) {
        json += '&telClienteArray=' + telCliente;
    }
    if (telCliente1 > 0) {
        json += '&telClienteArray=' + telCliente1;
    }
    if (telCliente2 > 0) {
        json += '&telClienteArray=' + telCliente2;
    }
    if (telCliente3 > 0) {
        json += '&telClienteArray=' + telCliente3;
    }
    json += '&dtNascimento=' + txtDtNascimento;
    json += '&sexoCliente=' + sexoCliente;
    json += '&tipoPessoa=' + tipoPessoa;
    json += '&tb_ate_atendimentoT.pro_cdveiculoatual=' + produtoAtual;
    json += '&tb_ate_atendimentoT.ate_anoveiculo=' + anoModelo;
    json += '&tb_ate_atendimentoT.ate_veiculoreal=' + marcaModeloReal;
    json += '&tb_ate_atendimentoT.tpc_cd_tipo_contato=' + canalProspeccao;
    json += '&tb_ate_atendimentoT.acm_cdacaomarketing=' + origemProspeccao;
    json +='&email=' + email;
    json +='&nmCliente=' + nomeCliente;
    json +='&cpfCliente='+ cpfCliente;
    json +='&cpfFuncionario='+ cpfVendedor;
    // json +=json_endereco;
    console.log(json);
    $.post(json, onSuccess).fail(function() {
        alert("Falha na conexão, contate o administrador do sistema editarAtendimento");
        loader(0);
    });

    if (validarEditarAtendimento()) {
        carregarPagina('atendimento', 'verAtendimento');
        var onSuccess = function(result) {
            if (result.resultado.msg == "Alteracao efetuada com sucesso!") {
                $('#popSucessoEditar').popup("open");
                carregarAtendimentos();
            } else {
                $('#popFalhaEditar').popup("open");
            }
        };

    } else {
        $('#popFalhaValidaCampos').popup("open");
        loader(0);
    }
}

function buscarCodVendedorPorCpf(cpf) {
    var onSuccess = function(result) {
        var codigo = result.resultado[1].pes_cdpessoa;
        return codigo;
    };

    $.getJSON(servidor + '/sdp/sdp/common/vw_funcionario/vw_funcionarioConsultGWT.jsp?op=consultByCpf&vw_funcionarioT.pef_cdcpf=' + cpf, onSuccess).fail(function() {
        alert("Falha na conex�o, contate o administrador do sistema buscarCodVendedorPorCpf");
        loader(0);
    });
}


function buscarCodFuncionarioLogado() {
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("Você está on-line!!!");
        var cpf = $('#login').text();
        console.debug(cpf);

        var onSuccess = function(result) {
            var arrayPessoas = new Object();
            arrayPessoas = result.resultado;
            if (arrayPessoas[1]) {
                var cdPessoa = arrayPessoas[1].pes_cdpessoa;
                $('#codFuncionarioLogado').text(cdPessoa);
            }
        };

        $.getJSON(servidor + '/sdp/sdp/common/vw_funcionario/vw_funcionarioConsultGWT.jsp?op=consultByCpf&vw_funcionarioT.pef_cdcpf=' + cpf, onSuccess).fail(function() {
            alert("Falha na conex�o, contate o administrador do sistema buscarCodFuncionarioLogado");
            loader(0);
        });
    } else {
        console.debug("Você não está on-line!!!")
    }
}


function buscarNomeFuncionario(cdFun, coa_cdcomentario) {
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("Você está on-line!!!");
        var cpf = $('#login').text();
        console.debug(cpf);

        var onSuccess = function(result) {
            var arrayPessoas = new Object();
            arrayPessoas = result.resultado;
            if (arrayPessoas[1]) {
                var nmPessoa = arrayPessoas[1].pes_nmpessoa;
                $("#valorNomeFuncionario"+coa_cdcomentario).text(nmPessoa);
            }
        };

        $.getJSON(servidor + '/sdp/sdp/common/vw_funcionario/vw_funcionarioConsultGWT.jsp?op=findbyid&vw_funcionarioT.pes_cdpessoa=' + cdFun, onSuccess).fail(function() {
            alert("Falha na conex�o, contate o administrador do sistema buscarNomeFuncionario");
            loader(0);
        });
    } else {
        console.debug("Você não está on-line!!!")
    }
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};

function enviarComentario(cdFuncionarioLogado, cdAtendimento, cdFuncionarioCriador, txComentario){
    loader(1);
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("CdFuncionarioLogado: " + cdFuncionarioLogado);
        console.debug("Atendimento: " + cdAtendimento);
        console.debug("CdFuncionarioCriador: " + cdFuncionarioCriador);
        console.debug("Comentário: " + txComentario);
        var d = new Date();
        dformat = [  d.getDate().padLeft(),
            (d.getMonth()+1).padLeft(),
            d.getFullYear()].join('/') +' ' +
        [d.getHours().padLeft(),
            d.getMinutes().padLeft()].join(':');
        console.debug("Data Quando: " +  dformat);
        var coe_flleitura;
        if(cdFuncionarioCriador == cdFuncionarioLogado){
            coe_flleitura = 1;
        }else{
            coe_flleitura = 0;
        }

        var onSuccess = function(result) {
            console.log(result.resultado);
            if (result.resultado == "Cadastro efetuado com sucesso!") {
                loader(0);
                $('#popSucessoEnviarComentario').popup("open");
                limparComentario();
            } else {
                loader(0);
                $('#popFalhaEnviarComentario').popup("open");
            }
        };


        var json = servidor + '/sdp/sdp/sales/tb_coa_comentario_atendimento/tb_coa_comentario_atendimentoInsertGWT.jsp';
        json +='?op=insert';
        json +='&tb_coa_comentario_atendimentoT.ate_cdatendimento=' + cdAtendimento;
        json +='&tb_coa_comentario_atendimentoT.coa_dtcadastro=' + dformat ;
        json +='&tb_coa_comentario_atendimentoT.coa_dscomentario=' + txComentario;
        json +='&tb_coa_comentario_atendimentoT.pes_cdpessoacriador=' + cdFuncionarioLogado;
        json +='&tb_coa_comentario_atendimentoT.coa_flleitura=' + coe_flleitura;

        console.log(json);

        $.getJSON(json, onSuccess).fail(function() {
            alert("Falha na conexão, contate o administrador do sistema enviarComentario");
            loader(0);
        });

        /*
         $.post(json, onSuccess).fail(function() {
         alert("Falha na conexão, contate o administrador do sistema enviarComentario");
         loader(0);
         });
         */

    } else {
        loader(0);
        console.debug("Você não está on-line!!!")
    }
}

function limparNovoAtendimento() {
    $('#slcVendedor').show();
    $('#txtCPFAtendimento').val("");
    $('#txtTelefoneAtendimento').val("");
    $('#txtTelefoneAtendimento2').val("");
    $('#txtTelefoneAtendimento3').val("");
    $('#txtTelefoneAtendimento4').val("");
    $('#txtDDDTelefoneAtendimento').val("");
    $('#txtDDDTelefoneAtendimento2').val("");
    $('#txtDDDTelefoneAtendimento3').val("");
    $('#txtDDDTelefoneAtendimento4').val("");
    $('#txtNomeAtendimento').val("");
    $('#slcTipoPessoaAtendimento').val("titulo");
    $('#sldQuantidadeAtendimento').val(1);
    $('#flpSexoAtendimento').slider('enable');
    $('#slcExpectativaAtendimento').val("titulo");
    $('#slcTipoProdutoAtendimento').val("titulo");
    $('#slcProdutoAtendimento').val("titulo");
    $('#slcExpectativaAtendimento').selectmenu('refresh');
    $('#slcTipoProdutoAtendimento').selectmenu('refresh');
    limparSelect('#slcProdutoAtendimento', "Selecione um Produto");
    $('#slcProdutoAtendimento').selectmenu('refresh');
    $('#slcVendedorAtendimento').val("titulo");
    $('#slcVendedorAtendimento').selectmenu('refresh');
}

function limparPesquisar() {
    $('#txtCPFAtendimento').val("");
    $('#txtCPFAtendimento').removeAttr('readonly', 1);
    $('#txtTelefoneAtendimento').val("");
    $('#txtTelefoneAtendimento1').val("");
    $('#txtTelefoneAtendimento2').val("");
    $('#txtTelefoneAtendimento3').val("");
    $('#txtDDDTelefoneAtendimento').val("");
    $('#txtDDDTelefoneAtendimento1').val("");
    $('#txtDDDTelefoneAtendimento2').val("");
    $('#txtDDDTelefoneAtendimento3').val("");
    $('#txtNomeAtendimento').val("");
    $('#txtNomeAtendimento').removeAttr('readonly', 1);
    $('#slcTipoPessoaAtendimento').selectmenu('enable');
    $('#slcTipoPessoaAtendimento').val("titulo");
    $('#slcTipoPessoaAtendimento').selectmenu('refresh');
    $('#flpSexoAtendimento').slider('enable');
}

function limparComentario() {
    $('#txComentario').val("");
}



function limparPesquisaProspeccao() {
    $('#txtCPFAtendimento').val("");

    var dt = new Date();
    var month = dt.getMonth()+1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    if(month < 10){month = "0"+month;}
    $('#dtInicio').val(day + '/' + month + '/' + year);
    $('#dtFim').val(day + '/' + month + '/' + year);
    $('#cdProspeccao').val("");
    $('#nmCliente').val("");
    $('#cpfCnpjCliente').val("");
    $('#telCliente').val("");
    $('#dtFimCompra').val("");
    $('#dtInicioCompra').val("");

    limparSelect('#slcProdutoAtendimento1', "Selecione um Produto");
    $('#slcProdutoAtendimento1').selectmenu('refresh', true);

    $('#slcTipoProdutoAtendimento1').val("titulo");
    $('#slcTipoProdutoAtendimento1').selectmenu('refresh');

    $('#slcSituacaoAtendimento').val("titulo");
    $('#slcSituacaoAtendimento').selectmenu('refresh');

    $('#slcMotivoEncerramentoAtendimento').val("titulo");
    $('#slcMotivoEncerramentoAtendimento').selectmenu('refresh');

    $('.MotivoEncerramentoProspeccao').hide();
}

function validarCpfCnpj() {
    var cpfPessoaCliente = $('#txtCPFAtendimento').val();
    if (isCpfCnpj("" + cpfPessoaCliente) == false) {
        return false;
    } else {
        return true;
    }
}

function validarNovoAtendimento() {
    var codPessoaCliente = $('#txtNomeAtendimento').val();
    var codExpectativa = $('#slcExpectativaAtendimento').val();
    var codProduto = $('#slcProdutoAtendimento').val();
    var valorTotal = $('#txtTotalAtendimento').val();
    var tipoPessoa = $('#slcTipoPessoaAtendimento').val();

    if (tipoPessoa != "titulo" && codPessoaCliente && codProduto && valorTotal && codExpectativa != "titulo") {
        return true;
    } else {
        return false;
    }

}

function validarEditarAtendimento() {
    var codPessoaCliente = $('#txtNomeAtendimento').val();
    var codExpectativa = $('#slcExpectativaAtendimento').val();
    var codProduto = $('#slcProdutoAtendimento').val();
    var valorTotal = $('#txtTotalAtendimento').val();

    if (codPessoaCliente && codProduto && valorTotal && codExpectativa != "titulo") {
        return true;
    } else {
        return false;
    }

}

function salvarLocalizacao() {

    if (!navigator.geolocation) {
        return;
    }

    function success(position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var tempo = position.timestamp;
        var flEnvio = 0;

        sessionStorage.setItem('latitude', latitude);
        sessionStorage.setItem('longitude', longitude);
        /*if (window.openDatabase){
         var banco = window.openDatabase("localizacao", "1.0", "Criando banco", 4 * 1024 * 1024);

         banco.transaction( function (tx) {
         tx.executeSql('CREATE TABLE IF NOT EXISTS tabelaDeDados (Latitude, Longitude, Data, FL_ENVIO)', <!-- CRIANDO A TABELA SE N�O EXISTIR-->
         [],
         function ()
         {
         tx.executeSql(
         'INSERT INTO tabelaDeDados (Latitude, Longitude, Data, FL_ENVIO) VALUES ("'+position.coords.longitude+'", "'+position.coords.latitude+'", "'+position.timestamp+'", "'+0+'")');
         });

         });
         }*/

    };
    function error() {

    };
    navigator.geolocation.getCurrentPosition(success, error);
}

//CAnal de Prospeccao
/*
 function carregarCanalProspeccao(id ,codigoCanalProspeccao, callback) {
 loader(1);
 limparSelect(id, "Selecione um Canal de prospec��o");
 $(id).selectmenu('refresh', true);
 var codTipoProduto = codigoTipoProduto;

 banco.transaction( function (tx) {
 tx.executeSql( 'SELECT * FROM produtos WHERE tip_cdtipoproduto = "' + codTipoProduto + '"', [],
 function (tx, results){
 var quant = results.rows.length;
 for (var i = 0; i < quant; i++)
 {
 var row = results.rows.item(i);
 $(id).last().append("<option value=" + row.pro_cdproduto + ">"
 + row.pro_nmproduto + "</option>");
 }

 if (typeof callback == "function") {
 callback();
 }
 },
 function (tx, error)
 {
 alert('Error ao carregar' + error.message);
 });
 });

 loader(0);
 }
 */

function carregarCanalProspeccao() {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM canalProspecacao', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $('#canalProspeccao').last().append("<option value=" + row.tpc_cd_tipo_contato + ">" + row.tpc_tx_descricao + "</option>");
            }
        }, function(tx, error) {
            alert('Error ao carregar' + error.message);
        });
    });
    loader(0);
}

function carregaracaoMarketing() {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM acaoMarketing where acm_flsituacao = "A"', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $('#origemProspeccao').last().append("<option value=" + row.acm_cdacaomarketing + ">" + row.acm_nmacaomarketing + "</option>");
            }
        }, function(tx, error) {
            alert('Error ao carregar' + error.message);
        });
    });
    loader(0);
}

function produtosReferencia() {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM produtos WHERE tip_cdtipoproduto = "1"', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $('#produtoAtual').last().append("<option value=" + row.pro_cdproduto + ">" + row.pro_nmproduto + "</option>");
            }
        }, function(tx, error) {
            alert('Ops' + error.message);
        });
    });

    loader(0);
}

function formaPagamento() {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM formaPagamento WHERE fop_flativo = "A"', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $('#formaPagamento').last().append("<option value=" + row.fop_cdformapagamento + ">" + row.fop_nmformapagamento + "</option>");
            }
        }, function(tx, error) {
            alert('Ops ' + error.message);
        });
    });

    loader(0);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function carregarDadosLead(nmCliente, txEmail){
    loader(1);

    $('#txtNomeAtendimento').val(nmCliente);
    $('#txtEmailAtendimento').val(txEmail);
    $('#txtNomeAtendimento').attr("name", "");

    loader(0);
}

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

function encodeQueryStringImpl(decodedURLComponent) {
    var regexp = /%20/g;
    return encodeURIComponent(decodedURLComponent).replace(regexp, "+");
}


function enableBtnEditar(dtFim) {
    console.log("DATA FIM: " + dtFim);
    console.log("ENTROU NO ENABLE_BTN")
    if (dtFim != null && dtFim != "") {
        console.log("NO IF")
        $('#situacaoAberto').hide();
        $('#situacaoEncerrado').show();
        $('#btnEditarAtendimento').hide();
    } else {
        console.log("NO ELSE");
        $('#situacaoAberto').show();
        $('#situacaoEncerrado').hide();
        $('#btnEditarAtendimento').show();
    }
}