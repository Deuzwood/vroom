/**
 * Fichier de variable utiliser plusieur fois sans être modifier
 * Je les déclare ici pour pouvoir les modifier si besoin sans 
 * les modifier dans chaque fichiers.

 */

/* Map */
const DEFAULT_NB_TURN = 3;

const W_ROAD = 14;

const CLR_GROUND = 0x222222;
const CLR_LINE = 0xffffff;
const CLR_SIDE = 0x777777;

/* Environnement  */
const CLR_LEAVES = 0x264d00;
const CLR_LEAVES_VAR1 = 0x003300;
const CLR_LEAVES_VAR2 = 0xffccff; // cerisier
const CLR_WOOD = 0x663300;
const CLR_WOOD_VAR1 = 0x734d26;

/* Terrain */
const CLR_GRASS = 0x317d32;
const CLR_DIRT = 0x4f4330;
const CLR_CLAY = 0x675b4e;
const CLR_STONE = 0x565656;
const CLR_SNOW = 0xe9e9e9;

/* Voiture */

const MAX_SPEED = 60;

/* Var , on y ajouter les (side) de la map à sa generation
permet de check si la voiture (car) touche les bords */
let collidable = [];

/* list des segment sous forme de AABB  */
/**
 * pour la generation du terrain
 */
let AABB_road = [];