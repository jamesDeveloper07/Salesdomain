//CREATE DB
var banco = openDatabase(
    'bancoDados',
    '1.0',
    'Banco de dados referente ao armazenamento mobile',
    2 * 1024 * 1024
);

//INIT SYNC
function syncronizarBanco(callback){
    syncTipoProduto();

    if (typeof callback == "function") {

        callback();
    }
}

//SYNCRONIZAR TIPO PRODUTO
function syncTipoProduto(){
    if(localStorage.getItem('loginOff') == 'false'){

        textLoader("Atualizando a tabela de TipoProdutos...");
        var onSuccess = function(result) {
            var arrayTipoProdutos = new Object();
            arrayTipoProdutos = result.resultado;
            ////console.log(arrayTipoProdutos);
            downloadTipoProdutos(arrayTipoProdutos);
        };
        $.getJSON(servidor + '/sdp/sdp/sales/tb_tip_tipo_produto/tb_tip_tipo_produtoConsultGWT.jsp', onSuccess).fail(

            function() {
                alert("Falha na conexão, não foi possível atualizar a tabela de produtos!");
                loader(0);
            });
    }
}
function downloadTipoProdutos(arrayTipoProdutos){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS tipoProduto (tip_nmtipoproduto, tip_flsituacao, tip_cdtipoproduto)', [],
            function () {
                tx.executeSql("DELETE FROM tipoProduto");
                for ( var i in arrayTipoProdutos) {
                    if (i > 0) {
                        var tip_nmtipoproduto = arrayTipoProdutos[i].tip_nmtipoproduto;
                        var tip_flsituacao = arrayTipoProdutos[i].tip_flsituacao;
                        var tip_cdtipoproduto = arrayTipoProdutos[i].tip_cdtipoproduto;

                        tx.executeSql("INSERT INTO tipoProduto (tip_nmtipoproduto, tip_flsituacao, tip_cdtipoproduto) VALUES (?, ?, ?)", [tip_nmtipoproduto, tip_flsituacao, tip_cdtipoproduto]);
                    };
                };
            });
    });
    syncProdutos();
}

//SYNCRONIZAR PRODUTOS
function syncProdutos(){
    textLoader("Atualizando a tabela de Produtos...");
    var onSuccess = function(result) {
        var arrayProdutos = new Object();
        arrayProdutos = result.resultado;
        //console.log(arrayProdutos);
        downloadProdutos(arrayProdutos);
    };
    $.getJSON(servidor + '/sdp/sdp/sales/tb_pro_produto/tb_pro_produtoConsultGWT.jsp?op=consult&grl_cdgrupoloja=' + localStorage.getItem('cdGrupoLoja'), onSuccess).fail(
        function() {
            alert("Falha na conexão, você precisa estar online!");
            loader(0);
        });;
}

function downloadProdutos(arrayProdutos){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS produtos (pro_nmproduto, tip_cdtipoproduto, pro_vlprecoatual, pro_flsituacao, pro_cdproduto, pro_dsproduto, pro_improduto, pro_lkhotsite, pro_vlprecocnh, pro_vlprecopromocao)', [],
            function () {
                tx.executeSql("DELETE FROM produtos");
                for ( var i in arrayProdutos) {
                    if (i > 0) {
                        var pro_nmproduto = arrayProdutos[i].pro_nmproduto;
                        var tip_cdtipoproduto = arrayProdutos[i].tip_cdtipoproduto;
                        var pro_vlprecoatual = arrayProdutos[i].pro_vlprecoatual;
                        var pro_flsituacao = arrayProdutos[i].pro_flsituacao;
                        var pro_cdproduto = arrayProdutos[i].pro_cdproduto;
                        var pro_dsproduto = arrayProdutos[i].pro_dsproduto;
                        var pro_improduto = arrayProdutos[i].pro_improduto;
                        var pro_lkhotsite = arrayProdutos[i].pro_lkhotsite;
                        var pro_vlprecocnh = arrayProdutos[i].pro_vlprecocnh;
                        var pro_vlprecopromocao = arrayProdutos[i].pro_vlprecopromocao;

                        tx.executeSql("INSERT INTO produtos (pro_nmproduto, tip_cdtipoproduto, pro_vlprecoatual, pro_flsituacao, pro_cdproduto, pro_dsproduto, pro_improduto, pro_lkhotsite, pro_vlprecocnh, pro_vlprecopromocao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [pro_nmproduto, tip_cdtipoproduto, pro_vlprecoatual, pro_flsituacao, pro_cdproduto, pro_dsproduto, pro_improduto, pro_lkhotsite, pro_vlprecocnh, pro_vlprecopromocao]);
                    };
                };
            });
    });
    //loader(0);
    syncCanalProspeccao();
}


