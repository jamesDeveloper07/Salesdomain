function carregarBuscaLeads() {
    if (localStorage.getItem('loginOff') == 'false') {
        loader(1);
        var onSuccess = function(result) {
            var arrayLeads = new Object();
            arrayLeads = result.resultado;
            //console.log(arrayLeads);
            if (arrayLeads[1]) {
                var lista = "";
                for (var i in arrayLeads) {
                    if (i > 0) {


                        var lea_cdlead = arrayLeads[i].lea_cdlead;

                        var lea_nmpessoa = '"' +  arrayLeads[i].lea_nmpessoa+'"'; //só passa no método visualizarLead() se colocar as aspas;
                        var nmCliente =  arrayLeads[i].lea_nmpessoa;

                        var lea_txemail = '"' + arrayLeads[i].lea_txemail + '"';
                        var lea_nrtelefone = arrayLeads[i].lea_nrtelefone;
                        var lea_cdddd  =  arrayLeads[i].lea_cdddd;
                        var lea_linkorigem  = '"' +  arrayLeads[i].lea_linkorigem+ '"';
                        var lea_dsobservacao  = '"'+arrayLeads[i].lea_dsobservacao+'"';

                        lea_dsobservacao = lea_dsobservacao.replace (/'/g, "~"); //burlar bug do metodo visualizarLead

                        var pes_cdpessoafuncionario  =  arrayLeads[i].pes_cdpessoafuncionario;
                        var pes_cdpessoacliente  =  arrayLeads[i].pes_cdpessoacliente;
                        var loj_cdloja  =  arrayLeads[i].loj_cdloja;
                        var ate_cdatendimento  =  arrayLeads[i].ate_cdatendimento;
                        var lea_florigem  =  arrayLeads[i].lea_florigem;
                        var acc_cdacaocampanha  =  arrayLeads[i].acc_cdacaocampanha;
                        var exp_cdexpectativa  =  arrayLeads[i].exp_cdexpectativa;
                        var moe_cdmotivoencerramento  =  arrayLeads[i].moe_cdmotivoencerramento;
                        var lea_dtcadastro  = '"' +  arrayLeads[i].lea_dtcadastro+ '"';
                        var lea_dsjustificativaencerramento  = '"' +  arrayLeads[i].lea_dsjustificativaencerramento+ '"';

                        /*
                        var nmCliente = arrayLeads[i].nomecliente;
                        var cdCliente = arrayLeads[i].codigocliente;
                        var cdExpectativa = arrayLeads[i].exp_cdexpectativa;
                        var situacao = arrayLeads[i].exp_flsituacao;
                        var cdLead = arrayLeads[i].lea_cdLead;
                        var dtQuando = '"' + arrayAtendimentos[i].ate_dtquando + '"';
                        var dtInicio = '"' + arrayAtendimentos[i].ate_dtinicio + '"';
                        var cdFuncionario = arrayAtendimentos[i].codigofuncionario;
                        var tipoPessoa = '"' + arrayAtendimentos[i].tipopessoacliente + '"';
                        var observacao = '"' + arrayAtendimentos[i].ate_dsobservacao + '"';
                        */

                        //if (moe_cdmotivoencerramento != null && moe_cdmotivoencerramento == '0' ) {
                            var verLead = [lea_cdlead, pes_cdpessoacliente, lea_nmpessoa, lea_txemail, lea_cdddd, lea_nrtelefone, lea_dtcadastro, pes_cdpessoafuncionario, lea_dtcadastro, exp_cdexpectativa, lea_dsobservacao, ate_cdatendimento, moe_cdmotivoencerramento];
                            lista = lista + "<li><a onclick='visualizarLead(" + verLead + ")'> <h2>" + nmCliente + "</h2><p></p></a><a href='' onclick=''></a></li>";
                        //}
                    }
                }
                $('#listaLeads').html(lista);
                $("#listaLeads").listview("refresh");
                loader(0);
            } else {
                $('#listaLeads').html("Sem Leads a listar");
                loader(0);
            }
        };

        //var busca = "&cpfFuncionario="+$('#login').text();
        var busca = "";

        busca += "&cpfUsuarioLogado="+$('#login').text();

        //if($('#nmCliente').val() != "")
            busca += "&tb_lea_leadT.lea_nmpessoa="+$('#nmCliente').val();

       // if($('#emailCliente').val() != "")
            busca += "&tb_lea_leadT.lea_txemail="+$('#emailCliente').val();

        if($('#telDDDCliente').val() != "")
            busca += "&tb_lea_leadT.lea_cdddd="+$('#telDDDCliente').val();
        else
            busca += "&tb_lea_leadT.lea_cdddd=0";


        if($('#telCliente').val() != "")
            busca += "&tb_lea_leadT.lea_nrtelefone="+$('#telCliente').val();
        else
            busca += "&tb_lea_leadT.lea_nrtelefone=0";


        if($('#codFuncionarioLogadoLead').text() != "")
            busca += "&tb_lea_leadT.pes_cdpessoafuncionario="+$('#codFuncionarioLogadoLead').text();

        busca += "&cdDepartamento=0";
        busca += "&tb_lea_leadT.loj_cdloja=0";
        busca += "&tb_lea_leadT.acc_cdacaocampanha=0";
        //busca += "&tb_lea_leadT.moe_cdmotivoencerramento=0";
        //busca += "&status=A";

        var dtInicio = $('#dtInicio').val();
        var dtFim  =  $('#dtFim').val();

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

        if(dtInicio != "")
            busca += "&dtInicio="+dtInicio;
        if(dtFim != "")
            busca += "&dtFinal="+dtFim;


        if($('#slcSituacaoLead').val() != "" && $('#slcSituacaoLead').val() != "titulo") {
            busca += "&status=" + $('#slcSituacaoLead').val();
            if($('#slcMotivoEncerramentoLead').val() != "" && $('#slcMotivoEncerramentoLead').val() != "titulo")
                busca += "&tb_lea_leadT.moe_cdmotivoencerramento=" + $('#slcMotivoEncerramentoLead').val();
        }else{
            busca += "&status=A";
        }


        $.getJSON(servidor + '/sdp/sdp/sales/tb_lea_lead/tb_lea_leadConsultGWT.jsp?op=consultByVarious'+busca, onSuccess).fail(function() {
            alert("Falha na conexão, não foi possível resgatar os leads!");
            loader(0);
        });
    } else {
        $('#leadsOff').css('display', '');
    }
}


function visualizarLead(cdLead, cdCliente, nmCliente, lea_txemail, lea_cdddd, lea_nrtelefone, dtInicio, cdFuncionario, dtQuando, cdExpectativa, observacao, ate_cdatendimento, moe_cdmotivoencerramento) {

    observacao = observacao.replace (/~/g, "'");  // desfaz replace anterior

    $.ajax({
        type: "POST",
        url: 'pages/verLead.html',
        dataType: "html",
        success: function (data) {
            $('#verLead').html(data);
            mudarPagina('#verLead');
            apagarPagina('lead');


            loader(1);
            $('#cdLead').text(cdLead);
            $('#cdAtendimento').text(ate_cdatendimento);
            $('#moe_cdmotivoencerramento').text(moe_cdmotivoencerramento);

            $('#dataInicio').text(dtInicio);
            $('#dataQuando').val(dtQuando);
            $('#txObservacao').html(observacao);
            $('#codFuncionario').text(cdFuncionario);
            //$('#txtNomeLead').val(nmCliente);

            $('#txtDDDTelefoneLead').val(lea_cdddd);
            $('#txtDDDTelefoneLead').attr("name", lea_cdddd);
            $('#txtTelefoneLead').val(lea_nrtelefone);
            $('#txtTelefoneLead').attr("name", lea_nrtelefone);

            $('#txtEmailLead').val(lea_txemail);

            if(cdCliente != null && cdCliente > 0) {
                buscarPorCdPessoaLead(cdCliente);
                $('#cdCliente').text(cdCliente);
            }else{
               $('#cdCliente').text("0");
               $('#txtNomeLead').val(nmCliente);
            }

            if(cdExpectativa != null && cdExpectativa != '0'  ) {
                $('#slcExpectativaLead').val(cdExpectativa);
                $('#slcExpectativaLead').selectmenu('refresh');
            }

            enableBtnAvancar($('#cdAtendimento').text());

            loader(0);

        }
    });

}


function buscarPorCdPessoaLead(cdPessoa) {
    loader(1);

    var onSuccess = function(result) {
        var dadosCliente = result.resultado[1];
        if (dadosCliente) {
            $('#txtNomeLead').val(dadosCliente.pes_nmpessoa);
            $('#txtEmailLead').val(dadosCliente.pes_txemail);
            $('#txtNomeLead').attr("name", dadosCliente.pes_cdpessoa);
            var onSuccess2 = function(result2) {
                dadosCliente2 = result2.resultado[1];
                if (dadosCliente2) {
                    var strTel = new String(dadosCliente2.tel_nrtelefone);
                    var telefone =  strTel.substring(0, 4) + "-" + strTel.substring(4, 8);
                    $('#txtDDDTelefoneLead').val(dadosCliente2.tel_cdddd);
                    $('#txtDDDTelefoneLead').attr("name", dadosCliente2.tel_cdddd);
                    $('#txtTelefoneLead').val(telefone);
                    $('#txtTelefoneLead').attr("name", telefone);
                } else {
                    $('#txtDDDTelefoneLead').val("");
                    $('#txtDDDTelefoneLead').attr("name", "");
                    $('#txtTelefoneLead').val("");
                    $('#txtTelefoneLead').attr("name", "");
                }
            };

            $.getJSON(servidor + '/sdp/sdp/common/tb_tel_telefone/tb_tel_telefoneConsultGWT.jsp?op=consultByCodPessoa&tb_tel_telefoneT.pes_cdpessoa=' + dadosCliente.pes_cdpessoa, onSuccess2).fail(function() {
                alert("Falha na conex�o, essa busca so poder� ser realizada online!");
                loader(0);
            });

        } else {
            $('#txtNomeLead').val("");
            $('#txtNomeLead').attr("name", "");
            $('#txtTelefoneLead').val("");
            $('#txtTelefoneLead').attr("name", "");
            var cpf = $('#txtCPFLead').val();
            if (cpf.length == 14) {

            } else {

            }
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/tb_pes_pessoa/tb_pes_pessoaConsultGWT.jsp?op=consultByCdPessoa&tb_pes_pessoaT.pes_cdpessoa=' + cdPessoa, onSuccess).fail(function() {
        alert("Falha na conex�o, essa busca so poder� ser realizada online!");
        loader(0);
    });
}


function encerrarLead(cdLead) {
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



function editarLead() {

    var cdAtendimento = $('#cdAtedimento').text();

    if(cdAtendimento != null && cdAtendimento > 0){
        alert("Lead já encerrada. Impossível avançar pra prospecção!");
    }else {

        var cdLead = $('#cdLead').text();
        var cdCliente = $('#cdCliente').text()
        var nmCliente = $('#txtNomeLead').val();
        var txEmail = $('#txtEmailLead').val();
        var txObservacao = $('#txObservacao').html();
        var cdExpectativa = $('#slcExpectativaLead').val();

        var ddd = $('#txtDDDTelefoneLead').val();
        var fone = $('#txtTelefoneLead').val();


        console.log("CODIGO parametro: " + cdCliente);
        console.log("NOME resgatado: " + nmCliente);
        console.log("EMAIL resgatado: " + txEmail);
        console.log("OBSERVAÇAO resgatada: " + txObservacao);
        console.log("Expectativa resgatada: " + cdExpectativa);
        console.log("DDD resgatada: " + ddd);
        console.log("FONE resgatada: " + fone);

        $.ajax({
            type: "POST",
            url: 'pages/novoAtendimento.html',
            dataType: "html",
            success: function (data) {
                $('#novoAtendimento').html(data);
                mudarPagina('#novoAtendimento');
                apagarPagina('verLead');

                loader(1);
                $('#cdLead').text(cdLead);
                $('#txObservacao').html(txObservacao);
                //$('#codFuncionario').text(cdFuncionario);
                //$('#txtNomeLead').val(nmCliente);

                $('#txtDDDTelefoneAtendimento').val(ddd);
                $('#txtDDDTelefoneAtendimento').attr("name", ddd);
                $('#txtTelefoneAtendimento').val(fone);
                $('#txtTelefoneAtendimento').attr("name", fone);

                $('#txtEmailAtendimento').val(txEmail);

                if (cdCliente != null && cdCliente > 0) {
                    buscarPorCdPessoa(cdCliente);
                } else {
                    $('#txtNomeAtendimento').val(nmCliente);
                    $('#txtNomeAtendimento').attr("name", "");

                    //remédio para bug de dataQuando no else

                    var dt = new Date();
                    var month = dt.getMonth()+1;
                    var day = dt.getDate();
                    var year = dt.getFullYear();
                    if(month < 10){month = "0"+month;}
                    $('#dataQuando').val(day + '/' + month + '/' + year);
                }

                if (cdExpectativa != null && cdExpectativa != '0') {
                    $('#slcExpectativaAtendimento').val(cdExpectativa);
                    $('#slcExpectativaAtendimento').selectmenu('refresh');
                }

                loader(0);

            }
        });
    }
}

function buscarCodFuncionarioLogadoLead() {
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("Você está on-line!!!");
        var cpf = $('#login').text();
        console.debug(cpf);

        var onSuccess = function(result) {
            var arrayPessoas = new Object();
            arrayPessoas = result.resultado;
            if (arrayPessoas[1]) {
                var cdPessoa = arrayPessoas[1].pes_cdpessoa;
                $('#codFuncionarioLogadoLead').text(cdPessoa);
            }
        };

        $.getJSON(servidor + '/sdp/sdp/common/vw_funcionario/vw_funcionarioConsultGWT.jsp?op=consultByCpf&vw_funcionarioT.pef_cdcpf=' + cpf, onSuccess).fail(function() {
            alert("Falha na conex�o, contate o administrador do sistema buscarCodFuncionarioLogadoLead");
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

/*
function limparPesquisar() {
    $('#txtCPFLead').val("");
    $('#txtCPFLead').removeAttr('readonly', 1);
    $('#txtTelefoneLead').val("");
    $('#txtTelefoneLead1').val("");
    $('#txtTelefoneLead2').val("");
    $('#txtTelefoneLead3').val("");
    $('#txtDDDTelefoneLead').val("");
    $('#txtDDDTelefoneLead1').val("");
    $('#txtDDDTelefoneLead2').val("");
    $('#txtDDDTelefoneLead3').val("");
    $('#txtNomeLead').val("");
    $('#txtNomeLead').removeAttr('readonly', 1);
    $('#slcTipoPessoaLead').selectmenu('enable');
    $('#slcTipoPessoaLead').val("titulo");
    $('#slcTipoPessoaLead').selectmenu('refresh');
    $('#flpSexoLead').slider('enable');
}
*/

function limparPesquisaLead() {
    $('#txtCPFLead').val("");

    var dt = new Date();
    var month = dt.getMonth()+1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    if(month < 10){month = "0"+month;}
    $('#dtInicio').val(day + '/' + month + '/' + year);
    $('#dtFim').val(day + '/' + month + '/' + year);
    $('#cdLead').val("");
    $('#nmCliente').val("");
    $('#cpfCnpjCliente').val("");
    $('#telCliente').val("");

    $('#slcSituacaoLead').val("titulo");
    $('#slcSituacaoLead').selectmenu('refresh');

    $('#slcMotivoEncerramentoLead').val("titulo");
    $('#slcMotivoEncerramentoLead').selectmenu('refresh');

    $('.MotivoEncerramentoLead').hide();
}

function validarCpfCnpj() {
    var cpfPessoaCliente = $('#txtCPFLead').val();
    if (isCpfCnpj("" + cpfPessoaCliente) == false) {
        return false;
    } else {
        return true;
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

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}


function carregarMotivoEncerramentoLead(id, callback) {
    loader(1);

    banco.transaction(function(tx) {
        tx.executeSql('SELECT * FROM motivoEncerramentoLead', [], function(tx, results) {
            var quant = results.rows.length;
            for (var i = 0; i < quant; i++) {
                var row = results.rows.item(i);
                $(id).last().append("<option value=" + row.moe_cdmotivoencerramento + ">" + row.moe_nmmotivoencerramento + "</option>");
            }

            if ( typeof callback == "function") {
                callback();
            }
            loader(0);
        }, function(tx, error) {
            alert('Error ao carregar' + error.message);
            loader(0);
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


function comentariosLead(cdLead) {
    loader(1);
    var onSuccess = function (result) {
        loader(0);
        var arrayComentarios = result.resultado;
        var lista = "";
        if (arrayComentarios[1]) {
            for (var i in arrayComentarios) {
                if (i > 0) {
                    var col_cdcomentario = arrayComentarios[i].col_cdcomentario;
                    var lea_cdlead = arrayComentarios[i].lea_cdlead;
                    var col_cdcomentariopai = arrayComentarios[i].col_cdcomentariopai;
                    var col_dtcadastro = arrayComentarios[i].col_dtcadastro;
                    var col_dscomentario = arrayComentarios[i].col_dscomentario;
                    var pes_cdpessoacriador = arrayComentarios[i].pes_cdpessoacriador;
                    var col_flleitura = arrayComentarios[i].col_flleitura;

                    if(pes_cdpessoacriador != 0) {
                        buscarNomeFuncionario(pes_cdpessoacriador, col_cdcomentario);
                        lista += "<li>" +
                        "<p><strong>Comentario:</strong> " + col_dscomentario + "</p>" +
                        "<p><strong>De:</strong> <span id='valorNomeFuncionario"+col_cdcomentario+"'</p>" +
                        "<p><strong>Em:</strong> " + col_dtcadastro + "</p>" +
                        "</li>";
                    }else{
                        lista += "<li>" +
                        "<p><strong>Comentario:</strong> " + col_dscomentario + "</p>" +
                        "<p><strong>De:</strong>  Desconhecido</p>" +
                        "<p><strong>Em:</strong> " + col_dtcadastro + "</p>" +
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
    $.getJSON(servidor + '/sdp/sdp/sales/tb_col_comentario_lead/tb_col_comentario_leadConsultGWT.jsp?op=consultByLea_cdlead&tb_col_comentario_leadT.lea_cdlead=' + cdLead, onSuccess).fail(function () {
        alert("Falha na conexão, contate o administrador do sistema Comentarios Leads");
        loader(0);
    });
}


function buscarNomeFuncionario(cdFun, col_cdcomentario) {
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("Você está on-line!!!");
        var cpf = $('#login').text();
        console.debug(cpf);

        var onSuccess = function(result) {
            var arrayPessoas = new Object();
            arrayPessoas = result.resultado;
            if (arrayPessoas[1]) {
                var nmPessoa = arrayPessoas[1].pes_nmpessoa;
                $("#valorNomeFuncionario"+col_cdcomentario).text(nmPessoa);
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

function enviarComentarioLead(cdFuncionarioLogadoLead, cdLead, cdFuncionarioCriador, txComentario){
    loader(1);
    if (localStorage.getItem('loginOff') == 'false') {
        var d = new Date();
        dformat = [  d.getDate().padLeft(),
            (d.getMonth()+1).padLeft(),
            d.getFullYear()].join('/') +' ' +
        [d.getHours().padLeft(),
            d.getMinutes().padLeft()].join(':');
        var col_flleitura;
        if(cdFuncionarioCriador == cdFuncionarioLogadoLead){
            col_flleitura = 1;
        }else{
            col_flleitura = 0;
        }

        var onSuccess = function(result) {
            if (result.resultado == "Cadastro efetuado com sucesso!") {
                loader(0);
                $('#popSucessoEnviarComentario').popup("open");
                limparComentarioLead();
            } else {
                loader(0);
                $('#popFalhaEnviarComentario').popup("open");
            }
        };


        var json = servidor + '/sdp/sdp/sales/tb_col_comentario_lead/tb_col_comentario_leadInsertGWT.jsp';
        json +='?op=insert';
        json +='&tb_col_comentario_leadT.lea_cdlead=' + cdLead;
        json +='&tb_col_comentario_leadT.col_dtcadastro=' + dformat ;
        json +='&tb_col_comentario_leadT.col_dscomentario=' + txComentario;
        json +='&tb_col_comentario_leadT.pes_cdpessoacriador=' + cdFuncionarioLogadoLead;
        json +='&tb_col_comentario_leadT.col_flleitura=' + col_flleitura;

       $.getJSON(json, onSuccess).fail(function() {
            alert("Falha na conexão, contate o administrador do sistema enviarComentario");
            loader(0);
        });

    } else {
        loader(0);
        console.debug("Você não está on-line!!!")
    }
}


function limparComentarioLead() {
    $('#txComentario').val("");
}

function enableBtnAvancar(cdAtendimento) {
    console.log("cdatendimento: " + cdAtendimento);
    console.log("id: " + id);
    console.log("ENTROU NO ENABLE_BTN")
    if (cdAtendimento != null && cdAtendimento > 0) {
        console.log("NO IF")
        $('#situacaoAberto').hide();
        $('#situacaoEncerrado').show();
        $('#btnEditarLead').hide();
    } else {
        console.log("NO ELSE");
        $('#situacaoAberto').show();
        $('#situacaoEncerrado').hide();
        $('#btnEditarLead').show();
    }
}