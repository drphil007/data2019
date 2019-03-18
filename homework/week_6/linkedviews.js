

// Get json data from file
$.getJSON("data.json", function(json) {
    
    processData(json);
});

// process json formatted data
function processData (json) {

    let data = json;

    var immigrationArray = [];
    var genderArray = [];
    var bevolkingsontwikkelingArray = [];

    Object.keys(data.value).forEach(function(d) {
        console.log(data.value[d]);

        console.log(data.value[d]["Perioden"]);

        var periode = data.value[d]["Perioden"];
        var mannen =  data.value[d]["Mannen_2"];
        var vrouwen = data.value[d]["Vrouwen_3"];
        var levendGeborenen = data.value[d]["Levendgeborenen_54"];
        var overledenen = data.value[d]["Overledenen_55"];
        var immigratieTotaal =  data.value[d]["Immigratie_57"];
        var emigratieTotaal =  data.value[d]["EmigratieExclusiefAdministratieveC_58"];
        var migratieSaldo = data.value[d]["Migratiesaldo_59"];
        var bevolkingsGroei = data.value[d]["TotaleBevolkingsgroei_60"];
        var percentageBevolkingsGroei = data.value[d]["TotaleBevolkingsgroeiRelatief_61"];

        var immigratieGeboorteland = data.value[d]["Indonesie_142"];
        var emmigratieGeboorteland = data.value[d]["Indonesie_152"];

        var immigratieLandvanHerkomst = data.value[d]["Indonesie_163"];
        var emigratieLandvanHerkomst = data.value[d]["Indonesie_173"];

        var immigratieIndoTotaal = immigratieGeboorteland + immigratieLandvanHerkomst;
        var emmigratieIndoTotaal = emmigratieGeboorteland + emigratieLandvanHerkomst;

    });
};