//SYNCRONIZAR Canal de prospeccao
function syncCanalProspeccao(){
    if(localStorage.getItem('loginOff') == 'false'){

        textLoader("Atualizando a tabela de Canal de Prospecção...");
        var onSuccess = function(result) {
            var arrayCanalProspeccao = new Object();
            arrayCanalProspeccao = result.resultado;
            ////console.log(arrayTipoProdutos);
            downloadCanalProspeccao(arrayCanalProspeccao);
        };
        $.getJSON(servidor + '/sdp/sdp/common/tb_tpc_tipo_contato/tb_tpc_tipo_contatoConsultGWT.jsp', onSuccess).fail(

            function() {
                alert("Falha na conexão, não foi possível atualizar a tabela de canal de prospecção!");
                loader(0);
            });
    }
}

function downloadCanalProspeccao(arrayCanalProspeccao){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS canalProspecacao (tpc_cd_tipo_contato, tpc_tx_descricao, tpc_tx_status)', [],
            function () {
                tx.executeSql("DELETE FROM canalProspecacao");
                for ( var i in arrayCanalProspeccao) {
                    if (i > 0) {
                        var tpc_cd_tipo_contato = arrayCanalProspeccao[i].tpc_cd_tipo_contato;
                        var tpc_tx_descricao = arrayCanalProspeccao[i].tpc_tx_descricao;
                        var tpc_tx_status = arrayCanalProspeccao[i].tpc_tx_status;

                        tx.executeSql("INSERT INTO canalProspecacao (tpc_cd_tipo_contato, tpc_tx_descricao, tpc_tx_status) VALUES (?, ?, ?)", [tpc_cd_tipo_contato, tpc_tx_descricao, tpc_tx_status]);
                    };
                };
            });
    });
    syncAcaoMarketing()
}


//SYNCRONIZAR Acao de Marketing
function syncAcaoMarketing(){
    if(localStorage.getItem('loginOff') == 'false'){

        textLoader("Atualizando a tabela de Ação de Marketing...");
        var onSuccess = function(result) {
            var arrayAcaoMarketing = new Object();
            arrayAcaoMarketing = result.resultado;
            ////console.log(arrayTipoProdutos);
            downloadAcaoMarketing(arrayAcaoMarketing);
        };
        $.getJSON(servidor + '/sdp/sdp/marketing/tb_acm_acao_marketing/tb_acm_acao_marketingConsultGWT.jsp?op=consult', onSuccess).fail(

            function() {
                alert("Falha na conexão, não foi possível atualizar a tabela de ação de marketing!");
                loader(0);
            });
    }
}

function downloadAcaoMarketing(arrayAcaoMarketing){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS acaoMarketing (acm_cdacaomarketing, acm_nmacaomarketing, acm_dsacaomarketing,acm_flsituacao)', [],
            function () {
                tx.executeSql("DELETE FROM acaoMarketing");
                for ( var i in arrayAcaoMarketing) {
                    if (i > 0) {
                        var acm_cdacaomarketing = arrayAcaoMarketing[i].acm_cdacaomarketing;
                        var acm_nmacaomarketing = arrayAcaoMarketing[i].acm_nmacaomarketing;
                        var acm_dsacaomarketing = arrayAcaoMarketing[i].acm_dsacaomarketing;
                        var acm_flsituacao      = arrayAcaoMarketing[i].acm_flsituacao;

                        tx.executeSql("INSERT INTO acaoMarketing (acm_cdacaomarketing, acm_nmacaomarketing, acm_dsacaomarketing,acm_flsituacao) VALUES (?, ?, ?,?)", [acm_cdacaomarketing, acm_nmacaomarketing, acm_dsacaomarketing,acm_flsituacao]);
                    };
                };
            });
    });
    syncFormaPagamento();
}


