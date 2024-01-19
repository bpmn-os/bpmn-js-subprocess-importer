# bpmn-js SubProcess Importer

This [bpmn-js](https://github.com/bpmn-io/bpmn-js) extension adds an *"Import into empty subprocess"* menu item into the popup menu of collapsed and empty subprocesses. This menu item allows to populate the subprocess with contents loaded from an external BPMN model file.

![bpmn-js subprocess importer in action](./demo.gif)


## Use Extension

Extend your BPMN modeler with the module:

```javascript
import BpmnModeler from 'bpmn-js/lib/Modeler';

import SubProcessImporterModule from 'bpmn-js-subprocess-importer';

const modeler = new BpmnModeler({
  additionalModules: [
    SubProcessImporterModule
  ]
});
```

To also copy custom model extensions, you need to provide the respective `moddleExtensions`:

```javascript
import BpmnModeler from 'bpmn-js/lib/Modeler';

import SubProcessImporterModule from 'bpmn-js-subprocess-importer';

var myModdleExtensions = { /* add your moddle extensions here */ };

const modeler = new BpmnModeler({
  additionalModules: [
    SubProcessImporterModule
  ],
  moddleExtensions: myModdleExtensions
});
```
modeler.get('subProcessImporter').setModdleExtensions(myModdleExtensions);


## License

MIT licensed

Copyright (C) 2024 Asvin Goel
