import { Component, Types } from 'three/addons/libs/ecsy.module.js';


export class Teleport extends Component { }
Teleport.schema = {
    state: { type: Types.String, default: 'none' },
    attachedPointer: { type: Types.Ref, default: null },
}