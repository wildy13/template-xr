import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class DraggableDefault extends Component { }
DraggableDefault.schema = {
    state: { type: Types.String, default: 'none' },
    originalParent: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null },
};
