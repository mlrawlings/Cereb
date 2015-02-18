import IterableReference from './iterable'
import { updateProxy } from '../util'

export default class ListReference extends IterableReference {}

//List specific persistent changes from Immutable.js 
//(others inherited from IterableReference)
updateProxy(ListReference, ['push', 'pop', 'unshift', 'shift', 'setSize'])