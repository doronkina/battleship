import Module from './module/module';
import View from './view/view';
import Controller from './controller/controller';

const element = document.querySelector('#root');
const borderWidth = 4;
const panelParameter = 40;
const playFieldWidth = 350;
const playFieldHeight = 350;
const cols = 10;
const rows = 10;
const maxShipLength = 4;

const module = new Module(cols, rows, maxShipLength);
const view = new View(element, borderWidth, panelParameter, playFieldWidth, playFieldHeight, cols, rows);
const controller = new Controller(module, view);