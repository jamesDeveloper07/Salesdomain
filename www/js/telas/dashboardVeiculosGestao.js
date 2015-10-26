google.load("visualization", "1", {packages:["corechart"]});

function carregarDash (tipo) {
    sessionStorage.setItem("tipo", tipo);
    carregarPagina('veiculosGestao', 'dashboard');
}

function attVmMonetario () {
    loader(1);
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    var onSuccess = function(result) {
        var retorno = result.resultado.vw_vendas_sobre_metas_sumarioT;

        //VM PROSPECCAO
        var porcProspeccaoMon = new Number(retorno.percentualatendimentos);
        var qtProspeccaoMon = new Number(retorno.realizacaoatendimentos);
        if(retorno.fl_atingiu_meta_atendimentos == 'true'){
            $('#imgProspeccaoMon').attr('src', 'images/setaUp.png');
            $('#porcProspeccaoMon').attr('style', 'color:green');
            $('#porcProspeccaoMon').text(porcProspeccaoMon.toFixed(2) + "%");
        }else{
            $('#imgProspeccaoMon').attr('src', 'images/setaDown.png');
            $('#porcProspeccaoMon').attr('style', 'color:red');
            $('#porcProspeccaoMon').text(porcProspeccaoMon.toFixed(2) + "%");
        }
        $('#qtProspeccaoMon').text("R$ " + (qtProspeccaoMon).formatMoney(2, ',', '.'));

        /*
        //VM PROPOSTAS
        var porcPropostasMon =  new Number(retorno.percentualpropostas);
        var qtPropostasMon = new Number(retorno.realizacaopropostas);
        if(retorno.fl_atingiu_meta_propostas == 'true'){
            $('#imgPropostasMon').attr('src', 'images/setaUp.png');
            $('#porcPropostasMon').attr('style', 'color:green');
            $('#porcPropostasMon').text(porcPropostasMon.toFixed(2) + "%");
        }else{
            $('#imgPropostasMon').attr('src', 'images/setaDown.png');
            $('#porcPropostasMon').attr('style', 'color:red');
            $('#porcPropostasMon').text(porcPropostasMon.toFixed(2) + "%");
        }
        $('#qtPropostasMon').text("R$ " + (qtPropostasMon).formatMoney(2, ',', '.'));
        */

        //VM VENDAS
        var porcVendasMon =  new Number(retorno.percentualvendas);
        var qtVendasMon = new Number(retorno.realizacaovendas);
        if(retorno.fl_atingiu_meta_vendas == 'true'){
            $('#imgVendasMon').attr('src', 'images/setaUp.png');
            $('#porcVendasMon').attr('style', 'color:green');
            $('#porcVendasMon').text(porcVendasMon.toFixed(2) + "%");
        }else{
            $('#imgVendasMon').attr('src', 'images/setaDown.png');
            $('#porcVendasMon').attr('style', 'color:red');
            $('#porcVendasMon').text(porcVendasMon.toFixed(2) + "%");
        }
        $('#qtVendasMon').text("R$ " + (qtVendasMon).formatMoney(2, ',', '.'));

        montarGraficoVmMonetario();
        loader(0);
    };
    $.getJSON(servidor + '/sdp/sdp/salesdomain/vw_venda_sobre_meta_funcionario/vw_venda_sobre_meta_funcionario_sumarioConsultGWT.jsp?op=getSumarioIndividual&cpfFuncionario=' + $('#login').text() + '&tpMeta=1&tpProduto=' + sessionStorage.getItem("tipo") + '&mes=' + mes +'&ano=' + ano, onSuccess).fail(
        function() {
            alert("Falha na conexão,  você precisa estar online!");
            loader(0);
        });
}

