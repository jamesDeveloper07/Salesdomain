function carregarMais () {
    var posInicial = new Number(sessionStorage.getItem('posAtual')) + 1;
    var posFinal = posInicial + 3;
    carregarRankingVendas(posInicial, posFinal);
}

function carregarRankingVendas(posInicial, posFinal) {
    sessionStorage.setItem('posAtual', posFinal);
    loader(1);
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    var codigosFuncionarios = new Object();
    var onSuccess = function(result) {
        var arrayRanking = new Object();
        arrayRanking = result.resultado;
        ////console.log(arrayRanking);
        if (arrayRanking[1]) {
            for ( var i in arrayRanking) {
                if (i > 0) {
                    var posicao = arrayRanking[i].posicao;
                    var pes_cdpessoa = arrayRanking[i].pes_cdpessoa;
                    var fun_nmapelido = arrayRanking[i].fun_nmapelido;
                    var vendas = new Number(arrayRanking[i].vendas);
                    var idImg = "func" + posicao;
                    codigosFuncionarios[posicao] = pes_cdpessoa;
                    lista = "<li><a><img id='"+ idImg +"' src='images/loading.gif'/><h2>" + fun_nmapelido + "</h2><p>Valor das Vendas: " + "R$ " + (vendas).formatMoney(2, ',', '.') + "</p><span class='ui-li-count'>"+ posicao +"º</span></a></li>";
                    $('#listaRankingVendas').append(lista);
                }
            }

            $("#listaRankingVendas").listview( "refresh" );
            loader(0);
            carregarFotosRanking(codigosFuncionarios);
        }else{
            if(sessionStorage.getItem('posAtual') == "4"){
                var lista = "Sem ranking de vendas para o mês atual";
                $("#listaRankingVendas").html( lista );
                $("#listaRankingVendas").listview( "refresh" );
            }else{
                $('#popSemMaisRanking').popup("open");
            }
            $( "#btnCarregarMais" ).button( "disable" );
            loader(0);
        }
    };
    $.getJSON(servidor + '/sdp/sdp/salesdomain/vw_ranking_vendas/vw_ranking_vendasConsultGWT.jsp?op=getRankingVendas&mes='+ mes +'&ano='+ ano +'&posInicial='+ posInicial +'&posFinal=' + posFinal, onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema carregarRankingVendas");
            loader(0);
        });
}

function carregarFotosRanking (codigosFuncionarios) {
    //console.log(codigosFuncionarios);
    for (var i in codigosFuncionarios) {
        if(i > 0){
            var cdFunc = codigosFuncionarios[i];
            var idImg = "func" + i;
            var foto = servidor + '/sdp/sdp/common/tb_fun_funcionario/consultImage.jsp?op=find&tb_fun_funcionarioT.pes_cdpessoa='+ cdFunc +'&width=94&height=104';
            //console.log(foto);
            $('#' + idImg).attr('src', foto);
        }

    };
}

function attData(data) {
    var data = new Date();
    data = $('#dataTarefa').datepicker( 'getDate' );
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    var dataFormat =  dia + "/" + mes + "/" + ano;
    carregarTarefas(dataFormat);
}

function carregarTarefas(data) {
    loader(1);
    var onSuccess = function(result) {
        var arrayTarefas = new Object();
        arrayTarefas = result.resultado;
        if (arrayTarefas[1]) {
            var lista = "";
            for ( var i in arrayTarefas) {
                if (i > 0) {
                    var assunto = arrayTarefas[i].tar_nmassunto;
                    var descricao = arrayTarefas[i].tar_dstarefa;
                    var dataInicio = arrayTarefas[i].tar_dtinicio;
                    var dataFim = arrayTarefas[i].tar_dtfim;
                    var tpcompromisso = arrayTarefas[i].tar_tpcompromisso;
                    var prioridade = "";
                    var recorrencia = "";
                    switch (arrayTarefas[i].tar_cdprioridade) {
                        case "1":
                            prioridade = "Baixa";
                            break;
                        case "2":
                            prioridade = "Media";
                            break;
                        case "3":
                            prioridade = "Alta";
                            break;
                    }
                    if (arrayTarefas[i].tar_cdrecorrencia != 0) {
                        recorrencia = "Sim";
                    }

                    var icone = "";
                    if(tpcompromisso == "T"){
                        tpcompromisso = "Tarefa - ";
                    }else{
                        tpcompromisso = "Evento - ";
                    }


                    lista = lista + "<div data-role='collapsible'>"
                    + "<h3>" +tpcompromisso + assunto + "</h3>"
                    + "<p>Data Inicio: " + dataInicio
                    + "</br>Data Fim: " + dataFim
                    + "</br>Prioridade: " + prioridade
                    + "</br>Descri&ccedil;&atilde;o: " + descricao
                    + "</p>"
                    + "</div>";
                }
            }
            $('#listaTarefas').html(lista);
            $("#listaTarefas").collapsibleset( "refresh" );
            loader(0);
        }else{
            $('#listaTarefas').html("Sem Tarefas cadastradas para a data");
            loader(0);
        }

    };
    $.getJSON(servidor + '/sdp/sdp/common/tb_tar_tarefa/tb_tar_tarefaConsultGWT.jsp?op=consultByCpfAndDtFimRange&cpf=' + $('#login').text()
    + '&tb_tar_tarefaT.tar_dtinicio=' + data + ' 00:00' + '&tb_tar_tarefaT.tar_dtfim=' + data + ' 23:59', onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema carregarTarefas");
            loader(0);
        });
}

function carregarVisaoGeral(){
    attQtProspecAbertas();
    attQtPropDesvic();
}


//FALTA ALTERAR PARA TRAZER SOMENTE DO FUNCIONARIO
function attQtProspecAbertas () {
    loader(1);
    var onSuccess = function(result) {
        var cont = result.resultado.quantidade;
        $('#qtProspeccoesAberto').text(cont);
        loader(0);
    };

    $.getJSON(servidor + '/sdp/sdp/sales/vw_atendimento/vw_atendimentoConsultByDashBoardGWT.jsp?op=getQuantidadeProspeccoesAbertasByFuncionario&cpfFuncionario=' + $('#login').text(), onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema attQtProspecAbertas");
            loader(0);
        });
}

//FALTA ALTERAR PARA TRAZER SOMENTE DO FUNCIONARIO
function attQtPropDesvic () {
    loader(1);
    var onSuccess = function(result) {
        var cont = result.resultado.quantidade;
        $('#qtPropostasDesvinculadas').text(cont);
        loader(0);
    };

    $.getJSON(servidor + '/sdp/sdp/sales/tb_ven_venda/tb_ven_vendaConsultByDashBoardGWT.jsp?op=getQuantidadePropostasDesvinculadasByFuncionario&cpfFuncionario=' + $('#login').text(), onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema attQtPropDesvic");
            loader(0);
        });
}

function abrirGeral () {
    $('#abaGeral').show();
    $('#abaTarefas').hide();
    $('#abaRanking').hide();
    carregarVisaoGeral();
}

function abrirTarefas () {
    $('#abaGeral').hide();
    $('#abaTarefas').show();
    $('#abaRanking').hide();
    $('#dataTarefa').datepicker({ dateFormat: "dd/mm/yy" });
    $('#dataTarefa').val(dataAtual(1));
    carregarTarefas(dataAtual(1));
}

function abrirRanking () {
    $("#btnCarregarMais").button( "enable" );
    $("#listaRankingVendas").html("");
    $('#abaGeral').hide();
    $('#abaTarefas').hide();
    $('#abaRanking').show();
    carregarRankingVendas(1, 4);
}