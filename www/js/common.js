function alterarServidor () {
    var servidor = $('#txtServidor').val();
    if(servidor){
        var empresa = servidor;
        servidor = 'http://m.' + empresa + '.salesdomain.com.br';
        localStorage.setItem('servidor', servidor);
        window.location.reload(true);
    }else{
        $('#popInvalido').popup("open");
    }
}

function validarVersao(){

    if(localStorage.getItem('servidor')){
        $("#DialogAtualizar").show();
        var onSuccess = function(result) {
            var arrayRetorno = new Object();
            arrayRetorno = result.resultado.tb_par_parametro;
            if (arrayRetorno) {
                var versao = arrayRetorno.par_vlparametro;
                if(versao != localStorage.getItem('versao_mobile')){
                    $.mobile.changePage( "#DialogAtualizar", { role: "dialog" } );
                }
            }
        };
        $.getJSON(servidor + '/sdp/sdp/common/tb_par_parametro/tb_par_parametroUpdateDeleteGWT.jsp?op=findbyNmParametro&tb_par_parametroT.par_nmparametro=VERSAO_MOBILE', onSuccess).fail(
            function() {
                alert("Falha na conexão, contate o administrador do sistema");
                loader(0);
            });
    }
}

function direcionaGooglePlay(){
    //clos app e direcionar para loja
    window.location.assign("https://play.google.com/store/apps/details?id=br.com.salesdomain.mobile");
    //location.href="https://play.google.com/store/apps/details?id=br.com.salesdomain.mobile";
    //alert('teste');
    //window.open('market://play.google.com/store/apps/details?id=br.com.salesdomain.mobile','_system');
    //window.location.href = "https://play.google.com/store/apps/details?id=br.com.salesdomain.mobile";

}

function getCdTipoProduto (cdProduto, callback) {
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS produtos (pro_nmproduto, tip_cdtipoproduto, pro_vlprecoatual, pro_flsituacao, pro_cdproduto, pro_dsproduto, pro_improduto, pro_lkhotsite, pro_vlprecocnh, pro_vlprecopromocao)', [],
            function () {
                tx.executeSql('SELECT * FROM produtos WHERE pro_cdproduto="' + cdProduto + '"', [],
                    function (tx, results){
                        tipoProduto = results.rows.item(0).tip_cdtipoproduto;
                        callback(tipoProduto);
                    },
                    function (tx, error){
                        alert('Error ao carregar' + error.message);
                    });
            });
    });
}

function getDepartamento (callback) {
    loader(1);
    var departamento;
    var onSuccess = function(result) {
        var arrayRetorno = new Object();
        arrayRetorno = result.resultado;
        ////console.log(arrayRetorno);
        if (arrayRetorno[1]) {
            departamento = arrayRetorno[1].dep_cddepartamento;
        }

        if(callback){
            callback(departamento);
        }
    };

    $.getJSON(servidor + '/sdp/sdp/common/vw_funcionario/vw_funcionarioConsultGWT.jsp?op=consultByCpf&vw_funcionarioT.pef_cdcpf=' + $('#login').text(), onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema getDepartamento");
            loader(0);
        });
}

function atualizarIndiceSync(){
    banco.transaction(function (tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS atendimentosAEnviar (json)', [],
            function () {
                tx.executeSql('SELECT * FROM atendimentosAEnviar', [],
                    function (tx, results){
                        var quant = results.rows.length;
                        $('#contador').text(quant);
                    },
                    function (tx, error){
                        alert('Error ao carregar' + error.message);
                    });
            });
    });
}

function carregarPagina (id, callback) {
    $.ajax({
        type: "POST",
        url: 'pages/' + id + '.html',
        dataType: "html",
        success: function(data) {
            $('#' + id).html(data);
            mudarPagina('#' + id);
            if(callback){
                apagarPagina(callback);
            }
        }
    });
}

function apagarPagina (id) {
    $('#' + id).remove();
    $('#main').append("<div id='"+ id +"'></div>");
}

//ADICIONA ZEROS(0) ATE COMPLETAR O CPF
function formataCpf(cpf) {
    while(cpf.length < 11){
        cpf = "0" + cpf;
    }
    return cpf;
}
//MOSTRAR GALERIA
function mostrarGaleria(hotsite) {
    if(hotsite != ""){
        if($('#txtPrecoAtendimento').val()){
            //console.log(hotsite);
            $('#frameGaleria').attr('src', hotsite);
            $('#galeria').attr('style', 'display:block;height:100%;');
            $('#formulario').attr('style', 'display:none');
        }else{
            $('#popFalhaDetalheProduto').popup("open");
        }
    }
}

function fecharGaleria (argument) {
    $('#frameGaleria').attr('src', "");
    $('#galeria').attr('style', 'display:none');
    $('#formulario').attr('style', 'display:block');
}

//MUDAR DE PAGINA
function mudarPagina(id) {
    $.mobile.changePage($(id));
}

