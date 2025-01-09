import { Component, Types } from "three/examples/jsm/libs/ecsy.module.js";

export class Button extends Component { }

Button.schema = {
    currState: { type: Types.String, default: 'none' },
    prevState: { type: Types.String, default: 'none' },
    action: { type: Types.Ref, default: () => { } }
}