//SYNCRONIZAR FormaPagamento
function syncFormaPagamento(){
    if(localStorage.getItem('loginOff') == 'false'){

        textLoader("Atualizando a tabela de Formas de pagamento...");
        var onSuccess = function(result) {
            var arrayFormaPagamento = new Object();
            arrayFormaPagamento = result.resultado;
            ////console.log(arrayTipoProdutos);
            downloadFormaPagamento(arrayFormaPagamento);
        };
        $.getJSON(servidor + '/sdp/sdp/common/tb_fop_forma_pagamento/tb_fop_forma_pagamentoConsultGWT.jsp?op=consult', onSuccess).fail(

            function() {
                alert("Falha na conexão, não foi possível atualizar a tabela de formas de pagamento!");
                loader(0);
            });
    }
}

function downloadFormaPagamento(arrayFormaPagamento){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS formaPagamento (fop_cdformapagamento, fop_nmformapagamento, fop_flativo)', [],
            function () {
                tx.executeSql("DELETE FROM formaPagamento");
                for ( var i in arrayFormaPagamento) {
                    if (i > 0) {
                        var fop_cdformapagamento = arrayFormaPagamento[i].fop_cdformapagamento;
                        var fop_nmformapagamento = arrayFormaPagamento[i].fop_nmformapagamento;
                        var fop_flativo         = arrayFormaPagamento[i].fop_flativo;

                        tx.executeSql("INSERT INTO formaPagamento (fop_cdformapagamento, fop_nmformapagamento, fop_flativo) VALUES (?, ?, ?)", [fop_cdformapagamento, fop_nmformapagamento, fop_flativo]);
                    };
                };
            });
    });
    syncMotivoEncerramentoProspeccao();
}



//SYNCRONIZAR motivoEncerramentoProspeccao
function syncMotivoEncerramentoProspeccao(){
    if(localStorage.getItem('loginOff') == 'false'){

        textLoader("Atualizando a tabela de Motivo Encerramento (Prospecção)...");
        var onSuccess = function(result) {
            var arrayMotivoEncerramento = new Object();
            arrayMotivoEncerramento = result.resultado;
            downloadMotivoEncerramentoProspeccao(arrayMotivoEncerramento);
        };
        $.getJSON(servidor + '/sdp/sdp/common/tb_moe_motivo_encerramento/tb_moe_motivo_encerramentoConsultGWT.jsp?op=consultProspects', onSuccess).fail(

            function() {
                alert("Falha na conexão, não foi possível atualizar a tabela de motivo encerramento prospecção!");
                loader(0);
            });
    }
}

function downloadMotivoEncerramentoProspeccao(arrayMotivoEncerramento) {
    banco.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS motivoEncerramentoProspeccao (moe_cdmotivoencerramento, moe_nmmotivoencerramento, moe_flsituacao)', [],
            function () {
                tx.executeSql("DELETE FROM motivoEncerramentoProspeccao");
                for (var i in arrayMotivoEncerramento) {
                    if (i > 0) {
                        var moe_cdmotivoencerramento = arrayMotivoEncerramento[i].moe_cdmotivoencerramento;
                        var moe_nmmotivoencerramento = arrayMotivoEncerramento[i].moe_nmmotivoencerramento;
                        var moe_flsituacao = arrayMotivoEncerramento[i].moe_flsituacao;

                        tx.executeSql("INSERT INTO motivoEncerramentoProspeccao (moe_cdmotivoencerramento, moe_nmmotivoencerramento, moe_flsituacao) VALUES (?, ?, ?)", [moe_cdmotivoencerramento, moe_nmmotivoencerramento, moe_flsituacao]);
                    }
                    ;
                }
                ;
            });
    });
    syncMotivoEncerramentoLead();
}



//SYNCRONIZAR motivoEncerramentoLead
function syncMotivoEncerramentoLead(){
    if(localStorage.getItem('loginOff') == 'false'){

        textLoader("Atualizando a tabela de Motivo Encerramento (Lead)...");
        var onSuccess = function(result) {
            var arrayMotivoEncerramento = new Object();
            arrayMotivoEncerramento = result.resultado;
            downloadMotivoEncerramentoLead(arrayMotivoEncerramento);
        };
        $.getJSON(servidor + '/sdp/sdp/common/tb_moe_motivo_encerramento/tb_moe_motivo_encerramentoConsultGWT.jsp?op=consultLeads', onSuccess).fail(

            function() {
                alert("Falha na conexão, não foi possível atualizar a tabela de motivo encerramento lead!");
                loader(0);
            });
    }
}

