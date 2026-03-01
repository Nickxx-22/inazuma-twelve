console.log("SCRIPT INICIADO");
const { MongoClient } = require("mongodb");

async function insertarTecnicas() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("Lisensiado");
    const tecnicas = db.collection("tecnicas");

    const datos = [

{
  "_id": "Mano_Celestial",
  "name": "Mano Celestial",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 60,

  "cost": {
    "stamina": 25,
    "tension": 60
  },

  "creador": "",
  "heredero": ["Mark_Evans_T1"],
  "copia": ["Seymour_Hillman"]
},

{
  "_id": "Despeje_de_Fuego",
  "name": "Despeje de Fuego",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 50,

  "cost": {
    "stamina": 20,
    "tension": 50
  },

  "creador": "Mark_Evans_T1",
  "heredero": [],
  "copia": ["Charlie_Boardfield_T1", "Grant_Cook_P", "Grant_Cook_CS"]
},

{
  "_id": "Super_Relampago",
  "name": "Super Relámpago",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T1",
      "Axel_Blaze_T1"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 20,
    "tension": 70
  },

  "creador": "Mark_Evans_T1",
  "heredero": ["Axel_Blaze_T1"],
  "copia": []
},

{
  "_id": "Despeje_Explosivo",
  "name": "Despeje Explosivo",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 50,

  "cost": {
    "stamina": 20,
    "tension": 50
  },

  "creador": "Mark_Evans_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Mano_Celestial_Doble",
  "name": "Mano Celestial Doble",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 85,

  "cost": {
    "stamina": 40,
    "tension": 80
  },

  "creador": "Mark_Evans_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Supe_Trampolin_Relampago",
  "name": "Super Trampolín Relámpago",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T1",
      "Axel_Blaze_T1",
      "Jack_Wallside_T1"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 20,
    "tension": 70
  },

  "creador": "",
  "heredero": ["Axel_Blaze_T1", "Mark_Evans_T1", "Jack_Wallside_T1"],
  "copia": []
},

{
  "_id": "Ruptura_Relampago",
  "name": "Ruptura Relámpago",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 100,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T1",
      "Axel_Blaze_T1",
      "Jude_Sharp_T1"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 50,
    "tension": 100
  },

  "creador": "Mark_Evans_T1",
  "heredero": ["Axel_Blaze_T1", "Jude_Sharp_T1"],
  "copia": []
},

{
  "_id": "Tri_pegaso",
  "name": "Tri Pegaso",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 85,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T1",
      "Bobby_Shearer_T1",
      "Erik_Eagle_T1"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 30,
    "tension": 80
  },

  "creador": "Mark_Evans_T1",
  "heredero": ["Bobby_Shearer_T1", "Erik_Eagle_T1"],
  "copia": []
},

{
  "_id": "Defensa_Triple",
  "name": "Defensa Triple",
  "type": "save",
  "subtype": ["combo", "parada"],
  "element": "Tierra",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T1",
      "Jack_Wallside_T1",
      "Tod_Ironside_T1"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 20,
    "tension": 75
  },

  "creador": "Mark_Evans_T1",
  "heredero": ["Jack_Wallside_T1", "Tod_Ironside_T1"],
  "copia": []
},

{
  "_id": "Fenix",
  "name": "Fenix",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 85,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T1",
      "Bobby_Shearer_T1",
      "Erik_Eagle_T1"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 50,
    "tension": 85
  },

  "creador": "Mark_Evans_T1",
  "heredero": ["Bobby_Shearer_T1", "Erik_Eagle_T1"],
  "copia": []
},

{
  "_id": "Mano_Magica",
  "name": "Mano Mágica",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 85,

  "cost": {
    "stamina": 20,
    "tension": 80
  },

  "creador": "Mark_Evans_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Entrada_Huracan",
  "name": "Entrada Huracán",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": ["Nathan_Swift_T1", "Nathan_Swift_EO"],
  "heredero": [],
  "copia": ["Vento_Galliano"]
},



{
  "_id": "Pajaro_De_Fuego",
  "name": "Pájaro de Fuego",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 60,

  "isCombo": true,

  "comboRequirements": {
  "allowedGroups": [
    {
      "name": "Raimon_T1",
      "members": [
        "Nathan_Swift_T1",
        "Axel_Blaze_T1",
      ]
    },
    {
      "name": "Inazuma_Eleven_Veterans",
      "members": [
        "Constant_Builder",
        "Seymour_Hillman"
      ]
    }
  ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 20,
    "tension": 60
  },

  "creador": "Nathan_Swift_T1",
  "heredero": ["Axel_Blaze_T1"],
  "copia": ["Constant_Builder", "Seymour_Hillman"]
},



{
  "_id": "Trampolin_Relampago",
  "name": "Trampolín Relámpago",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
  "allowedGroups": [
    {
      "name": "Raimon_T1",
      "members": [
        "Jack_Wallside_T1",
        "Axel_Blaze_T1",
      ]
    },
    {
      "name": "Inazuma_Eleven_Veterans",
      "members": [
        "Joseph_Yosemite",
        "Ian_Suffolk"
      ]
    }
  ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 20,
    "tension": 70
  },

  "creador": "Jack_Wallside_T1",
  "heredero": ["Axel_Blaze_T1"],
  "copia": ["Joseph_Yosemite", "Ian_Suffolk"]
},

{
  "_id": "El_Muro",
  "name": "El Muro",
  "type": "defense",
  "subtype": ["bloqueo", "quitar"],
  "element": "Montaña",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": ["Jack_Wallside_T1", "Jack_Wallside_T2"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Giro_Bobina",
  "name": "Giro Bobina",
  "type": "defense",
  "subtype": ["bloqueo"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": ["Jim_Wraith_T1", "Jim_Wraith_EO"],
  "heredero": [],
  "copia": ["Ricky_Clover_T1", "Gary_Mane"]
},

{
  "_id": "Ataque_Sombrio",
  "name": "Ataque Sombrío",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": ["Jim_Wraith_T1", "Jim_Wraith_EO"],
  "heredero": [],
  "copia": ["Alexander_Brave_T1", "Newton_Flust_T1", "Jim_Hillfort_T1", "Shadow_Cimmerian_EO", "Jimi_Gaines"]
},

{
  "_id": "Giro_de_Mono",
  "name": "Giro de Mono",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": ["Tod_Ironside_T1", "Tod_Ironside_EO"],
  "heredero": [],
  "copia": ["Bruce_Monkey_T1", "York_Nashmith_T1", "Formiga_Clemens"]
},

{
  "_id": "Tiro_del_Cometa",
  "name": "Tiro del Cometa",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Tod_Ironside_T1",
  "heredero": [],
  "copia": []
},


{
  "_id": "Disparo_Rodante",
  "name": "Disparo Rodante",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Steve_Grim_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Zig_Zag_Explosivo",
  "name": "Zig Zag Explosivo",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Fuego",
  "basePower": 70,

  "cost": {
    "stamina": 30,
    "tension": 70
  },

  "creador": "Steve_Grim_T1", 
  "heredero": [],
  "copia": ["Harry_Snake_T1", "Josh_Nathaniel"]
},

{
  "_id": "Cabezazo_Kung_Fu",
  "name": "Cabezazo Kung Fu",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Tim_Saunders_T1", 
  "heredero": [],
  "copia": ["Yasir_Haddad"]
},

{
  "_id": "Torbellino_Dragon",
  "name": "Torbellino Dragón",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Montaña",
  "basePower": 70,

  "cost": {
    "stamina": 30,
    "tension": 70
  },

  "creador": "Tim_Saunders_T1", 
  "heredero": [],
  "copia": ["Yasir_Haddad"]
},

{
  "_id": "Chut_Granada",
  "name": "Chut Granada",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Sam_Kincaid_T1", 
  "heredero": [],
  "copia": ["Peter_Mildred", "Keith_Ryan"]
},

{
  "_id": "Balon_Falso",
  "name": "Balón Falso",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Sam_Kincaid_T1",
  "heredero": [],
  "copia": [ "Peter_Johnson_T1", "Felipe_Palacios", "Keith_Ryan"]
},

{
  "_id": "Tiro_Cruzado",
  "name": "Tiro Cruzado",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Maxwell_Carson_T1", 
  "heredero": [],
  "copia": []
},

{
  "_id": "Robo_Veloz",
  "name": "Robo Veloz",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Maxwell_Carson_T1", 
  "heredero": [],
  "copia": ["Wilson_Fishman_T1", "Cham_Lion_T1", "Alfred_Meenan_T1", "Dawson_Foxx_D", "Dawson_Foxx_CS", "Ted_Bryant"]
},


{
  "_id": "Espejismo",
  "name": "Espejismo",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 45,

  "cost": {
    "stamina": 25,
    "tension": 45
  },

  "creador": "Nathan_Swift_T1", 
  "heredero": [],
  "copia": ["Cham_Lion_T1", "Jez_Shell_T1", "Jupiter_Jumper_T1", "Hank_Sullivan_T1", "Sail_Bluesea_T1"]
},


{
  "_id": "Tornado_De_Fuego",
  "name": "Tornado de Fuego",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": "Axel_Blaze_T1",
  "heredero": [],
  "copia": ["Neil_Turner_T1", "Jonathan_Seller_T1", "Gareth_Flare", "Neil_Turner_Neo"]
},

{
  "_id": "Tornado_Dragon",
  "name": "Tornado Dragón",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Axel_Blaze_T1",
      "Kevin_Dragonfly_T1"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 30,
    "tension": 70
  },

  "creador": "Axel_Blaze_T1",
  "heredero": ["Kevin_Dragonfly_T1"],
  "copia": []
},

{
  "_id": "Empuje_Gemelo_F",
  "name": "Empuje Gemelo F",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 75,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Axel_Blaze_T1",
      "Jude_Sharp_T1",
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 30,
    "tension": 75
  },

  "creador": "Jude_Sharp_T1",
  "heredero": ["Axel_Blaze_T1"],
  "copia": []
},

