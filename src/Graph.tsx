import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_abc: 'float', // Added 'price_abc' to the schema
      price_def: 'float', // Added 'price_def' to the schema
      ratio: 'float', // Added 'ratio' to the schema
      timestamp: 'date',
      upper_bound: 'float', // Added 'upper_bound' to the schema
      lower_bound: 'float', // Added 'lower_bound' to the schema
      trigger_alert: 'float', // Added 'trigger_alert' to the schema
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]'); // Added 'ratio', 'lower_bound', 'upper_bound', 'trigger_alert' to the columns
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg', // Added 'price_abc' to the aggregates
        price_def: 'avg', // Added 'price_def' to the aggregates
        ratio: 'avg', // Added 'ratio' to the aggregates
        timestamp: 'distinct count',
        upper_bound: 'avg', // Added 'upper_bound' to the aggregates
        lower_bound: 'avg', // Added 'lower_bound' to the aggregates
        trigger_alert: 'avg', // Added 'trigger_alert' to the aggregates
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([DataManipulator.generateRow(this.props.data),] as unknown as TableData);
    }
  }
}

export default Graph;
