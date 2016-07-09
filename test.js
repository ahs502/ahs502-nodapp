#! /usr/bin/node

// Sett: https://github.com/felixge/node-dirty

var dirty=require("dirty");

var db=dirty('dirty.db');

db.on('load',()=>{
    
    db.set('zxc',{a:123,b:"BBBBBBB"});
    console.log('zxc saved ;= ',db.get('zxc'));
    
    db.set('asd',{s:567,d:"DDDDDDDDDD"},()=>{
        console.log('asd saved');
    });
    
    db.set('qwe','QWE');
    
});

db.on('drain',()=>{
    console.log('Done!');
});