{
  "_id": "Remate_Dragon",
  "name": "Remate Dragón",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Kevin_Dragonfly_T1", 
  "heredero": [],
  "copia": []
},

{
  "_id": "MegaDragon",
  "name": "MegaDragón",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 70,

  "cost": {
    "stamina": 30,
    "tension": 70
  },

  "creador": "Kevin_Dragonfly_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Barrido_Defensivo",
  "name": "Barrido Defensivo",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": ["Bobby_Shearer_T1", "Bobby_Shearer_T1R", "Bobby_Shearer_T2", "Bobby_Shearer_W"],
  "heredero": ["Alan_Master_T1", "Caleb_Stonewall_RX", "David_Samford_RX"],
  "copia": [ "Peter_Johnson_T1", "Gus_Martin_T1", "Argie_Bargie_Neo", "Daniel_Hatch_Neo", "Steve_Woodmark", "Alan_Master_Neo", "Herman_Waldon_T1", "Tony_Strider", "John_Bloom_T1", "Sam_Kincaid_EO", "Blade_Healen_RX", "Argie_Bargie_RX", "Lee_Bamboo_RX", "Eton_Messer_RX" ]
},

{
  "_id": "Espejismo_De_Balon",
  "name": "Espejismo de Balón",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": ["Jude_Sharp_T1", "Jude_Sharp_T1R", "Jude_Sharp_T2", "Jude_Sharp_T3"],
  "heredero": [],
  "copia": ["Steve_Eagle_T1", "Alan_Master_T1", "Artie_Mishman_T1", "Dave_Quagmire_Neo", "Tyler_Thomas", "Jonah_Spark_RX", "Philip_Arwen", "Erik_Eagle_W"]
},

{
  "_id": "Tiro_Giratorio",
  "name": "Tiro Giratorio",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Erik_Eagle_T1",
  "heredero": [],
  "copia": []
},



{
    "_id": "Espiral_De_Distorsion",
  "name": "Espiral de Distorsión",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Nathan_Jones_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Cuchilla_Asesina",
  "name": "Cuchilla Asesina",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Nathan_Jones_T1",
  "heredero": [],
  "copia": []
},



//Pinguinos
{
  "_id": "Pinguino_Emperador_n_1",
  "name": "Pingüino Emperador nº 1",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 85,

  "cost": {
    "stamina": 70,
    "tension": 100
  },

  "creador": "David_Samford_RX",
  "heredero": [],
  "copia": []
},

{
  "_id": "Pinguino_Emperador_n_2",
  "name": "Pingüino Emperador n°2",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 85,

  "isCombo": true,

  "comboRequirements": {
  "allowedGroups": [
    {
      "name": "Raimon_T1",
      "members": [
        "Jude_Sharp_T1",
        "Axel_Blaze_T1",
        "Erik_Eagle_T1"
      ]
    },
    {
      "name": "Royal_Academy_T1",
      "members": [
        "Daniel_Hatch_T1",
        "Jude_Sharp_T1R", 
        "David_Samford_T1"
      ]
    }
  ],
  "minPlayers": 3
},

  "cost": {
    "stamina": 70,
    "tension": 80
  },

  "creador": ["Jude_Sharp_T1", "Jude_Sharp_T1R"],
  "heredero": ["Erik_Eagle_T1", "Axel_Blaze_T1", "Daniel_Hatch_T1", "Joe_King_T1", "David_Samford_T1"],
  "copia": []
},


{
  "_id": "Pinguino_Emperador_n_3",
  "name": "Pingüino Emperador nº 3",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Caleb_Stonewall_T3",
      "Jude_Sharp_T3",
      "David_Samford_T3"
    ],
    "minPlayers": 3
  },

  "cost": { 
    "stamina": 85, 
    "tension": 115 
  },

  "creador": ["Caleb_Stonewall_T3", "Jude_Sharp_T3"],
  "heredero": ["David_Samford_T3"],
  "copia": []
},





{
  "_id": "Gravedad",
  "name": "Gravedad",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": "Russell_Walk_T1",
  "heredero": ["Ray_Mannings_T1", "Robert_Mayer_T1", "Burt_Wolf_T1"],
  "copia": ["Lane_War_T1", "Milton_Bindings_T2", "Jonah_Spark_RX"]
},

{
  "_id": "Doppelganger",
  "name": "Doppelgänger",
  "type": "defense",
  "subtype": ["bloqueo"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Jason_Jones_T1",
  "heredero": ["Jerry_Fulton_T1"],
  "copia": []
},

{
  "_id": "Terremoto",
  "name": "Terremoto",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "",
  "heredero": [],
  "copia": ["Ken_Furan_T1"]
},

{
  "_id": "Truco_De_Magia",
  "name": "Truco de Magia",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Ray_Mannings_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Niebla_Venenosa",
  "name": "Niebla Venenosa",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Robert_Mayer_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Telarana",
  "name": "Telaraña",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 30,
    "tension": 60
  },

  "creador": "Robert_Mayer_T1",
  "heredero": [],
  "copia": ["Phil_Wingate_T1"]
},

{
  "_id": "Maldicion",
  "name": "Maldición",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Alexander_Brave_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Tiro_Fantasma",
  "name": "Tiro Fantasma",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": ["Johan_Tassman_T1", "Johan_Tassman_Neo"],
  "heredero": ["Troy_Moon_T1", "Burt_Wolf_T1"],
  "copia": []
},

{
  "_id": "Garra_Salvaje",
  "name": "Garra Salvaje",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Charlie_Boardfield_T1",
  "heredero": [],
  "copia": []
},

{
  "_id": "Aceleracion",
  "name": "Aceleración",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Hugo_Talgeese_T1",
  "heredero": ["Adrian_Speed_T1"],
  "copia": ["Malcolm_Night_EO", "Coruja_Cerezo"]
},


{
  "_id": "Tiro_Halcon",
  "name": "Tiro Halcón",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Hugo_Talgeese_T1",
  "heredero": ["Steve_Eagle_T1"],
  "copia": []
},


{
  "_id": "Superarmadillo",
  "name": "Superarmadillo",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": "Leonard_OShea_T1",
  "heredero": ["Gary_Lancaster_T1"],
  "copia": ["Hauser_G", "Miquel_Ros"]
},


{
  "_id": "Remate_Tarzan",
  "name": "Remate Tarzán",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Bruce_Monkey_T1",
  "heredero": ["Gary_Lancaster_T1", "Adrian_Speed_T1"],
  "copia": []
},


