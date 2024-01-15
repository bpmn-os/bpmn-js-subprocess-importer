import { is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * Copies all children from a source element to a target element.
 */
export default function copyAndPaste(sourceModeler, sourceElement, targetModeler, targetElement ) {
  const sourceClipboard = sourceModeler.get('clipboard'),
        sourceCopyPaste = sourceModeler.get('copyPaste'),
        sourceElementRegistry = sourceModeler.get('elementRegistry');

  // determine elements to be copied
  var elements = [];
  if ( is(sourceElement, 'bpmn:Process') ) {
    elements = sourceElementRegistry.getAll().filter(function(element) {
      return element.parent && element.parent.id == sourceElement.id;
    });
  }
  else {
    elements = sourceElementRegistry.getAll().filter(function(element) {
      return element.parent && element.parent.id == sourceElement.id + '_plane';
    });
  }

  // copy elements from source
  sourceCopyPaste.copy(elements);

  const targetClipboard = targetModeler.get('clipboard'),
        targetCopyPaste = targetModeler.get('copyPaste'),
        targetElementRegistry = targetModeler.get('elementRegistry');

  // put into clipboard of target
  targetClipboard.set(sourceClipboard.get());
  const planeElement = targetElementRegistry.get(`${targetElement.id}_plane`);
  // paste into target
  targetCopyPaste.paste( { element: planeElement, point: {x: 500, y: 200} });

  // clear clipboard
  targetClipboard.clear();
}

