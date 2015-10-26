function autenticar() {
    loader(1);
    var txtUsuario = $('#txtUsuario').val();
    var txtSenha = $('#txtSenha').val();
    var lembrar = $("#lembrar").val();

    if( $("input:checked").length == 1 ) {
        localStorage.setItem('txtUsuario',txtUsuario);
        localStorage.setItem('txtSenha',txtSenha);
        localStorage.setItem('lembrar',lembrar);
    }else{
        localStorage.setItem('txtUsuario',"");
        localStorage.setItem('txtSenha',"");
        localStorage.setItem('lembrar',"");
    }

    var onSuccess = function(result) {

        var autenticou = result.resultado.autenticacao;
        if (autenticou == 'true') {
            // Joga usuario para a "sessao"
            usuarioLogado = result.resultado;
            $('#usuario').text(usuarioLogado.usuario);
            $('#codigo').text(usuarioLogado.codigo);
            $('#login').text(usuarioLogado.login);
            $('#status').text(usuarioLogado.status);
            $('#email').text(usuarioLogado.email);

            //joga o usuario para acesso off
            localStorage.setItem('usuario',usuarioLogado.usuario);
            localStorage.setItem('codigo',usuarioLogado.codigo);
            localStorage.setItem('login',usuarioLogado.login);
            localStorage.setItem('status',usuarioLogado.status);
            localStorage.setItem('email',usuarioLogado.email);
            localStorage.setItem('loginOff',false);

            buscarCdGrupoLojaByFuncionarioLogado();
            buscarParametroFluxoEncerramento();


            var dt = new Date();
            var month = dt.getMonth()+1;
            var day = dt.getDate();
            var year = dt.getFullYear();
            localStorage.setItem('data_login', day + '/' + month + '/' + year);

            $.post('pages/main.html', function(data) {
                $('#main').html(data);
                $.post('pages/home.html', function(data) {
                    $('#home').html(data);
                    mudarPagina('#home');
                    atualizarIndiceSync();
                    syncronizarBanco();
                });
            });

        } else {
            // CASO FALHE AUTENTICACAO, ABRE POPUP
            loader(0);
            $('#popFalhaAutenticacao').popup("open");
        }
    };




    $.getJSON(servidor + '/sdp/portalgwt/authentication.jsp?op=autenticar&usu_usuarioT.usu_tx_login=' + txtUsuario + '&usu_usuarioT.usu_tx_senha=' + txtSenha,	onSuccess).fail(
        function() {
            //tentar login offline
            var dt = new Date();
            var month = dt.getMonth()+1;
            var day = dt.getDate();
            var year = dt.getFullYear();
            var data_login   = localStorage.getItem("data_login").split("/");
            var iniPastedDate =  new Date().toLocaleString().split(" ")[0];
            var a = new Date(year, month, day);
            var b = new Date(data_login[2], data_login[1], data_login[0]);
            var dias = (a - b) / (60 * 60 * 24 * 1000);
            var dias_acesso_off = localStorage.getItem('dias_acesso_off');
            if(dias <= dias_acesso_off){

                // Joga usuario para a "sessao"
                $('#usuario').text(localStorage.getItem('usuario'));
                $('#codigo').text(localStorage.getItem('codigo'));
                $('#login').text(localStorage.getItem('login'));
                $('#status').text(localStorage.getItem('status'));
                $('#email').text(localStorage.getItem('email'));
                localStorage.setItem('loginOff',true);

                $.post('pages/main.html', function(data) {
                    $('#main').html(data);
                    $.post('pages/home.html', function(data) {
                        $('#home').html(data);
                        mudarPagina('#home');
                        atualizarIndiceSync();
                        // syncronizarBanco();
                    });
                });

            }else{
                alert("Realize login online!");
                loader(0);
            }
            loader(0);
        });
}

function getDiasAcessoOff(){
    localStorage.setItem('dias_acesso_off',1);

    var onSuccess = function(result) {
        var arrayRetorno = new Object();
        arrayRetorno = result.resultado.tb_par_parametro;
        if (arrayRetorno) {
            localStorage.setItem('dias_acesso_off',arrayRetorno.par_vlparametro);
        }
    };
    $.getJSON(servidor + '/sdp/sdp/common/tb_par_parametro/tb_par_parametroUpdateDeleteGWT.jsp?op=findbyNmParametro&tb_par_parametroT.par_nmparametro=DIAS_ACESSO_OFF_MOBILE', onSuccess).fail(
        function() {
            alert("Falha na conexão, contate o administrador do sistema");
        });
}

function buscarCdGrupoLojaByFuncionarioLogado() {
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("Você está on-line!!!");
        var cpf = $('#login').text();
        console.debug(cpf);

        var onSuccess = function(result) {
            var arrayGrupoLoja = new Object();
            arrayGrupoLoja = result.resultado;
            if (arrayGrupoLoja[1]) {
                var cdGrupoLoja = arrayGrupoLoja[1].grl_cdgrupoloja;
                localStorage.setItem('cdGrupoLoja',cdGrupoLoja);
                console.debug("Codigo Grupo Loja: " + cdGrupoLoja);
            }
        };

        $.getJSON(servidor + '/sdp/sdp/common/tb_grl_grupo_loja/tb_grl_grupo_lojaConsultGWT.jsp?op=consultByCpfFuncionario&cpfFuncionario=' + cpf, onSuccess).fail(function() {
            alert("Falha na conex�o, contate o administrador do sistema buscarCdGrupoLojaByFuncionarioLogado");
            loader(0);
        });
    } else {
        console.debug("Você não está on-line!!!")
    }
}

function buscarParametroFluxoEncerramento() {
    if (localStorage.getItem('loginOff') == 'false') {
        console.debug("Você está on-line!!!");
        
        var onSuccess = function(result) {
            var arrayParametro = new Object();
            arrayParametro = result.resultado.tb_par_parametro;
            if (arrayParametro) {
                var valorParametro = arrayParametro.par_vlparametro;
                localStorage.setItem('fluxoEncerramentoIntegradoVenda',valorParametro);
                console.debug("Fluxo Encerramento Integrado Venda: " + valorParametro);
            }
        };

        $.getJSON(servidor + '/sdp/sdp/common/tb_par_parametro/tb_par_parametroUpdateDeleteGWT.jsp?op=findbyNmParametro&tb_par_parametroT.par_nmparametro=FLUXO_DE_ENCERRAMENTO_INTEGRADO_A_VENDA', onSuccess).fail(function() {
            alert("Falha na conex�o, contate o administrador do sistema buscarParametroFluxoEncerramento");
            loader(0);
        });
    } else {
        console.debug("Você não está on-line!!!")
    }
}

//FLUXO_DE_ENCERRAMENTO_INTEGRADO_A_VENDA