{
  "_id": "Remate_Serpiente",
  "name": "Remate Serpiente",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": "Harry_Snake_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Tiro_Dinamita",
  "name": "Tiro Dinamita",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Adrian_Speed_T1",
  "heredero": [],
  "copia": []
},


{
  "_id": "Despeje_Cohete",
  "name": "Despeje Cohete",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 60,
  "cost": { 
    "stamina": 40, 
    "tension": 60
  },

  "creador": ["Thomas_Feldt_T1", "Thomas_Feldt_EO"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Campo_de_Fuerza_Defensivo",
  "name": "Campo de Fuerza Defensivo",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 50,
  "cost": { 
    "stamina": 50,
     "tension": 50
    },

  "creador": "Thomas_Feldt_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Escaner_Defensa",
  "name": "Escáner Defensa",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 60,
  "cost": {
    "stamina": 35,
    "tension": 60
  },
  "creador": "Neil_Turner_T1",
  "heredero": ["Harry_Leading_T1", "Terry_Stronger_T1", "Philip_Marvel_T1", "Noel_Good_T1", "Tyron_Rock_T1", "Francis_Tell_T1", "Samuel_Buster_T1", "Jonathan_Seller_T1", "Victor_Kind_T1"],
  "copia": []
},



{
  "_id": "Escaner_Ataque",
  "name": "Escáner Ataque",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 50,
  "cost": {
    "stamina": 30,
    "tension": 50
  },
  "creador": "Neil_Turner_T1",
  "heredero": ["Harry_Leading_T1", "Terry_Stronger_T1", "Philip_Marvel_T1", "Noel_Good_T1", "Tyron_Rock_T1", "Francis_Tell_T1", "Samuel_Buster_T1", "Jonathan_Seller_T1", "Victor_Kind_T1"],
  "copia": []
},


{
  "_id": "Remate_Misil",
  "name": "Remate Misil",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": ["Neil_Turner_T1", "Neil_Turner_Neo"],
  "heredero": ["Tyron_Rock_T1"],
  "copia": []
},


{
  "_id": "Escudo_de_Fuerza",
  "name": "Escudo de Fuerza",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Joseph_King_T1",
  "heredero": [],
  "copia": []
},


{
  "_id": "Escudo_de_Fuerza_Total",
  "name": "Escudo de Fuerza Total",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 70,

  "cost": {
    "stamina": 50,
    "tension": 75
  },

  "creador": ["Joseph_King_T1", "Joseph_King_RX"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Sismo",
  "name": "Sismo",
  "type": "defense",
  "subtype": ["bloqueo", "quitar"],
  "element": "Montaña",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Zohen_G",
  "heredero": [],
  "copia": ["Peter_Drent_T1", "Chris_Tytan_T2", "Otto_Nobili", "Zack_Cummings_Neo"]
},


{
  "_id": "Ciclon",
  "name": "Ciclón",
  "type": "defense",
  "subtype": ["bloqueo"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": "Ben_Simmons_T1",
  "heredero": [],
  "copia": ["Arion_Matlock_T1", "Charles_Island", "Antonio_Bagre", "Roberto_Torinni", "Arthur_Sweet", "Charles_Riverboat_T2", "Rowan_Beltzer_RX", "Sue_Sparrow_RX"]
},


{
  "_id": "Triangulo_Letal",
  "name": "Triángulo Letal",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Derek_Swing_T1",
      "Daniel_Hatch_T1",
      "David_Samford_T1"
    ], 
    "minPlayers": 3
  },

  "cost": {
    "stamina": 30,
    "tension": 80
  },

  "creador": "David_Samford_T1",
  "heredero": ["Derek_Swing_T1", "Daniel_Hatch_T1"],
  "copia": []
},


{
  "_id": "Chut_De_Los_100_Toques",
  "name": "Chut de los 100 Toques",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": ["Daniel_Hatch_T1", "Daniel_Hatch_Neo"],
  "heredero": [],
  "copia": ["Eton_Messer_RX", "Riley_Jamm_RX"]
},



{
  "_id": "Torbellino",
  "name": "Torbellino",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 50
  },

  "creador": "Morgan_Sanders_T1",
  "heredero": [],
  "copia": []
},




{
  "_id": "Regate_Multiple",
  "name": "Regate Múltiple",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": "Zephyr_Vitesse",
  "heredero": ["Newton_Flust_T1", "Jez_Shell_T1"],
  "copia": []
},





{
  "_id": "Pisoton_de_Sumo",
  "name": "Pisotón de Sumo",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Galen_Thunderbird_T1",
  "heredero": ["Finn_Stoned_T1"],
  "copia": ["Albert_Denver_D", "Albert_Denver_CS", "Hauser_G"]
},



{
  "_id": "Bola_de_Tierra",
  "name": "Bola de Tierra",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": ["Sail_Bluesea_T1", "Sail_Bluessea_Neo"],
  "heredero": ["Sam_Samurai_T1"],
  "copia": []
},



{
  "_id": "Bloqueo_Dureza",
  "name": "Bloqueo Dureza",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "John_Neville_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Corte_Giratorio",
  "name": "Corte Giratorio",
  "type": "defense",
  "subtype": ["bloqueo", "quitar"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": ["Malcolm_Night_T1", "Hurley_Kane_T2", "Malcolm_Night_EO"],
  "heredero": ["Dan_Mirthful_T1"],
  "copia": ["Garret_Hairtown", "Edward_Gladstone", "Spike_Gleeson_T2", "Lee_Bamboo_RX", "Brad_Coldwater_D", "Kormer_G", "Edge_Ripper"]
},



{
  "_id": "Tornado_Inverso",
  "name": "Tornado Inverso",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Marvin_Murdock_T1",
  "heredero": [],
  "copia": ["Sue_Sparrow_RX", "Leonardo_Almeida"]
},




{
  "_id": "Triangulo_Z",
  "name": "Triángulo Z",
  "type": "shot",
  "subtype": ["tiro", "combo"],
  "element": "Fuego",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Marvin_Murdock_T1",
      "Thomas_Murdock_T1",
      "Tyler_Murdock_T1"
    ], 
    "minPlayers": 3
  },
  "cost": {
    "stamina": 55,
    "tension": 85
  },
  "creador": "Marvin_Murdock_T1",
  "heredero": ["Thomas_Murdock_T1", "Tyler_Murdock_T1"],
  "copia":[]
},




{
  "_id": "Muralla_Tsunami",
  "name": "Muralla Tsunami",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 50,
    "tension": 75
  },

  "creador": "Paul_Siddon_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Muralla_Gigante",
  "name": "Muralla Gigante",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 70,

  "cost": {
    "stamina": 50,
    "tension": 75
  },

  "creador": "Paul_Siddon_T1",
  "heredero": [],
  "copia": []
},




{
  "_id": "Tiro_Cegador",
  "name": "Tiro Cegador",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Apollo_Light_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Entrada_Tormenta",
  "name": "Entrada Tormenta",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Jonas_Demetrius_T1",
  "heredero": ["Apollo_Light_T1", "Jeff_Iron_T1", "Wesley_Knox_T1"],
  "copia": ["Maxwell_Carson_EO", "Vento_Galliano"]
},



{
  "_id": "Megaterremoto",
  "name": "Megaterremoto",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 70,

  "cost": {
    "stamina": 50,
    "tension": 70
  },

  "creador": "Danny_Wood_T1",
  "heredero": [],
  "copia": ["Sean_Snowfield_T2", "Argie_Bargie_RX", "Drake_Dynamo", "Walter_Mountain"]
},




{
  "_id": "Hora_Celestial",
  "name": "Hora Celestial",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 90,

  "cost": {
    "stamina": 45,
    "tension": 90
  },

  "creador": ["Byron_Love_T1", "Byron_Love_T2", "Byron_Love_T3"],
  "heredero": ["Artie_Mishman_T1"],
  "copia": []
},


{
  "_id": "Disparo_Con_Rebotes",
  "name": "Disparo con Rebotes",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 65
  },

  "creador": "Jonas_Demetrius_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Sabiduria_Divina",
  "name": "Sabiduría Divina",
  "videoUrl": {"url": "/tecnicas/sabiduria_divina.mp4"},
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 55,
    "tension": 85
  },

  "creador": ["Byron_Love_T1", "Byron_Love_T2", "Byron_Love_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Flecha_Divina",
  "name": "Flecha Divina",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Henry_House_T1",
  "heredero": [],
  "copia": ["Denzel_Freezer_D", "Angelo_Gabrini", "Paolo_Bianchi"]
},



