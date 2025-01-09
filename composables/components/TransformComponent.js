import { Component } from "three/examples/jsm/libs/ecsy.module.js";

class TransformComponent extends Component {}
TransformComponent.schema = {
  position: { type: Types.Array, default: [0, 0, 0] },
  rotation: { type: Types.Array, default: [0, 0, 0] },
};
