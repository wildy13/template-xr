import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class ControllerComponent extends Component { }

ControllerComponent.schema = {
    template: { type: Types.Ref },
    controllers: { type: Types.Ref },
}