{
  "_id": "Martillo_Defensor",
  "name": "Martillo Defensor",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Lars_Luceafar_T1",
  "heredero": [],
  "copia": []
},


{
  "_id": "Electrotrampa",
  "name": "Electrotrampa",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Lars_Luceafar_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Voltaje_Dual",
  "name": "Voltaje Dual",
  "type": "save",
  "subtype": ["parada", "combo"],
  "element": "Aire",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Lars_Luceafar_T1",
      "Bump_Trungus_T1",
      "Lump_Trungus_T1"
    ], 
    "minPlayers": 3
  },

  "cost": {
    "stamina": 75,
    "tension": 100
  },

  "creador": "Lars_Luceafar_T1",
  "heredero": ["Bump_Trungus_T1", "Lump_Trungus_T1"],
  "copia": []
},




{
  "_id": "Corte_Volcanico",
  "name": "Corte Volcánico",
  "type": "defense",
  "subtype": ["bloqueo"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Radd_Ischer_T1",
  "heredero": ["Jynx_Jenkins_T1"],
  "copia": ["Doyo_Hong", "Bobby_Shearer_W"]
},




{
  "_id": "Gravitacion",
  "name": "Gravitación",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Montaña",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 70
  },

  "creador": "Destra",
  "heredero": [],
  "copia": ["Oni_Triumvir_T1", "Agor", "Hebimos", "Sachinel", "Zack_Cummings_Neo", "Zohen_G", "Chris_Tytan_T2", "Kiburn_G", "Val_Flamewood_P" ,"Ichabod_Stark_T1", "Jim_Landing_T2", "Kayson_Wattever_T2" ,"Grant_Icewater_T2", "Pat_Box_T2", "Gregory_Saturn_T2", "Izzy_Jupiter_T2"]
},




{
  "_id": "Placaje_Extremo",
  "name": "Placaje Extremo",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Drachen_Gunther_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Ignicion",
  "name": "Ignición",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Montaña",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Ichabod_Stark_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Diluvio_Letal",
  "name": "Diluvio Letal",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Escavan_Malice_T1",
  "heredero": [],
  "copia": []
},



{
  "_id": "Remate_Letal",
  "name": "Remate Letal",
  "type": "shot",
  "subtype": ["tiro", "combo"],
  "element": "Montaña",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Escavan_Malice_T1",
      "Bash_Lancer_T1",
      "Mystral_Callous_T1"
    ], 
    "minPlayers": 3
  },

  "cost": {
    "stamina": 75,
    "tension": 100
  },

  "creador": "Bash_Lancer_T1",
  "heredero": ["Escavan_Malice_T1", "Mystral_Callous_T1"],
  "copia": []
},


{
  "_id": "Lanzada_Letal",
  "name": "Lanzada Letal",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Bash_Lancer_T1",
  "heredero": [],
  "copia": ["Mystral_Callous_T1"]
},





//Coz
{
  "_id": "Coz",
  "name": "Coz",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": "Caleb_Stonewall_RX",
  "heredero": [],
  "copia": []
},


{
  "_id": "Coz_2",
  "name": "Coz 2",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 75,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Caleb_Stonewall_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Coz_3",
  "name": "Coz 3",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 100,

  "cost": {
    "stamina": 60,
    "tension": 85
  },

  "creador": "Bash_Lancer_T1",
  "heredero": [],
  "copia": ["Archer_Hawkins_T3"]
},



{
  "_id": "Entrada_de_Llamas",
  "name": "Entrada de Llamas",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Constant_Builder",
  "heredero": [],
  "copia": ["Pekyong_Park", "Eric_Purpleton"]
},




{
  "_id": "Cortina_Aurora",
  "name": "Cortina de Aurora",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 55,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Adam_Ropes_T2",
  "heredero": [],
  "copia": []
},


{
  "_id": "Olor_Embriagador",
  "name": "Olor Embriagador",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 45
  },

  "creador": "Joaquine_Downtown_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "Arcoiris_Luminoso",
  "name": "Arcoíris Luminoso",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 55,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Joaquine_Downtown_T2",
  "heredero": [],
  "copia": []
},





{
  "_id": "Regate_Aurora",
  "name": "Regate Aurora",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 30,
    "tension": 45
  },

  "creador": null,
  "heredero": ["Spike_Gleeson_T2"],
  "copia": ["Lucy_Hailstone_D"]
},




{
  "_id": "Regate_Espejismo",
  "name": "Regate Espejismo",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Maximino_Cruz",
  "heredero": [],
  "copia": ["Kerry_Bootgaiter_T2", "Genel", "Maddox_Rock_T2", "Robert_Skipolson_T2", "Borboleta_Barboza", "Ian_Ferrum"]
},


{
  "_id": "Pared_Solitaria",
  "name": "Pared Solitaria",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 70,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Paolo_Bianchi",
  "heredero": [],
  "copia": ["Maddox_Rock_T2", "Austin_Hobbes_T3"]
},





{
  "_id": "Chut_Congelante",
  "name": "Chut Congelante",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Roland_Climbstein_T2",
  "heredero": ["Quentin_Rackner_T2"],
  "copia": ["Shane_Pierce", "Raffaele_Generani"]
},



{
  "_id": "Paisaje_Helado",
  "name": "Paisaje Helado",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": null, 
  "heredero": [],
  "copia": ["Roland_Climbstein_T2"]
},




{
  "_id": "Ventisca_Eterna",
  "name": "Ventisca Eterna",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 90,

  "cost": {
    "stamina": 50,
    "tension": 85
  },

  "creador": ["Shawn_Froste_T2", "Shawn_Froste_Al", "Shawn_Froste_T3"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Agujero_Negro",
  "name": "Agujero Negro",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 65
  },

  "creador": "Gordon_Star_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "Cinto_Astral",
  "name": "Cinto Astral",
  "type": "defense",
  "subtype": ["bloqueo", "quitar"],
  "element": "Bosque",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Rubu",
  "heredero": [],
  "copia": ["Connor_Shuttle_T2", "Dylan_Bluemoon_T2", "Craven_Kenville_T2", "Kayson_Wattever_T2"]
},



{
  "_id": "Flash_de_Fotones",
  "name": "Flash de Fotones",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": null,
  "heredero": [],
  "copia": ["Charles_Riverboat_T2", "Claire_Lesnow_CS", "Gele_G", "Yakker_Plantsworm_T2", "Craven_Kenville_T2", "Anna_Mole_T2", "Mads_Hatter_T2", "Claire_Lesnow_D"]
},





{
  "_id": "Disparo_Cosmico",
  "name": "Disparo Cósmico",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 70,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Rhona_Countdown_T2",
      "Jordan_Greenway_T2"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 45,
    "tension": 75
  },

  "creador": "Jordan_Greenway_T2",
  "heredero": ["Rhona_Countdown_T2"],
  "copia": []
},



{
  "_id": "Astro_Remate",
  "name": "Astro Remate",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 70,

  "cost": {
    "stamina": 40,
    "tension": 70
  },

  "creador": "Jordan_Greenway_T2",
  "heredero": ["Johan_Tassman_Neo"],
  "copia": ["Dylan_Bluemoon_T2", "Jim_Flareson_P", "Brenda_Firequest_P", "Karen_Ripton_T2", "Bernie_White_D", "Denzel_Freezer_D"]
},







{
  "_id": "Agujero_de_Gusano",
  "name": "Agujero de Gusano",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 80,

  "cost": {
    "stamina": 45,
    "tension": 70
  },

  "creador": "Dave_Quagmire_T2",
  "heredero": [],
  "copia": []
},



{
  "_id": "Destroza_Taladros",
  "name": "Destroza Taladros",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 90,

  "cost": {
    "stamina": 55,
    "tension": 85
  },

  "creador": "Dave_Quagmire_T2",
  "heredero": ["Joseph_King_Neo"],
  "copia": ["Joseph_King_RX"]
},



