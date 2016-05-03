// /*global localforage*/

// localforage && (function(localforage, global) {

//     var lf = localforage.createInstance({
//         name: "AhsSyncForage_DB"
//     });

    
//     function setItem(key,value,callback){
//         return
//     }
    
//     function getItem(key,callback) {
//         //
//     }
    
//     function removeItem(key,callback){
//         //
//     }
    
    

//     function Item(name) {
//         //...
//     }

//     Item.prototype.set = function Item_set(value, callback) {
//         this.newValue = value;
//         this.modified = true;
//         (typeof callback === "function") && this.commit(callback);
//     };

//     Item.prototype.remove = function Item_remove(callback) {
//         //
//     };

//     Item.prototype.commit = function Item_commit(callback) {
//         //
//     }

//     Item.prototype.get = function Item_get(callback) {
//         //
//     };



//     global["syncforage"] = {
//         //...
//     };

// })(localforage, window);












// // /*global angular*/

// // angular
// //     .module("AhsSyncForage", ['LocalForageModule'])
// //     /*Configurations*/
// //     .config(['$localForageProvider', function($localForageProvider) {

// //         $localForageProvider.config({
// //             name: 'AhsSyncForage_DB', // name of the database and prefix for your data, it is "lf" by default
// //             storeName: 'keyvaluepairs' // name of the table
// //         });

// //     }])
// //     /*Services*/
// //     .service("$syncForage", ['$localForage', '$http', function($localForage, $http) {

// //         this.setItem = function setItem(key, val) {
// //             //...
// //         };

// //         this.getItem = function getItem(key) {
// //             // body...
// //         };

// //         this.removeItem = function removeItem(key) {
// //             // body...
// //         };

// //         this.table=function table(tableName){
// //             return {
// //                 //....
// //             };
// //         };

// //     }])
// //     /*End*/
// // ;
