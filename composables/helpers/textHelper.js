import * as THREE from 'three';
import { Text } from 'troika-three-text';

/**
 * @param {string} [text] - text or sentence
 * @param {number} [fontSize] - font size
 * @param {object} [position] - position of plane
 * @param {number} [maxWidth] - max width of text
 * @param {string} [textAlign] - alignment of the text ('left', 'center', 'right', 'justify')
 */

export class CreateText {
    constructor({ text, fontSize = 0.02, position = { x: 0, y: 0, z: 0.001 }, color = 0xffffff, textAlign = 'center', maxWidth, lineHeight }) {

        const content = new Text();
        content.text = text;
        content.fontSize = fontSize;
        content.position.set(position.x, position.y, position.z);
        content.color = color;
        content.fontStyle = 'normal';
        content.textAlign = textAlign;
        content.maxWidth = maxWidth || 0.82;
        content.overflowWrap = 'break-word';
        content.whiteSpace = 'normal'
        content.lineHeight = lineHeight || 'normal';
        content.anchorX = 'center',
        content.anchorY = 'middle',
        content.direction = 'ltr'
        content.sync();

    

        return content;
    }

    updateText(newText) {
        this.text = newText;
        this.sync();
    }

    // Method to update position dynamically
    updatePosition(newPosition) {
        this.position.set(newPosition.x, newPosition.y, newPosition.z);
        this.sync();
    }
}