{
  "_id": "Lanza_de_Odin",
  "name": "Lanza de Odín",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 40,
    "tension": 75
  },

  "creador": ["Dave_Quagmire_T2", "Dave_Quagmire_Neo"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Lluvia_de_Meteoros",
  "name": "Lluvia de Meteoros",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 70,

  "cost": {
    "stamina": 40,
    "tension": 65
  },

  "creador": "Bellatrix_G",
  "heredero": [],
  "copia": ["Anna_Mole_T2", "Carrie_McCuring_T2", "Ethan_Whitering_CS", "Ethan_Whitering_P", "Ronny_Metcalf_T2", "Mads_Hatter_T2", "Karen_Ripton_T2", "Yakker_Plantsworm_T2"]
},


{
  "_id": "Remate_Gaia",
  "name": "Remate Gaia",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Montaña",
  "basePower": 80,
  "isCombo": true,

  "comboRequirements": {
    "allowedGroups": [
      {
        "name": "Epsilon_T2",
        "members": [
          "Carrie_McCuring_T2",
          "Ronny_Metcalf_T2",
          "Zeke_Valanche_T2"
        ]
      },
      {
        "name": "Prominence",
        "members": [
          "Ethan_Whitering_P",
          "Torch_P",
          "Nigel_August_P"
        ]
      }
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 50,
    "tension": 85
  },

  "creador": ["Zeke_Valanche_T2"], 
  "heredero": ["Carrie_McCuring_T2", "Ronny_Metcalf_T2"],
  "copia": ["Ethan_Whitering_P", "Nigel_August_P", "Torch_P"]
},




{
  "_id": "Rayo_de_Ganimedes",
  "name": "Rayo de Ganimedes",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 60
  },

  "creador": ["Zeke_Valanche_T2", "Zeke_Valanche_Neo"],
  "heredero": ["Wilbur_Watkins_Neo"],
  "copia": ["Nigel_August_P", "Nigel_August_CS"]
},




{
  "_id": "Colmillo_de_Pantera",
  "name": "Colmillo de Pantera",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 80,

  "cost": {
    "stamina": 60,
    "tension": 90
  },

  "creador": "Joseph_King_RX",
  "heredero": [],
  "copia": []
},




{
  "_id": "Muralla_Infinita",
  "name": "Muralla Infinita",
  "type": "save",
  "subtype": ["combo", "parada"],
  "element": "Montaña",
  "basePower": 80,

  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Joseph_King_",
      "",
      ""
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 55,
    "tension": 85
  },

  "creador": "Joseph_King_",
  "heredero": ["", ""],
  "copia": []
},







{
  "_id": "Emboscada_Defensiva",
  "name": "Emboscada Defensiva",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 80,

  "cost": {
    "stamina": 50,
    "tension": 75
  },

  "creador": "Caleb_Stonewall_RX",
  "heredero": [],
  "copia": []
},




{
  "_id": "Primera_Leyenda",
  "name": "Primera Leyenda",
  "type": "shot",
  "subtype": ["tiro", "combo"],
  "element": "Aire",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Jude_Sharp_T1",
      "Axel_Blaze_T1"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 55,
    "tension": 100
  },

  "creador": ["Jude_Sharp_T1", "Axel_Blaze_T1"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Remate_Triple",
  "name": "Remate Triple",
  "type": "shot",
  "subtype": ["tiro", "combo"],
  "element": "Fuego",
  "basePower": 85,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Caleb_Stonewall_RX",
      "David_Samford_RX", 
      "Riley_Jamm_RX"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 55,
    "tension": 90
  },

  "creador": "Caleb_Stonewall_RX",
  "heredero": ["David_Samford_RX", "Riley_Jamm_RX"],
  "copia": []
},







{
  "_id": "Bloqueo_de_Hielo",
  "name": "Bloqueo de Hielo",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Ben_North_D",
  "heredero": [],
  "copia": []
},




{
  "_id": "Rompe_Hielos",
  "name": "Rompe Hielos",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": null,
  "heredero": ["Alan_Downhill_D"],
  "copia": ["Albert_Denver_D", "Lucy_Hailstone_D", "Albert_Denver_CS"]
},




{
  "_id": "Pantalla_Acuatica",
  "name": "Pantalla Acuática",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": ["Gazelle_D", "Gazelle_CS"],
  "heredero": [],
  "copia": ["Claire_Lesnow_D", "Gianluca_Zanardi", "Ving_Rice_CS", "Claire_Lesnow_CS", "Dawson_Foxx_CS", "Brad_Coldwater_D", "Dawson_Foxx_D", "Ving_Rice_D", "Bernie_White_D"]
},


{
  "_id": "Pantalla_Ignea",
  "name": "Pantalla Ígnea",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": ["Torch_P", "Torch_CS"],
  "heredero": [],
  "copia": []
},



{
  "_id": "acelerrelampago",
  "name": "acelerrelampago",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 65,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Maximino_Cruz",
  "heredero": [],
  "copia": ["Ving_Rice_D", "Kiburn_G", "Ving_Rice_CS", "Kormer_G", "Ark_G", "Quint_Hampton"]
},





{
  "_id": "Combustion",
  "name": "Combustión",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": ["Grant_Cook_P", "Grant_Cook_CS"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Cortafuegos",
  "name": "Cortafuegos",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": ["Nigel_August_P", "Nigel_August_CS"],
  "heredero": [],
  "copia": ["Bonnie_Sparks_P", "Sean_Ashford_P", "Ben_Blowton_P", "Ben_Blowton_CS", "Sam_Bournes_P", "Bonnie_Sparks_CS"]
},




{
  "_id": "Tacon_Infernal",
  "name": "Tacón Infernal",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 35,
    "tension": 55
  },

  "creador": "Changsu_Choi",
  "heredero": [],
  "copia": ["Sean_Ashford_P", "Enyong_Kim"]
},




{
  "_id": "Llamarada_Atomica",
  "name": "Llamarada Atómica",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 80,

  "cost": {
    "stamina": 55,
    "tension": 80
  },

  "creador": ["Torch_P", "Torch_CS", "Torch_W"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Balon_Iceberg",
  "name": "Balón Iceberg",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 75
  },

  "creador": ["Gazelle_D", "Gazelle_CS", "Gazelle_W"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Ventisca_de_Fuego",
  "name": "Ventisca de Fuego",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 80,
  "isCombo": true,

  "comboRequirements": {
    "allowedGroups": [
      {
        "name": "Caos",
        "members": [
          "Torch_CS",
          "Gazelle_CS",
        ]
      },
      {
        "name": "Fire_Dragons",
        "members": [
          "Torch_W",
          "Gazelle_W",
        ]
      }
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 60,
    "tension": 90
  },

  "creador": [ "Torch_CS", "Gazelle_CS", "Torch_W", "Gazelle_W"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Super_Puño_Invencible",
  "name": "Super Puño Invencible",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 50,
    "tension": 75
  },

  "creador": "Mark_Evans_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "Cabezazo_Megaton",
  "name": "Cabezazo Megatón",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 65
  },

  "creador": "Mark_Evans_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "La_Tierra",
  "name": "La Tierra",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Montaña",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T2",
      "Axel_Blaze_T2",
      "Shawn_Froste_T2"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 80,
    "tension": 100
  },

  "creador": ["Mark_Evans_T2", "Axel_Blaze_T2", "Shawn_Froste_T2"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Campo_Torbellino",
  "name": "Campo Torbellino",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 55
  },

  "creador": ["Scott_Banyan_T2", "Scott_Banyan_T3"],
  "heredero": [],
  "copia": []
},





{
  "_id": "Remate_Tsunami",
  "name": "Remate Tsunami",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 50,

  "cost": {
    "stamina": 40,
    "tension": 55
  },

  "creador": "Hurley_Kane_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "Torre_Inexpugnable",
  "name": "Torre Inexpugnable",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 60
  },

  "creador": "Tori_T2",
  "heredero": [],
  "copia": []
},



{
  "_id": "Arco_Iris",
  "name": "Arco Iris",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 50
  },

  "creador": "Tori_T2",
  "heredero": [],
  "copia": []
},





{
  "_id": "Tiro_Torre_de_Osaka",
  "name": "Tiro Torre de Osaka",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Sue_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "Remate_Pegaso",
  "name": "Remate Pegaso",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 70,

  "cost": {
    "stamina": 45,
    "tension": 70
  },

  "creador": ["Erik_Eagle_T2", "Erik_Eagle_W"],
  "heredero": [],
  "copia": ["Gabriel_Jax"]
},




