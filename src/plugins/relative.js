import createPlugin, {YES, PASS, NO} from './_common';
import {inParents} from '../module';
import { getExtensions } from "../constants";

const trimKey = (key) => key[0] == '.' ? trimKey(key.substr(1)) : key;
const endsWith = (a, b) => a.substring(a.length - b.length) === b;

export const relativeWipeCheck = (stubs, moduleName) => {
  if (Object
      .keys(stubs)
      .some(key =>
        getExtensions().some( ext => endsWith(moduleName, trimKey(key+ext)))
      )
  ) {
    return YES;
  }
};

const fileNameTransformer = (fileName/*, module*/) => fileName;

const shouldMock = (mock, request, parent, topModule) => {
  if(mock.flag_directChildOnly === false) {
    return PASS;
  }
  return inParents(parent, topModule) ? PASS : NO;
};

const plugin = createPlugin({
  fileNameTransformer,
  shouldMock,

  name: 'relative'
});

export default plugin;