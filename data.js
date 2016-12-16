var COMPETITION_DEFAULT = 'DEFAULT';
var COMPETITION_CHAMPIONS = 'CHAMPIONS';
var COMPETITION_TACA_LIGA = 'TACA_LIGA';
var COMPETITION_TACA_PT = 'TACA_PT';

var ptTeams = [
    { "name": "Benfica", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/benfica/1679" },
    { "name": "Sporting CP", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/sporting-cp/1680" },
    { "name": "Porto", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/porto/1678" },
    { "name": "Sporting Braga", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/sporting-braga/1682" },
    { "name": "Vitória Guimarães", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/vitria-guimares/1689" },
    { "name": "Rio Ave", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/rio-ave/1683" },
    { "name": "Marítimo", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/martimo/1684" },
    { "name": "Chaves", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/chaves/1704" },
    { "name": "Estoril", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/estoril/1695" },
    { "name": "Belenenses", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/belenenses/1692" },
    { "name": "Arouca", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/arouca/11611" },
    { "name": "Paços de Ferreira", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/paos-de-ferreira/1693" },
    { "name": "Boavista", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/boavista/1685" },
    { "name": "Vitória Setúbal", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/vitria-setbal/1696" },
    { "name": "Moreirense", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/moreirense/1687" },
    { "name": "Feirense", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/feirense/1705" },
    { "name": "Tondela", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/tondela/11833" },
    { "name": "Nacional", "url": "https://www.onlinebettingacademy.com/stats/team/portugal/nacional/1681" }
];

exports.sports = [
    { sportId: 1, name: 'footbal' }
]

exports.Competitions = [
    { competitionId: 1, name: 'Primeira Liga 16/17', type: COMPETITION_DEFAULT },
    { competitionId: 2, name: 'Primeira Liga 16/17', type: COMPETITION_DEFAULT },
    { competitionId: 3, name: 'UEFA Champions League 16/17', type: COMPETITION_CHAMPIONS },
    { competitionId: 4, name: 'Taça de Portugal 16/17', type: COMPETITION_TACA_PT }
];

exports.getTeamByName = function (name) {
    // TODO: Call db find here...(by name)

    return ptTeams.filter(function (obj) {
        return obj.name == name;
    });
}

exports.getAllTeams = function () {
    // TODO: Call db find here...(by name)

    return ptTeams;
}