{
  "_id": "Tormenta_de_Fuego",
  "name": "Tormenta de Fuego",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 70,

  "cost": {
    "stamina": 55,
    "tension": 85
  },

  "creador": "Axel_Blaze_T2",
  "heredero": [],
  "copia": []
},



{
  "_id": "Fuego_Cruzado",
  "name": "Fuego Cruzado",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Axel_Blaze_T2",
      "Shawn_Froste_T2"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 75,
    "tension": 100
  },

  "creador": ["Axel_Blaze_T2", "Shawn_Froste_T2"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Aullido_de_Lobo",
  "name": "Aullido de Lobo",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 55,
    "tension": 80
  },

  "creador": "Shawn_Froste_T2",
  "heredero": [],
  "copia": []
},




{
  "_id": "Manos_Infinitas",
  "name": "Manos Infinitas",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 80,

  "cost": {
    "stamina": 60,
    "tension": 85
  },

  "creador": "Darren_LaChance_T2",
  "heredero": [],
  "copia": []
},



{
  "_id": "Constelacion_Estelar",
  "name": "Constelación Estelar",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 70,

  "cost": {
    "stamina": 50,
    "tension": 70
  },

  "creador": "Nero_G",
  "heredero": [],
  "copia": []
},


{
  "_id": "Muro_Dimensional",
  "name": "Muro Dimensional",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 80,

  "cost": {
    "stamina": 65,
    "tension": 90
  },

  "creador": "Nero_G",
  "heredero": [],
  "copia": []
},




{
  "_id": "Zona_Sigma",
  "name": "Zona Sigma",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 80,

  "cost": {
    "stamina": 55,
    "tension": 75
  },

  "creador": null,
  "heredero": [],
  "copia": ["Gele_G", "Kiwill_G"]
},





{
  "_id": "Cruz_del_Sur",
  "name": "Cruz del Sur",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 70,

  "cost": {
    "stamina": 40,
    "tension": 60
  },

  "creador": "Xene_G",
  "heredero": [],
  "copia": ["Kiwill_G", "Ark_G"]
},





{
  "_id": "Supernova",
  "name": "Supernova",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Wittz_G",
      "Xene_G",
      "Bellatrix_G"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 80,
    "tension": 100
  },

  "creador": ["Xene_G", "Bellatrix_G"],
  "heredero": ["Wittz_G"],
  "copia": []
},




{
  "_id": "Pinguino_Espacial",
  "name": "Pingüino Espacial",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Wittz_G",
      "Xene_G",
      "Bellatrix_G"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 85,
    "tension": 110
  },

  "creador": ["Xene_G", "Bellatrix_G"],
  "heredero": ["Wittz_G"],
  "copia": []
},




{
  "_id": "Superelastico",
  "name": "Superelástico",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Montaña",
  "basePower": 90,
  "cost": {
    "stamina": 55,
    "tension": 80
  },
  "creador": ["Bellatrix_G"],
  "heredero": [],
  "copia": ["Leonardo_Almeida", "Mac_Robingo"]
},




{
  "_id": "Canon_de_Meteoritos",
  "name": "Cañón de Meteoritos",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 70
  },
  "creador": ["Xene_G"],
  "heredero": [],
  "copia": []
},





{
  "_id": "Bloqueo_Doble",
  "name": "Bloqueo Doble",
  "type": "save",
  "subtype": ["combo", "parada"],
  "element": "Bosque",
  "basePower": 60,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Thomas_Feldt_EO",
      "Jim_Wraith_EO"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 45,
    "tension": 60
  },

  "creador": ["Thomas_Feldt_EO"],
  "heredero": ["Jim_Wraith_EO"],
  "copia": []
},




{
  "_id": "Granada_Doble",
  "name": "Granada Doble",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 45,
    "tension": 60
  },

  "creador": ["Sam_Kincaid_EO"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Bateo_Total",
  "name": "Bateo Total",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Tod_Ironside_EO"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Remate_en_V",
  "name": "Remate en V",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 60,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Steve_Grim_EO",
      "Maxwell_Carson_EO"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 45,
    "tension": 60
  },

  "creador": ["Steve_Grim_EO", "Maxwell_Carson_EO"],
  "heredero": [],
  "copia": []
},

{
  "_id": "Tecnica_Kung_Fu",
  "name": "Técnica Kung-Fu",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 50,

  "cost": {
    "stamina": 35,
    "tension": 45
  },

  "creador": ["Tim_Saunders_EO"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Estela_Ignea",
  "name": "Estela Ígnea",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Fuego",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 55
  },

  "creador": ["Tim_Saunders_EO"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Tornado_Oscuro",
  "name": "Tornado Oscuro",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 55
  },

  "creador": ["Shadow_Cimmerian_EO"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Fenix_Oscuro",
  "name": "Fénix Oscuro",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Shadow_Cimmerian_EO",
      "Nathan_Swift_EO",
      "Kevin_Dragonfly_EO"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 80,
    "tension": 110
  },

  "creador": ["Shadow_Cimmerian_EO", "Nathan_Swift_EO", "Kevin_Dragonfly_EO"],
  "heredero": [],
  "copia": []
},





{
  "_id": "Remate_Guiverno",
  "name": "Remate Guiverno",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Bosque",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Kevin_Dragonfly_EO"],
  "heredero": [],
  "copia": []
},






