function fnMensagemCumprimento() {
    moment.locale('pt-BR');
    
    moment.updateLocale('pt-BR', {
        months : [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
            "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ]
    });

    const agora = moment();
    const hora = agora.hour(); // Obtém a hora atual (0-23)

    if (hora >= 5 && hora < 12) {
        return `Bom dia! ${agora.format('LLLL')}.`;
    } else if (hora >= 12 && hora < 18) {
        return `Boa tarde! ${agora.format('LLLL')}.`;
    } else {
        return `Boa noite! ${agora.format('LLLL')}.`;
    }
}

function fnConverterTimestampParaDataPTBR(value) {
    var date = new Date(value * 1000);
    return date.toLocaleDateString("pt-BR");
}