// DATA ATUAL
function dataAtual(tipo) {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    var hora = data.getHours();
    var min = data.getMinutes();
    if (tipo == '1') {
        return dia + "/" + mes + "/" + ano;
    } else {
        return dia + "/" + mes + "/" + ano + " (" + hora + ":" + min + ")";
    }
}
// BARRA DE CARREGAMENTO
function loader(status) {
    if (status == 1) {
        $.mobile.loading('show');
    } else {
        $.mobile.loading('hide');
    }
}
function textLoader(texto){
    $.mobile.loading( 'show', {	text: texto, textVisible: true,	theme: 'a'});
}

// LIMPA OPTIONS DE SELECT
function limparSelect(id, titulo) {
    $(id).find('option').remove().end().append(
        '<option value="titulo" selected="selected">' + titulo
        + '</option>').val('titulo');
}

//CARREGA SELECT COM VENDEDORES
function carregarVendedores(id, callback) {
    loader(1);
    var onSuccess = function(result) {
        var arrayTipos = new Object();
        arrayTipos = result.resultado;
        //console.log(arrayTipos);
        for ( var i in arrayTipos) {
            if (i > 0) {
                $(id).last().append(
                    "<option value=" + formataCpf(arrayTipos[i].pef_cdcpf) + ">"
                    + arrayTipos[i].pes_nmpessoa
                    +"</option>");
            };
        };
        loader(0);
        if (typeof callback == "function") {
            callback();
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/vw_funcionario/vw_funcionarioConsultGWT.jsp?op=consultAllVendedores&vw_funcionarioT.pef_cdcpf=' + $('#login').text(), onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema carregarVendedores");
            loader(0);
        });
}

function unformatNumber(pNum)
{
    return String(pNum).replace(/\D/g, "").replace(/^0+/, "");
}

//Testa se é CPF
function isCpf(cpf) {
    var soma;
    var resto;
    var i;

    if ( (cpf.length != 11) ||
        (cpf == "00000000000") || (cpf == "11111111111") ||
        (cpf == "22222222222") || (cpf == "33333333333") ||
        (cpf == "44444444444") || (cpf == "55555555555") ||
        (cpf == "66666666666") || (cpf == "77777777777") ||
        (cpf == "88888888888") || (cpf == "99999999999") )
    {
        return false;
    }

    soma = 0;

    for (i = 1; i <= 9; i++) {
        soma += Math.floor(cpf.charAt(i-1)) * (11 - i);
    }

    resto = 11 - (soma - (Math.floor(soma / 11) * 11));

    if ( (resto == 10) || (resto == 11) ) {
        resto = 0;
    }

    if ( resto != Math.floor(cpf.charAt(9)) ) {
        return false;
    }

    soma = 0;

    for (i = 1; i<=10; i++) {
        soma += cpf.charAt(i-1) * (12 - i);
    }

    resto = 11 - (soma - (Math.floor(soma / 11) * 11));

    if ( (resto == 10) || (resto == 11) ) {
        resto = 0;
    }

    if (resto != Math.floor(cpf.charAt(10)) ) {
        return false;
    }

    return true;
}

function isCnpj(s){
    var i;
    var c = s.substr(0,12);
    var dv = s.substr(12,2);
    var d1 = 0;

    for (i = 0; i < 12; i++){
        d1 += c.charAt(11-i)*(2+(i % 8));
    }

    if (d1 == 0) return false;

    d1 = 11 - (d1 % 11);

    if (d1 > 9) d1 = 0;
    if (dv.charAt(0) != d1){
        return false;
    }

    d1 *= 2;

    for (i = 0; i < 12; i++){
        d1 += c.charAt(11-i)*(2+((i+1) % 8));
    }

    d1 = 11 - (d1 % 11);

    if (d1 > 9) d1 = 0;
    if (dv.charAt(1) != d1){
        return false;
    }

    return true;
}

function isCpfCnpj(valor) {
    var retorno = false;
    var numero  = valor;

    //numero = unformatNumber(numero);

    if (numero.length > 11){
        if (isCnpj(numero)) {
            retorno = true;
        }
    } else {
        if (isCpf(numero)) {
            retorno = true;
        }
    }

    return retorno;
}


// FORMATA NUMBER - USO: 2, (numero).formatMoney(2, '.', ',');
Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};



/*DATA*/
function mascara(o, f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}
function mdata(v){
    v=v.replace(/\D/g,"");
    v=v.replace(/(\d{2})(\d)/,"$1/$2");
    v=v.replace(/(\d{2})(\d)/,"$1/$2");
    v=v.replace(/(\d{2})(\d{2})$/,"$1$2");
    return v;
}
function id(el){
    return document.getElementById( el );
}
function next(el, next) {
    if( el.value.length >= el.maxLength )
        id( next ).focus();
}
function backspace(o, e) {
    unicode=e.keyCode? e.keyCode : e.charCode
    if(unicode == 8) {
        o.value = "";
    }
}
/*DATA*/