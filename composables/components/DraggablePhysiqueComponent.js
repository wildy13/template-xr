import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class DraggablePhysique extends Component { }
DraggablePhysique.schema = {
    state: { type: Types.String, default: 'none' },
    originalParent: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null },
    position: { type: Types.Ref, default: null },   
};
