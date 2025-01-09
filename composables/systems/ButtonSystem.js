import { System } from "three/examples/jsm/libs/ecsy.module.js";
import { ButtonComponent } from "../components/ButtonComponent";
import { Object3D } from "../components/Object3DComponent";

export class ButtonSystem extends System {
    execute() {
        this.queries.buttons.results.forEach(entity => {
            const button = entity.getMutableComponent(ButtonComponent);
            const mesh = entity.getComponent(Object3D).object;

            mesh.scale.set(button.currState === 'none' ? 1 : 1.1, button.currState === 'none' ? 1 : 1.1, button.currState === 'none' ? 1 : 1.1);

            if (button.currState === 'pressed' && button.prevState != 'pressed') {
                if (mesh.visible = true) {
                    button.action();
                }
            }

            button.prevState = button.currState;
            button.currState = 'none';
        });
    }
}

ButtonSystem.queries = {
    buttons: { components: [ButtonComponent] }
}