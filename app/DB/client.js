/**
 * Created by hebao on 2017/7/17.
 */
'use strict';
import Realm from 'realm';
class Client extends Realm.Object {
}
Client.schema = {
    name: 'Client',
    properties: {
        currClient: 'string',
    },
};
export default new Realm({schema: [Client]});