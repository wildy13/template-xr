import { Text } from 'troika-three-text';

export class TextHelper {
    constructor({
        text,
        fontSize = 0.02,
        position = { x: 0, y: 0, z: 0.001 },
        color = 0xffffff,
        textAlign = 'left',
        maxWidth = 0.8,
    }) {
        const content = new Text();
        content.text = text;
        content.fontSize = fontSize;
        content.position.set(position.x, position.y, position.z);
        content.color = color;
        content.fontStyle = 'normal';
        content.textAlign = textAlign;
        content.maxWidth = maxWidth;
        content.overflowWrap = 'break-word';
        content.whiteSpace = 'normal';
        content.lineHeight = 'normal';
        content.anchorX = 'center',
        content.anchorY = 'middle';
        content.direction = 'ltr';

        content.sync();


        return content;
    }
}