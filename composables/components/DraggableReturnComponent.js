import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class DraggableReturn extends Component { }
DraggableReturn.schema = {
    state: { type: Types.String, default: 'none' },
    originalParent: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null },
    originalPosition: { type: Types.Ref, default: null },    
    originalQuaternion: { type: Types.Ref, default: null }
};