function montarGraficoVmMonetario () {

    loader(1);
    var data = new Date();
    var ano = data.getFullYear();

    var onSuccess = function(result) {
        var arrayRetorno = result.resultado;

        var metaJan, vendasJan = 0;
        var metaFev, vendasFev = 0;
        var metaMar, vendasMar = 0;
        var metaAbr, vendasAbr = 0;
        var metaMai, vendasMai = 0;
        var metaJun, vendasJun = 0;
        var metaJul, vendasJul = 0;
        var metaAgo, vendasAgo = 0;
        var metaSet, vendasSet = 0;
        var metaOut, vendasOut = 0;
        var metaNov, vendasNov = 0;
        var metaDez, vendasDez = 0;

        for ( var i in arrayRetorno) {
            if (i > 0) {
                switch(arrayRetorno[i].met_nr_mes){
                    case "1":
                        metaJan = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasJan = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "2":
                        metaFev  = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasFev = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "3":
                        metaMar = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasMar = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "4":
                        metaAbr = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasAbr = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "5":
                        metaMai = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasMai = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "6":
                        metaJun = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasJun = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "7":
                        metaJul = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasJul = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "8":
                        metaAgo = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasAgo = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "9":
                        metaSet = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasSet = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "10":
                        metaOut = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasOut = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "11":
                        metaNov = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasNov = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "12":
                        metaDez = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasDez = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                }
            }
        }

        dataTable = new google.visualization.DataTable();

        var newData = [['Ano', 'Metas', 'Vendas'],
            ['Jan',  metaJan, vendasJan],
            ['Fev',  metaFev, vendasFev],
            ['Mar',  metaMar, vendasMar],
            ['Abr',  metaAbr, vendasAbr],
            ['Mai',  metaMai, vendasMai],
            ['Jun',  metaJun, vendasJun],
            ['Jul',  metaJul, vendasJul],
            ['Ago',  metaAgo, vendasAgo],
            ['Set',  metaSet, vendasSet],
            ['Out',  metaOut, vendasOut],
            ['Nov',  metaNov, vendasNov],
            ['Dez',  metaDez, vendasDez]];

        // determine the number of rows and columns.
        var numRows = newData.length;
        var numCols = newData[0].length;

        // in this case the first column is of type 'string'.
        dataTable.addColumn('string', newData[0][0]);

        // all other columns are of type 'number'.
        for (var i = 1; i < numCols; i++)
            dataTable.addColumn('number', newData[0][i]);

        // now add the rows.
        for (var i = 1; i < numRows; i++)
            dataTable.addRow(newData[i]);

        var options = {
            colors:['#5E93D8','#B71111'],
            allowHtml: true,
            showRowNumber: true
        };

        // redraw the chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('graficoVmMonetario'));

        var formatter = new google.visualization.NumberFormat({prefix: 'R$', negativeColor: 'red', negativeParens: true});
        formatter.format(dataTable, 1);
        formatter.format(dataTable, 2);
        chart.draw(dataTable, options);
    }

    $.getJSON(servidor + '/sdp/sdp/salesdomain/vw_venda_sobre_meta_funcionario/vw_venda_sobre_meta_funcionario_anualConsultGWT.jsp?op=getMetasAnualIndividual&cpfFuncionario='+ $('#login').text() +'&tpMeta=1&tpProduto=' + sessionStorage.getItem("tipo") + '&ano=' + ano, onSuccess).fail(
        function() {
            alert("Falha na conexão, você precisa estar online!");
            loader(0);
        });
}

function montarGraficoVmQuantidade () {

    loader(1);
    var data = new Date();
    var ano = data.getFullYear();

    var onSuccess = function(result) {
        var arrayRetorno = result.resultado;

        var metaJan, vendasJan = 0;
        var metaFev, vendasFev = 0;
        var metaMar, vendasMar = 0;
        var metaAbr, vendasAbr = 0;
        var metaMai, vendasMai = 0;
        var metaJun, vendasJun = 0;
        var metaJul, vendasJul = 0;
        var metaAgo, vendasAgo = 0;
        var metaSet, vendasSet = 0;
        var metaOut, vendasOut = 0;
        var metaNov, vendasNov = 0;
        var metaDez, vendasDez = 0;
        for ( var i in arrayRetorno) {
            if (i > 0) {
                switch(arrayRetorno[i].met_nr_mes){
                    case "1":
                        metaJan = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasJan = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "2":
                        metaFev  = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasFev = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "3":
                        metaMar = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasMar = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "4":
                        metaAbr = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasAbr = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "5":
                        metaMai = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasMai = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "6":
                        metaJun = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasJun = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "7":
                        metaJul = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasJul = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "8":
                        metaAgo = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasAgo = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "9":
                        metaSet = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasSet = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "10":
                        metaOut = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasOut = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "11":
                        metaNov = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasNov = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                    case "12":
                        metaDez = parseInt(arrayRetorno[i].mep_vlmetavenda);
                        vendasDez = parseInt(arrayRetorno[i].realizacaovendas);
                        break;
                }
            }
        }


        dataTable = new google.visualization.DataTable();

        var newData = [['Ano', 'Metas', 'Vendas'],
            ['Jan',  metaJan, vendasJan],
            ['Fev',  metaFev, vendasFev],
            ['Mar',  metaMar, vendasMar],
            ['Abr',  metaAbr, vendasAbr],
            ['Mai',  metaMai, vendasMai],
            ['Jun',  metaJun, vendasJun],
            ['Jul',  metaJul, vendasJul],
            ['Ago',  metaAgo, vendasAgo],
            ['Set',  metaSet, vendasSet],
            ['Out',  metaOut, vendasOut],
            ['Nov',  metaNov, vendasNov],
            ['Dez',  metaDez, vendasDez]];

        // determine the number of rows and columns.
        var numRows = newData.length;
        var numCols = newData[0].length;

        // in this case the first column is of type 'string'.
        dataTable.addColumn('string', newData[0][0]);

        // all other columns are of type 'number'.
        for (var i = 1; i < numCols; i++)
            dataTable.addColumn('number', newData[0][i]);

        // now add the rows.
        for (var i = 1; i < numRows; i++)
            dataTable.addRow(newData[i]);

        var options = {
            colors:['#5E93D8','#B71111']
        };

        // redraw the chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('graficoVmQuantidade'));
        chart.draw(dataTable, options);
    }


    $.getJSON(servidor + '/sdp/sdp/salesdomain/vw_venda_sobre_meta_funcionario/vw_venda_sobre_meta_funcionario_anualConsultGWT.jsp?op=getMetasAnualIndividual&cpfFuncionario='+ $('#login').text() +'&tpMeta=2&tpProduto=' + sessionStorage.getItem("tipo") + '&ano=' + ano, onSuccess).fail(
        function() {
            alert("Falha na conexão,  você precisa estar online!");
            loader(0);
        });

}