function downloadMotivoEncerramentoLead(arrayMotivoEncerramento){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS motivoEncerramentoLead (moe_cdmotivoencerramento, moe_nmmotivoencerramento, moe_flsituacao)', [],
            function () {
                tx.executeSql("DELETE FROM motivoEncerramentoLead");
                for ( var i in arrayMotivoEncerramento) {
                    if (i > 0) {
                        var moe_cdmotivoencerramento = arrayMotivoEncerramento[i].moe_cdmotivoencerramento;
                        var moe_nmmotivoencerramento = arrayMotivoEncerramento[i].moe_nmmotivoencerramento;
                        var moe_flsituacao = arrayMotivoEncerramento[i].moe_flsituacao;

                        tx.executeSql("INSERT INTO motivoEncerramentoLead (moe_cdmotivoencerramento, moe_nmmotivoencerramento, moe_flsituacao) VALUES (?, ?, ?)", [moe_cdmotivoencerramento, moe_nmmotivoencerramento, moe_flsituacao]);
                    };
                };
            });
    });
    loader(0);
}



//SALVA JSON PARA ENVIO POSTERIOR
function salvarJSON(json){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS atendimentosAEnviar (json)', [],
            function () {
                tx.executeSql("INSERT INTO atendimentosAEnviar (json) VALUES (?)", [json]);
                $('#contador').text(parseInt($('#contador').text()) + 1);
            });
    });
}

function upJSON (arrayAEnviar, cont) {
    if(arrayAEnviar[cont]){
        var onSuccess = function(result) {
            //console.log(result.resultado);
            if(result.resultado == "Cadastro efetuado com sucesso!"){
                localStorage.setItem('sucessos', parseInt(localStorage.getItem('sucessos')) + 1);
                banco.transaction(function (tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS atendimentosAEnviar (json)', [],
                        function () {
                            tx.executeSql('DELETE FROM atendimentosAEnviar WHERE json ="' + arrayAEnviar[cont] + '"');
                            $('#contador').text(parseInt($('#contador').text()) - 1);
                        });
                    //$('#popSucessoCadastro').popup("open");
                    //carregarAtendimentos();
                });
            }else{
                localStorage.setItem('falhas', parseInt(localStorage.getItem('falhas')) + 1);
                salvarLog(arrayAEnviar[cont], 9);
                //$('#popFalhaCadastro').popup("open");
            }
            upJSON(arrayAEnviar, cont + 1);
        };
        $.getJSON(arrayAEnviar[cont], onSuccess).fail(
            function() {
                localStorage.setItem('falhas', parseInt(localStorage.getItem('falhas')) + 1);
                salvarLog(arrayAEnviar[cont], 9);
                upJSON(arrayAEnviar, cont + 1);
                //alert("Falha na conexão, contate o administrador do sistema");
                //loader(0);
            });

    }else{
        loader(0);
        $('#popSyncConcluido').html("Processo de Sincronização concluido: <br />Sucessos: " + localStorage.getItem('sucessos') + "<br />Falhas: " + localStorage.getItem('falhas'));
        $('#popSyncConcluido').popup("open");
    }

}

function uparAtendimentos(contador){
    localStorage.setItem('sucessos', 0);
    localStorage.setItem('falhas', 0);
    var atendPendentes = $('#contador').text();
    var arrayAEnviar = [];
    limparLog();
    if(atendPendentes > 0){
        textLoader("Enviando Atendimentos...");
        banco.transaction(function (tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS atendimentosAEnviar (json)', [],
                function () {
                    tx.executeSql('SELECT * FROM atendimentosAEnviar', [],
                        function (tx, results){
                            var quant = results.rows.length;
                            for (var i = 0; i < quant; i++)
                            {
                                var row = results.rows.item(i);
                                var json = row.json;
                                arrayAEnviar.push(json);
                            }
                            upJSON(arrayAEnviar, 0);

                        },
                        function (tx, error)
                        {
                            alert('Error ao carregar' + error.message);
                        });
                });
        });
    }else{
        $('#popSemAtendimentos').popup("open");
    }
}

//SALVA LOG PARA ENVIO POSTERIOR
function salvarLog(descricao, tipo){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS log (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, descricao, tipo)', [],
            function () {
                tx.executeSql("INSERT INTO log (descricao, tipo) VALUES (?, ?)", [descricao, tipo]);
            });
    });
}

//LIMPA LOG PARA ENVIO POSTERIOR
function limparLog(){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS log (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, descricao, tipo)', [],
            function () {
                tx.executeSql("DELETE FROM log");
                tx.executeSql("DELETE FROM sqlite_sequence");
            });
    });
}



