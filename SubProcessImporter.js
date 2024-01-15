import { is } from 'bpmn-js/lib/util/ModelUtil';

import {
  isExpanded
} from 'bpmn-js/lib/util/DiUtil';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import copyAndPaste from './CopyAndPaste';

export default class SubProcessImporter {
  constructor(popupMenu, bpmnReplace, bpmnjs) {
    popupMenu.registerProvider("bpmn-replace", this);
    this.bpmnjs = bpmnjs;
    // TODO: this should be provided as module parameter or automatically determined from bpmnjs
    this.moddleExtensions = {};
  }

  getPopupMenuEntries(element) {
    if ( is(element, 'bpmn:SubProcess') && !isExpanded(element) && !hasChildren(element) ) {
      return{
        'import-into-subprocess': {
          label: 'Import into empty subprocess',
          className: 'bpmn-icon-subprocess-collapsed',
          action: () => this.openFileUploadDialog(element)
        }
      };
    }
  }

  openFileUploadDialog(element) {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';

    // Append the file input to the document
    document.body.appendChild(fileInput);

    // Trigger a click on the file input
    fileInput.click();

    // Listen for the change event on the file input
    fileInput.addEventListener('change', (event) => this.loadFile(event,element) );

    // Remove the file input from the document after the change event
    fileInput.addEventListener('change', function () {
      document.body.removeChild(fileInput);
    });
  }

  loadFile(event,element) {
    // Check if exactly one file is selected
    var reader = new FileReader();
    reader.onload = (e) => {
      // Create new modeler for import of the model
      const sourceModeler = new BpmnModeler( { moddleExtensions: this.moddleExtensions } );
      sourceModeler.importXML( reader.result ).then( () => {
        const elementRegistry = sourceModeler.get('elementRegistry');
        const processes = elementRegistry.filter(function (element) {
          return is(element, 'bpmn:Process');
        });
        if ( processes.length == 1 ) {
          // Copy content of process into the target subprocess
          copyAndPaste(sourceModeler, processes[0], this.bpmnjs, element);
        }
        else {
          console.warn('Failed to determine unique process.');
        }
      });
    };
    reader.onerror = (err) => {
      console.log(err,err.loaded,err.loaded === 0,file);
    };

    reader.readAsText(event.target.files[0]);
  }
}

SubProcessImporter.inject = [
  'popupMenu',
  'bpmnReplace',
  'bpmnjs'
];

// helper /////

function hasChildren(element) {
  return element.businessObject
    && element.businessObject.flowElements
    && element.businessObject.flowElements.length;
}