function attVmQuantidade () {
    loader(1);
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    var onSuccess = function(result) {
        var retorno = result.resultado.vw_vendas_sobre_metas_sumarioT;

        //VM PROSPECCAO
        var porcProspeccaoQuant = new Number(retorno.percentualatendimentos);
        var qtProspeccaoQuant = new Number(retorno.realizacaoatendimentos);
        if(retorno.fl_atingiu_meta_atendimentos == 'true'){
            $('#imgProspeccaoQuant').attr('src', 'images/setaUp.png');
            $('#porcProspeccaoQuant').attr('style', 'color:green');
            $('#porcProspeccaoQuant').text(porcProspeccaoQuant.toFixed(2) + "%");
        }else{
            $('#imgProspeccaoQuant').attr('src', 'images/setaDown.png');
            $('#porcProspeccaoQuant').attr('style', 'color:red');
            $('#porcProspeccaoQuant').text(porcProspeccaoQuant.toFixed(2) + "%");
        }
        $('#qtProspeccaoQuant').text(qtProspeccaoQuant);

        /*
        //VM PROPOSTAS
        var porcPropostasQuant =  new Number(retorno.percentualpropostas);
        var qtPropostasQuant = new Number(retorno.realizacaopropostas);
        if(retorno.fl_atingiu_meta_propostas == 'true'){
            $('#imgPropostasQuant').attr('src', 'images/setaUp.png');
            $('#porcPropostasQuant').attr('style', 'color:green');
            $('#porcPropostasQuant').text(porcPropostasQuant.toFixed(2) + "%");
        }else{
            $('#imgPropostasQuant').attr('src', 'images/setaDown.png');
            $('#porcPropostasQuant').attr('style', 'color:red');
            $('#porcPropostasQuant').text(porcPropostasQuant.toFixed(2) + "%");
        }
        $('#qtPropostasQuant').text(qtPropostasQuant);
        */

        //VM VENDAS
        var porcVendasQuant =  new Number(retorno.percentualvendas);
        var qtVendasQuant = new Number(retorno.realizacaovendas);
        if(retorno.fl_atingiu_meta_vendas == 'true'){
            $('#imgVendasQuant').attr('src', 'images/setaUp.png');
            $('#porcVendasQuant').attr('style', 'color:green');
            $('#porcVendasQuant').text(porcVendasQuant.toFixed(2) + "%");
        }else{
            $('#imgVendasQuant').attr('src', 'images/setaDown.png');
            $('#porcVendasQuant').attr('style', 'color:red');
            $('#porcVendasQuant').text(porcVendasQuant.toFixed(2) + "%");
        }
        $('#qtVendasQuant').text(qtVendasQuant);

        montarGraficoVmQuantidade();
        loader(0);
    };

    $.getJSON(servidor + '/sdp/sdp/salesdomain/vw_venda_sobre_meta_funcionario/vw_venda_sobre_meta_funcionario_sumarioConsultGWT.jsp?op=getSumarioIndividual&cpfFuncionario=' + $('#login').text() + '&tpMeta=2&tpProduto=' + sessionStorage.getItem("tipo") + '&mes=' + mes +'&ano=' + ano, onSuccess).fail(
        function() {
            alert("Falha na conexão, você precisa estar online!");
            loader(0);
        });
}