{
  "_id": "Tiro_a_Reaccion",
  "name": "Tiro a Reacción",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Montaña",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Mark_Evans_T3",
      "Axel_Blaze_T3",
      "Austin_Hobbes_T3"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 90,
    "tension": 120
  },

  "creador": ["Mark_Evans_T3", "Axel_Blaze_T3", "Austin_Hobbes_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Puno_de_Furia",
  "name": "Puño de Furia",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Mark_Evans_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Mano_Ultradimensional",
  "name": "Mano Ultradimensional",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 65
  },
  "creador": ["Mark_Evans_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Mano_Celestial_V",
  "name": "Mano Celestial V",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 90,
  "cost": {
    "stamina": 60,
    "tension": 85
  },
  "creador": ["Mark_Evans_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Parada_Celestial",
  "name": "Parada Celestial",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 100,
  "cost": {
    "stamina": 75,
    "tension": 100
  },
  "creador": ["Mark_Evans_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Mano_Omega",
  "name": "Mano Omega",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 100,
  "cost": {
    "stamina": 80,
    "tension": 110
  },
  "creador": ["Mark_Evans_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Remate_Celestial",
  "name": "Remate Celestial",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 80,
  "cost": {
    "stamina": 40,
    "tension": 85
  },
  "creador": ["Byron_Love_T2", "Byron_Love_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Danza_del_Viento",
  "name": "Danza del Viento",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Nathan_Swift_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Ventisca_Huracan",
  "name": "Ventisca Huracán",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 85,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Nathan_Swift_T3",
      "Shawn_Froste_T3"
    ],
    "minPlayers": 2
  },

  "cost": {
    "stamina": 65,
    "tension": 90
  },

  "creador": ["Nathan_Swift_T3", "Shawn_Froste_T3"],
  "heredero": [],
  "copia": []
},




{
  "_id": "La_Montana",
  "name": "La Montaña",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Montaña",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 70
  },
  "creador": ["Jack_Wallside_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Tifon",
  "name": "Tifón",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Hurley_Kane_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Golpe_de_Vacio",
  "name": "Golpe de Vacío",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Aire",
  "basePower": 80,

  "cost": {
    "stamina": 55,
    "tension": 75
  },

  "creador": ["Archer_Hawkins_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Campo_de_Fuerza",
  "name": "Campo de Fuerza",
  "type": "dribble",
  "subtype": ["combo", "regate"],
  "element": "Bosque",
  "basePower": 80,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Caleb_Stonewall_T3", 
      "Jude_Sharp_T3"
    ],
    "minPlayers": 2
  },

  "cost": { 
    "stamina": 55, 
    "tension": 75 
  },

  "creador": ["Caleb_Stonewall_T3", "Jude_Sharp_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "La_Aurora",
  "name": "La Aurora",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 90,
  "isCombo": true,
  "comboRequirements": {
    "players": [
      "Shawn_Froste_T3",
      "Xavier_Foster_T3"
    ],
    "minPlayers": 2
  },

  "cost": { 
    "stamina": 70, 
    "tension": 95 
  },

  "creador": ["Shawn_Froste_T3", "Xavier_Foster_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Big_Bang",
  "name": "Big Bang",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 100,
  "isCombo": true,

  "comboRequirements": {
    "players": [
      "Shawn_Froste_T3",
      "Xavier_Foster_T3",
      "Jude_Sharp_T3"
    ],
    "minPlayers": 3
  },

  "cost": { 
    "stamina": 90, 
    "tension": 125 
  },

  "creador": ["Shawn_Froste_T3", "Xavier_Foster_T3", "Jude_Sharp_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Frente_Frio",
  "name": "Frente Frío",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 90,
  "isCombo": true,
  "comboRequirements": {
    "players": [
      "Shawn_Froste_T3", 
      "Nathan_Swift_T3"
    ],
    "minPlayers": 2
  },
  "cost": { 
    "stamina": 75,
    "tension": 100 
  },

  "creador": "Shawn_Froste_T3",
  "heredero": ["Nathan_Swift_T3"],
  "copia": []
},

{
  "_id": "Ventisca_Triple",
  "name": "Ventisca Triple",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Aire",
  "basePower": 100,
  "isCombo": true,
  "comboRequirements": {
    "players": [
      "Shawn_Froste_T3", 
      "Nathan_Swift_T3",
      "Jude_Sharp_T3"
    ],
    "minPlayers": 3
  },
  "cost": { 
    "stamina": 75,
    "tension": 100 
  },

  "creador": "Shawn_Froste_T3",
  "heredero": ["Nathan_Swift_T3", "Jude_Sharp_T3"],
  "copia": []
},



{
  "_id": "Paisaje_Helado",
  "name": "Paisaje Helado",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 60,

  "cost": {
    "stamina": 40,
    "tension": 55
  },

  "creador": ["Shawn_Froste_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Angel_de_Nieve",
  "name": "Ángel de Nieve",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Shawn_Froste_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Entrada_de_llamas",
  "name": "Entrada de Llamas",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 60,
  "cost": { "stamina": 40, "tension": 55 },
  "creador": ["Axel_Blaze_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Torbellino_de_Fuego",
  "name": "Torbellino de Fuego",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 80,
  "cost": { "stamina": 55, "tension": 75 },
  "creador": ["Axel_Blaze_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Tormenta_del_Tigre",
  "name": "Tormenta del Tigre",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 85,
  "isCombo": true,
  "comboRequirements": {
    "players": ["Axel_Blaze_T3", "Austin_Hobbes_T3"],
    "minPlayers": 2
  },
  "cost": { "stamina": 65, "tension": 90 },
  "creador": "Axel_Blaze_T3",
  "heredero": ["Austin_Hobbes_T3"],
  "copia": []
},



{
  "_id": "Fuego_Total",
  "name": "Fuego Total",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Fuego",
  "basePower": 100,
  "isCombo": true,
  "comboRequirements": {
    "players": [
      "Axel_Blaze_T3",
      "Austin_Hobbes_T3",
      "Xavier_Foster_T3"
    ],
    "minPlayers": 3
  },
  "cost": { "stamina": 85, "tension": 110 },
  "creador": ["Axel_Blaze_T3", "Xavier_Foster_T3", "Austin_Hobbes_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Remate_del_Tigre",
  "name": "Remate del Tigre",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 60,
  "cost": { "stamina": 40, "tension": 55 },
  "creador": ["Austin_Hobbes_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Circulo_de_Espadas",
  "name": "Círculo de Espadas",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 70,
  "cost": { "stamina": 50, "tension": 65 },
  "creador": ["Austin_Hobbes_T3"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Descenso_Estelar",
  "name": "Descenso Estelar",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 85,
  "cost": {
    "stamina": 60,
    "tension": 85
  },
  "creador": ["Xavier_Foster_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Mano_Diabolica",
  "name": "Mano Diabólica",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 100,
  "cost": {
    "stamina": 80,
    "tension": 115
  },
  "creador": ["Darren_LaChance_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Rechace_de_Fuego",
  "name": "Rechace de Fuego",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Jang_Cho"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Llama_Veloz",
  "name": "Llama Veloz",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 35,
    "tension": 50
  },
  "creador": "Changsu_Choi",
  "heredero": ["Umi_Wang", "Doyo_Hong", "Songwan_Ko", "Pekyong_Park"],
  "copia": []
},



{
  "_id": "Baile_de_Llamas",
  "name": "Baile de Llamas",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Fuego",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 65
  },
  "creador": ["Minho_Cho"],
  "heredero": [],
  "copia": ["Erik_Eagle_W", "Ian_Ferrum"]
},



{
  "_id": "Omnisabiduria_divina",
  "name": "Omnisabiduría Divina",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 100,
  "cost": { "stamina": 65, "tension": 100 },
  "creador": ["Byron_Love_T3"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Remate_Caotico",
  "name": "Remate Caótico",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 100,
  "isCombo": true,
  "comboRequirements": {

    "players": [
      "Byron_Love_T3",
      "Torch_W",
      "Gazelle_W"
    ],
    "minPlayers": 3
  },

  "cost": { 
    "stamina": 90, 
    "tension": 120 
  },

  "creador": ["Byron_Love_T3", "Torch_W", "Gazelle_W"],
  "heredero": [],
  "copia": []
},




{
  "_id": "Espada_Defensora",
  "name": "Espada Defensora",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Freddy_McQueen"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Jaula_de_Piedra",
  "name": "Jaula de Piedra",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["David_Buckingham"],
  "heredero": ["Gary_Lancaster", "Lance_Ralton", "Edge_Ripper"],
  "copia": []
},


{
  "_id": "UltraLuna",
  "name": "UltraLuna",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": "Marco_Maserati",
  "heredero": [],
  "copia": ["Peter_Coole", "Gary_Mane", "Paul_Appleton", "Sael"]
},



{
  "_id": "Balon_Galgo",
  "name": "Balón Galgo",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 50,
  "cost": {
    "stamina": 30,
    "tension": 45
  },
  "creador": [],
  "heredero": [],
  "copia": ["Peter_Coole", "Enrique_Caroso", "Roberto_Torinni"]
},



{
  "_id": "Ataque_de_Paladin",
  "name": "Ataque de Paladín",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 50,
  "cost": {
    "stamina": 35,
    "tension": 50
  },
  "creador": "Edgar_Partinus",
  "heredero": [],
  "copia": ["Eric_Purpleton", "Philip_Arwen"]
},


{
  "_id": "Excalibur",
  "name": "Excalibur",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 60,
  "cost": {
    "stamina": 50,
    "tension": 70
  },
  "creador": "Edgar_Partinus",
  "heredero": [],
  "copia": []
},



{
  "_id": "Millon_de_Manos",
  "name": "Millón de Manos",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 65
  },
  "creador": ["Nacho_Ortega"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Muro_de_Hierro",
  "name": "Muro de Hierro",
  "type": "defense",
  "subtype": ["quitar", "bloqueo"],
  "element": "Montaña",
  "basePower": 70,
  "cost": {
    "stamina": 55,
    "tension": 75
  },
  "creador": ["Thiago_Torres"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Voltereta_Circense",
  "name": "Voltereta Circense",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": [],
  "heredero": [],
  "copia": ["Ramon_Martinez", "Marco_Maserati"]
},





{
  "_id": "Imagen_Residual",
  "name": "Imagen Residual",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Sail_Bluesea_T1","Sail_Bluessea_Neo"],
  "heredero": [],
  "copia": ["Sergio_Lopez", "Jimi_Gaines"]
},




{
  "_id": "Remate_del_Aguila",
  "name": "Remate del Águila",
  "type": "shot",
  "subtype": ["tiro", "combo"],
  "element": "Montaña",
  "basePower": 60,
  "isCombo": true,

  "comboRequirements": {

    "players": [
      "Pablo_Castiglione",
      "Leone_Balone",
      "Diego_Oro"
    ],
    "minPlayers": 3
  },

  "cost": {
    "stamina": 55,
    "tension": 75
  },
  "combo": 3,
  "creador": ["Pablo_Castiglione", "Leone_Balone", "Diego_Oro"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Llamarada_Infernal",
  "name": "Llamarada Infernal",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 65
  },
  "creador": ["Leone_Balone"],
  "heredero": [],
  "copia": ["Diego_Oro", "Gorja"]
},



{
  "_id": "Gran_Lobo",
  "name": "Gran Lobo",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Bosque",
  "basePower": 80,
  "isCombo": true,
  "comboRequirements": {
    "players": [
      "Erik_Eagle_W",
      "Mark_Krueger",
      "Dylan_Keats"
    ],
    "minPlayers": 3
  },
  "cost": { 
    "stamina": 70, 
    "tension": 90 
  },
  "creador": "Erik_Eagle_W",
  "heredero": ["Mark_Krueger", "Dylan_Keats"],
  "copia": []
},

{
  "_id": "Remate_Unicornio",
  "name": "Remate Unicornio",
  "type": "shot",
  "subtype": ["combo", "tiro"],
  "element": "Montaña",
  "basePower": 85,
  "isCombo": true,
  "comboRequirements": {
    "players": [
      "Mark_Krueger",
      "Dylan_Keats"
    ],
    "minPlayers": 2
  },
  "cost": { 
    "stamina": 65, 
    "tension": 85 
  },
  "creador": ["Mark_Krueger", "Dylan_Keats"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Truco_Balonazo",
  "name": "Truco Balonazo",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 50,
  "cost": {
    "stamina": 35,
    "tension": 45
  },
  "creador": ["Dylan_Keats"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Guardia_del_Coliseo",
  "name": "Guardia del Coliseo",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Gigi_Blasi"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Defensa_Multiple",
  "name": "Defensa Múltiple",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": "Zephyr_Vitesse",
  "heredero": [],
  "copia": ["Anton_Graziuso"]
},



{
  "_id": "Impulso_Brillante",
  "name": "Impulso Brillante",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Angelo_Gabrini"],
  "heredero": [],
  "copia": ["Borboleta_Barboza", "Coruja_Cerezo"]
},


{
  "_id": "Disparo_Valiente",
  "name": "Disparo Valiente",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 100,
  "cost": {
    "stamina": 85,
    "tension": 100
  },
  "creador": ["Hidetoshi_Nakata"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Ataque_Afilado",
  "name": "Ataque Afilado",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Montaña",
  "basePower": 50,
  "cost": {
    "stamina": 35,
    "tension": 45
  },
  "creador": ["Giacomo_Yani"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Himno_de_Athenea",
  "name": "Himno de Atenea",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 70,
  "cost": { "stamina": 50, "tension": 65 },
  "creador": ["Paolo_Bianchi"],
  "heredero": [], "copia": []
},


{
  "_id": "Espada_de_Odin",
  "name": "Espada de Odín",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 80,
  "cost": { "stamina": 70, "tension": 90 },
  "creador": ["Paolo_Bianchi"],
  "heredero": [], "copia": []
},


{
  "_id": "Parada_Capoeira",
  "name": "Parada Capoeira",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Falcao_Da_Silva"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Entrada_Rodante",
  "name": "Entrada Rodante",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Carlos_Lagarto"],
  "heredero": [],
  "copia": ["Monstro_Ximenes", "Presa_Passos"]
},




{
  "_id": "Golpe_de_Samba",
  "name": "Golpe de Samba",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Mac_Robingo"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Robo_Colombiano",
  "name": "Robo Colombiano",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 100,
  "cost": {
    "stamina": 60,
    "tension": 85
  },
  "creador": ["Lisensiado"],
  "heredero": [],
  "copia": []
},
{
  "_id": "Tiro_RB6",
  "name": "Tiro RB6",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 90,
  "cost": {
    "stamina": 65,
    "tension": 85
  },
  "creador": ["Lisensiado"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Mano_Celestial_X",
  "name": "Mano Celestial X",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 80,
  "cost": { "stamina": 60, "tension": 80 },
  "creador": ["Hector_Helio"],
  "heredero": [], "copia": []
},
{
  "_id": "Mano_Espiritual",
  "name": "Mano Espiritual",
  "type": "save",
  "subtype": ["parada"],
  "element": "Fuego",
  "basePower": 100,
  "cost": { "stamina": 85, "tension": 100 },
  "creador": ["Hector_Helio"],
  "heredero": [], "copia": []
},
{
  "_id": "Canon_X",
  "name": "Cañón X",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 70,
  "cost": { "stamina": 55, "tension": 75 },
  "creador": ["Hector_Helio"],
  "heredero": [], "copia": []
},


{
  "_id": "Patin_Aereo",
  "name": "Patín Aéreo",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 65
  },
  "creador": ["Maximino_Cruz"],
  "heredero": [],
  "copia": ["Drago_Hill"]
},


{
  "_id": "Mandibulas_Dobles",
  "name": "Mandíbulas Dobles",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Fuego",
  "basePower": 60,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Drago_Hill"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Muralla_Infinita",
  "name": "Muralla Infinita",
  "type": "save",
  "subtype": ["parada"],
  "element": "Montaña",
  "basePower": 85,
  "cost": {
    "stamina": 65,
    "tension": 90
  },
  "creador": ["Joseph_King_Neo"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Zona_Sagrada",
  "name": "Zona Sagrada",
  "type": "save",
  "subtype": ["parada"],
  "element": "Aire",
  "basePower": 80,
  "cost": {
    "stamina": 60,
    "tension": 85
  },
  "creador": ["Anorel"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Subida_a_los_Cielos",
  "name": "Subida a los Cielos",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Aire",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Ekadel"],
  "heredero": ["Nenel", "Genel", "Lephiel", "Ientel"],
  "copia": []
},


{
  "_id": "Balon_Angelical",
  "name": "Balón Angelical",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Aire",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Escavan_Malice_T1"],
  "heredero": ["Nenel", "Sachinel", "Wenel", "Nuel", "Ientel"],
  "copia": []
},


{
  "_id": "Vuelo_de_Icaro",
  "name": "Vuelo de Ícaro",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Fuego",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Gaiel"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Remate_Celestial",
  "name": "Remate Celestial",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Montaña",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 65
  },
  "creador": ["Sael"],
  "heredero": ["Gaiel"],
  "copia": []
},



{
  "_id": "El_Olvido",
  "name": "El Olvido",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 80,
  "cost": {
    "stamina": 60,
    "tension": 85
  },
  "creador": ["Astaroth"],
  "heredero": [],
  "copia": []
},



{
  "_id": "Araña_Gigante",
  "name": "Araña Gigante",
  "type": "save",
  "subtype": ["parada"],
  "element": "Bosque",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Astaroth"],
  "heredero": [],
  "copia": []
},


{
  "_id": "Caida_a_los_Infiernos",
  "name": "Caída a los Infiernos",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Rubu"],
  "heredero": ["Belal", "Borba"],
  "copia": []
},


{
  "_id": "Balon_Diabolico",
  "name": "Balón Diabólico",
  "type": "dribble",
  "subtype": ["regate"],
  "element": "Bosque",
  "basePower": 70,
  "cost": {
    "stamina": 45,
    "tension": 60
  },
  "creador": ["Destra"],
  "heredero": ["Agor", "Hebimos", "Malphas", "Gorja", "Arakune", "Zanos"],
  "copia": []
},


{
  "_id": "Carga_Negativa",
  "name": "Carga Negativa",
  "type": "shot",
  "subtype": ["tiro"],
  "element": "Aire",
  "basePower": 60,
  "cost": {
    "stamina": 40,
    "tension": 55
  },
  "creador": ["Destra"],
  "heredero": ["Belal", "Zanos"],
  "copia": []
},

{
  "_id": "Corte_Diabolico",
  "name": "Corte Diabólico",
  "type": "defense",
  "subtype": ["quitar"],
  "element": "Bosque",
  "basePower": 70,
  "cost": {
    "stamina": 50,
    "tension": 65
  },
  "creador": ["Malphas"],
  "heredero": ["Arakune"],
  "copia": []
}






];

    const resultado = await tecnicas.insertMany(datos);

    console.log("Técnicas insertadas:", resultado.insertedCount);
  } catch (error) {
    console.error("Error al insertar técnicas:", error);
  } finally {
    await client.close();
  }
}

insertarTecnicas();