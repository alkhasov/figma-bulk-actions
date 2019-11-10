// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(300, 215);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

function inlineValues(arr) {
  let inlined = '';
  if (typeof arr !== 'object') {
    return false;
  }
  if(Array.isArray(arr)) {
    inlined = arr.join(', ');
  } else {
    inlined = Object.keys(arr)
      .filter(el => typeof arr[el] === 'string' || typeof arr[el] === 'number')
      .map(el => arr[el]).join(', ');
  }
  return inlined;
}

function notZero(a) {
  if(parseInt(a) > 0 && a.length != 0) {
    return true;
  } else {
    return false;
  }
}

figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'move') {
    const nodes: SceneNode[] = [];
    let count = 0;
    figma.currentPage.selection.forEach(el => {
      count++;
      nodes.push(el);
    });
    if(notZero(msg.data.xaxis) && notZero(msg.data.yaxis)) {
      nodes.map (el=> {
        el.x += parseInt(msg.data.xaxis, 10)
        el.y += parseInt(msg.data.yaxis, 10);
      })
      figma.currentPage.selection = nodes;
      figma.notify(`${count} items are resized`);
    } else {
      figma.notify('No changes');
    }
  }

  if (msg.type === 'resize') {
    const nodes: SceneNode[] = [];
    let count = 0;
    const width = msg.data.width;
    const height = msg.data.height;

    figma.currentPage.selection.forEach(el => {
      count++;
      nodes.push(el);
    });
    if(notZero(width) && notZero(height)) {
      nodes.map (el=> {
        el.resize(el.width + parseInt(width, 10), el.height + parseInt(height, 10));
      })
      figma.currentPage.selection = nodes;
      figma.notify(`${count} items are resized`);
    } else {
      figma.notify('No changes');
    }
  }

  if (msg.type === 'scaledownone') {
    const nodes: SceneNode[] = [];
    let count = 0;
    figma.currentPage.selection.forEach(el => {
      count++;
      nodes.push(el);
    });
    nodes.map (el=> {
      el.resize(el.width / 2, el.height / 2);
    })
    figma.currentPage.selection = nodes;
    figma.notify(`${count} items are scaled down to @1x`);
    figma.closePlugin();
  }

  if (msg.type === 'log') {
    figma.notify(`data form ui, width:${msg.data.width}`);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};