function attMinhaCont (departamento) {
    loader(1);
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    var onSuccess = function(result) {
        var arrayRetorno = result.resultado;

        var newData = [['Nome', 'Valor']];
        if(sessionStorage.getItem("tipo") == '1'){
            for ( var i in arrayRetorno) {
                if (i > 0) {
                    newData.push([arrayRetorno[i].fun_nmapelido, parseInt(arrayRetorno[i].vendas_veiculo_novo)]);
                }
            }
        }else{
            for ( var i in arrayRetorno) {
                if (i > 0) {
                    newData.push([arrayRetorno[i].fun_nmapelido, parseInt(arrayRetorno[i].vendas_veiculo_importado)]);
                }
            }
        }
        dataTable = new google.visualization.DataTable();

        // determine the number of rows and columns.
        var numRows = newData.length;
        var numCols = newData[0].length;

        // in this case the first column is of type 'string'.
        dataTable.addColumn('string', newData[0][0]);

        // all other columns are of type 'number'.
        for (var i = 1; i < numCols; i++)
            dataTable.addColumn('number', newData[0][i]);

        // now add the rows.
        for (var i = 1; i < numRows; i++)
            dataTable.addRow(newData[i]);

        var options = {
            is3D: true
        };
        // redraw the chart.
        var chart = new google.visualization.PieChart(document.getElementById('graficoMinhaCont'));

        var formatter = new google.visualization.NumberFormat({prefix: 'R$', negativeColor: 'red', negativeParens: true});
        formatter.format(dataTable, 1);
        chart.draw(dataTable, options);
        loader(0);
    }

    $.getJSON(servidor + '/sdp/sdp/salesdomain/vw_impacto_resultado_venda/vw_impacto_resultado_vendaConsultGWT.jsp?op=consultByDepartamentoMesAnoFuncionario&vw_impacto_resultado_vendaT.pes_cdpessoa=0&vw_impacto_resultado_vendaT.mes=' + mes +'&vw_impacto_resultado_vendaT.ano=' + ano + '&vw_impacto_resultado_vendaT.dep_cddepartamento=' + departamento, onSuccess).fail(
        function() {
            alert("Falha na conexão,  você precisa estar online!");
            loader(0);
        });


}

function attDistVendas () {
    loader(1);
    var data = new Date();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    var onSuccess = function(result) {
        var arrayRetorno = new Object();
        arrayRetorno = result.resultado.distribuicao;
        // console.log(arrayRetorno);
        var newData = [];
        var nome = [''];
        var quantidade = [''];
        for ( var i in arrayRetorno) {
            if (i > 0) {
                nome.push(arrayRetorno[i].pro_nmproduto);
                quantidade.push(parseInt(arrayRetorno[i].quantidade));
            }
        }
        newData.push(nome);
        newData.push(quantidade);
        // console.log(newData);
        dataTable = new google.visualization.DataTable();

        // determine the number of rows and columns.
        var numRows = newData.length;
        var numCols = newData[0].length;

        // in this case the first column is of type 'string'.
        dataTable.addColumn('string', newData[0][0]);

        // all other columns are of type 'number'.
        for (var i = 1; i < numCols; i++)
            dataTable.addColumn('number', newData[0][i]);

        // now add the rows.
        for (var i = 1; i < numRows; i++)
            dataTable.addRow(newData[i]);

        var options = {
        };

        // redraw the chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('graficoDistVenda'));

        chart.draw(dataTable, options);
        loader(0);

    };

    $.getJSON(servidor + '/sdp/sdp/sales/tb_ven_venda/tb_ven_vendaConsultByDashBoardGWT.jsp?op=getDistribuicaoVendasByFuncionarioAnoMesTpProduto&cpfFuncionario=' + $('#login').text() + '&mes=' + mes + '&ano=' + ano + '&tpProduto=' + sessionStorage.getItem("tipo"), onSuccess).fail(
        function() {
            alert("Falha na conexão,  você precisa estar online!");
            loader(0);
        });

}


function abrirVmMonetario () {
    $('#abaVmMonetario').show();
    $('#abaVmQuantidade').hide();
    $('#abaMinhaCont').hide();
    $('#abaDistVenda').hide();
    attVmMonetario();
}

function abrirVmQuantidade () {
    $('#abaVmMonetario').hide();
    $('#abaVmQuantidade').show();
    $('#abaMinhaCont').hide();
    $('#abaDistVenda').hide();
    attVmQuantidade();
}

function abrirMinhaCont () {
    $('#abaVmMonetario').hide();
    $('#abaVmQuantidade').hide();
    $('#abaMinhaCont').show();
    $('#abaDistVenda').hide();
    getDepartamento(attMinhaCont);
}

function abrirDistVenda () {
    $('#abaVmMonetario').hide();
    $('#abaVmQuantidade').hide();
    $('#abaMinhaCont').hide();
    $('#abaDistVenda').show();
    attDistVendas();
}