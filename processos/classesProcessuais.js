/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {
    acomps: ['Diário', 'Semanal', 'Mensal', 'Eventual', '(não preenchido)'],
    clientes: ['(não preenchido)', 'AGGREGA', 'MARCOS VIDIGAL', 'LIMPIDUS', 'CSO', 'MARIO ORCESI', 'PAVAX'],
    advogados: ['(não preenchido)', 'RXR'],
    responsaveis: ['(não preenchido)', 'MJS', 'CMC', 'VSN', 'GCR', 'RBBA', 'ECS', 'MAS'],
    estados: ['(não preenchido)', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
    comarcas: {
        '(não preenchido)': "(não preenchido)",
        AL: [],
        AP: [],
        AM: [],
        BA: [],
        CE: [],
        DF: [
            'Brasília'
        ],
        ES: [
            'Vitória',
            'Vila Velha'
        ],
        GO: [],
        MA: [],
        MT: [],
        MS: [],
        MG: [],
        PA: [],
        PB: [],
        PR: [],
        PE: [],
        PI: [],
        RJ: [],
        RN: [],
        RS: [],
        RO: [],
        RR: [],
        SC: [],
        SP: [
            'São Paulo',
            'Barueri',
            'Limeira'],
        SE: [],
        TO: []
    },
    instancias: ['1ª', '2ª', 'Administrativa', '(não aplicável)'],
    numVaras: ['', '1ª', '2ª', '3ª', '4ª', '5ª', '6ª'],
    natVaras: ['V. Cível', 'V. Criminal', 'V. Fam. Sucessões', 'V. Faz. Pública', 'V. Única', 'Setor de Execuções Fiscais', '(não preenchido)', '(não aplicável)'],
    fases: ['preparação', 'distribuído', 'execução'],
    status: ['ativo', 'suspenso', 'arquivado', 'retirado do escritório', 'desistido', 'não contratado', '(não aplicável)']
};