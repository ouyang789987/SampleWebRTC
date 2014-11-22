// Constants
// TODO:keyとvalueに分ける?
var JSON_KEY_TYPE = "type";
var JSON_KEY_TYPE_TEXT_MESSAGE = "text";
var JSON_KEY_TYPE_ANNOTATION = "annotation";
var JSON_KEY_ID = "id";
var JSON_KEY_TEXT_MESSAGE_MEESSAGE = "message";
var JSON_KEY_ANNOTATION_COMMAND = "command";
var JSON_KEY_ANNOTATION_COMMAND_DRAW = "draw";
var JSON_KEY_ANNOTATION_COMMAND_CLEAR = "clear";
var JSON_KEY_ANNOTATION_COMMAND_CANVAS_OUT = "canvas_out";
var JSON_KEY_ANNOTATION_DRAW_ARGS = "args";
var JSON_KEY_ANNOTATION_MARKER_TYPE = "marker_type";
var JSON_KEY_ANNOTATION_MARKER_WIDTH = "marker_width";
var JSON_KEY_ANNOTATION_MARKER_COLOR = "marker_color";
var JSON_KEY_ANNOTATION_MARKER_POINT_X = "point_x";
var JSON_KEY_ANNOTATION_MARKER_POINT_Y = "point_y";

// WebSocket connection
var WS_PORT = "3001";
var PREFIX = "ws";

// Canvas
var CANVS_FRAME_SIZE_X = 640;
var CANVS_FRAME_SIZE_Y = 480;

var TIMEOUT_MILLS = 500;
