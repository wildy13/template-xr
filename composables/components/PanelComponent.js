import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class PanelComponent extends Component { }
PanelComponent.schema = {
    state: { type: Types.String, default: 'to-be-detached' },
    anchors: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null },
    originalParent: { type: Types.Ref, default: null },
};
