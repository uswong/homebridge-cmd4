"use strict";


// Settings, Globals and Constants
let settings = require( "../cmd4Settings" );
const constants = require( "../cmd4Constants" );


var _api = new HomebridgeAPI(); // object we feed to Plugins

// Init the library for all to use
let CMD4_ACC_TYPE_ENUM = ACC_DATA.init( _api.hap.Characteristic );
let CMD4_DEVICE_TYPE_ENUM = DEVICE_DATA.init( CMD4_ACC_TYPE_ENUM, _api.hap.Service, _api.hap.Characteristic, _api.hap.Categories );

var Cmd4Accessory = require( "../Cmd4Accessory" ).Cmd4Accessory;
let Cmd4Platform = require( "../Cmd4Platform" ).Cmd4Platform;
let Cmd4Storage = require( "../utils/Cmd4Storage" );

// Unfortunately this test never exits, because polling will start.
// Warn the user of such
// Note: Not true anymore as polling moved to Platform.
//function abort()
//{
//   console.log("Test of Cmd4Accessory requires CTRL-c as polling was backgrounded");
//   setTimeout( abort, 1800 );
//}
//setTimeout( ( ) => { abort(); }, 1800 );

// The State_cmd is called from $HOME
const home = require( "os" ).homedir();
// THIS IS WHAT SCREWS UP THE THE UNIT TEST CASES IN Cmd4AccessoryGetValues! !!!
//process.chdir( home );
//


// ******** QUICK TEST of SETUP *************
describe('Quick Test of Setup', ( ) =>
{
   // it('log should be a function', ( ) =>
   // {
   //    assert.isFunction( log, "log is not an function" );
   // });

   it('Plugin Characteristic should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Characteristic, "Characteristic is not an function" );
   });

   it('Plugin Accessory should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Accessory, "Accessory is not an function" );
   });
   it('Plugin Service should be a function', ( ) =>
   {
      assert.isFunction(_api.hap.Service, "_api.hap.Service is not an function" );
   });

   it( "CMD4_ACC_TYPE_ENUM.EOL =" + ACC_EOL, ( ) =>
   {
     expect( CMD4_ACC_TYPE_ENUM.EOL ).to.equal( ACC_EOL );
   });

   it( "CMD4_DEVICE_TYPE_ENUM.EOL =" + DEVICE_EOL, ( ) =>
  {
     expect( CMD4_DEVICE_TYPE_ENUM.EOL ).to.equal( DEVICE_EOL );
  });
});

// ******** TEST Cmd4Accessory *************
describe('A simple Cmd4Accessory Test', ( ) =>
{
   let config =
   {
      name:                            "Test Switch",
      type:                            "Switch",
      on:                               false
   };

   it( "Test can create an instance of Cmd4Accessory", ( ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );

      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory." );

   });
});

describe('A simple Cmd4Accessory Test Debbuging enabled', ( ) =>
{
   let config =
   {
      name:                            "Test Switch",
      type:                            "Switch",
      on:                               false
   };

   it( "Test can create an instance of Cmd4Accessory with Debug Enabled", ( ) =>
   {
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( );

      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory." );


   });
});


describe('Test Cmd4Accessory variables ', ( ) =>
{
   let config =
   {
      name:                            "Test Switch",
      type:                            "Switch",
      on:                               false
   };

   it( "Test typeIndex of a Switch set correctly ", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let parentInfo = undefined;
      let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

      assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory." );

      assert.equal( accessory.typeIndex , CMD4_DEVICE_TYPE_ENUM.Switch, "Expected typeIndex: %s Found: %s" , CMD4_DEVICE_TYPE_ENUM.Switch, accessory.typeIndex );
   });

   let parentInfo = undefined;
   for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
   {
      // Cannot create an accessory information of an accessory information
      if ( index == CMD4_DEVICE_TYPE_ENUM.AccessoryInformation )
      {
         continue;
      }

      it( "Test typeIndex of all possible devices ", ( ) =>
      {

         config.name = "MY_" + CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;
         config.type = CMD4_DEVICE_TYPE_ENUM.properties[index].deviceName;


         let log = new Logger( );
         log.setOutputEnabled( false );
         log.setBufferEnabled( );
         let accessory = new Cmd4Accessory( log, config, _api, [ ], parentInfo );

         assert.instanceOf( accessory , Cmd4Accessory, "Expected accessory to be instance of Cmd4Accessory." );

         assert.equal( accessory.typeIndex , index, "Expected typeIndex: %s for: %s. Found: %s" , index, config.type, accessory.typeIndex );

      });
   }
});

describe('Cmd4Accessory Test get/test/set storedValues', ( ) =>
{
   let config =
   {
      name:                            "Test Switch",
      type:                            "Switch",
      on:                               false
   };

   it( "Check that STORED_DATA_ARRAY is created", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.isArray( accessory.STORED_DATA_ARRAY, "Expected accessory.STORED_DATA_ARRAY to be an Array. Found %s" , typeof accessory.STORED_DATA_ARRAY );

   });

   it( "Check that Array STORED_DATA_ARRAY.cmd4Storage is created", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      console.log("Accessory.STORED_DATA_ARRAY[0] is %s", accessory.STORED_DATA_ARRAY[0]);
      assert.instanceOf( accessory.STORED_DATA_ARRAY[0].cmd4Storage, Cmd4Storage, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be an instance of Cmd4Storage. Found %s" , typeof accessory.STORED_DATA_ARRAY[0].cmd4Storage );

   });

   it( "Check that cmd4Storage Array size is:  " + ACC_EOL, ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( Object.keys(accessory.STORED_DATA_ARRAY[0].cmd4Storage.DATA).length, ACC_EOL, "Expected cmd4Storage to size: %s. Found %s" , ACC_EOL, Object.keys(accessory.STORED_DATA_ARRAY[0].cmd4Storage.DATA).length );

   });

   it( "Check that cmd4Storage is set correctly for a switch", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ index ].type;

         let value = STORED_DATA_ARRAY[0].cmd4Storage.DATA[ characteristicString ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage[%s] is: Null. Found %s" , index, value );
      }

   });

   it( "Check that setStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ index ].type;
         let value = STORED_DATA_ARRAY[0].cmd4Storage.DATA[ characteristicString ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage[%s] is: Null. Found %s" , index, value );
      }

   });

   it( "Check setStoredValueForIndex throws error with accTypeEnumIndex < 0", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      expect ( ( ) => accessory.cmd4Storage.setStoredValueForIndex( -1, 0 ) ).to.throw(/setStoredValue - Characteristic index: -1 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( "Check setStoredValueForIndex throws error with accTypeEnumIndex >= EOL", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      expect ( ( ) => accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.EOL, 0 ) ).to.throw(/setStoredValue - Characteristic index: 223 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( "Check getStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let characteristicString = CMD4_ACC_TYPE_ENUM.properties[ index ].type;
         let value = STORED_DATA_ARRAY[0].cmd4Storage.DATA[ characteristicString ];
         if ( index == accIndex )
            assert.isFalse( value, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage[%s] is: Null. Found %s" , index, value );
      }
      let result = accessory.cmd4Storage.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On );
      assert.equal( result, config.On, "Expected getStoredValueForIndex to return: %s. Found %s" , config.On, result );

   });

   it( "Check getStoredValueForIndex throws error with accTypeEnumIndex < 0", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      expect ( ( ) => accessory.cmd4Storage.getStoredValueForIndex( -1 ) ).to.throw(/getStoredValue - Characteristic index: -1 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( "Check getStoredValueForIndex throws error with accTypeEnumIndex >= EOL", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      expect ( ( ) => accessory.cmd4Storage.getStoredValueForIndex( CMD4_ACC_TYPE_ENUM.EOL ) ).to.throw(/getStoredValue - Characteristic index: 223 not between 0 and 223\nCheck your config.json file for unknown characteristic./);

   });

   it( "Check testStoredValueForIndex works correctly for a switch", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let accIndex = CMD4_ACC_TYPE_ENUM.On;

      config.On = true;
      accessory.cmd4Storage.setStoredValueForIndex( CMD4_ACC_TYPE_ENUM.On, config.On );
      for ( let index=0; index < CMD4_DEVICE_TYPE_ENUM.EOL; index ++)
      {
         let value = accessory.cmd4Storage.testStoredValueForIndex( index );
         if ( index == accIndex )
            assert.equal( value, config.On, "Expected accessory.testStoredValueForIndex[%s] is: %s. Found %s" , index, config.On, value );
         else
            assert.isNull( value, "Expected accessory.cmd4Storage.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );
      }

   });

   it( "Check testStoredValueForIndex limits returns undefined", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      let index = -1;

      let value = accessory.cmd4Storage.testStoredValueForIndex( index );
      assert.isUndefined( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );

      index = ACC_EOL + 1;
      value = accessory.cmd4Storage.testStoredValueForIndex( index );
      assert.isUndefined( value, "Expected accessory.testStoredValueForIndex[%s] is: Null. Found %s" , index, value );

   });

   it( "Check that Array STORED_DATA_ARRAY.cmd4Storage is created", ( ) =>
   {
      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.instanceOf( accessory.STORED_DATA_ARRAY[0].cmd4Storage, Cmd4Storage, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be an instance of Cmd4Storage. Found %s" , typeof accessory.STORED_DATA_ARRAY[0].cmd4Storage );

   });

});

describe('Cmd4Accessory Test parseConfig', ( ) =>
{
   it( "Check that invalid category throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         category:                        "Bad"
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Category specified: "Bad" is not a valid homebridge category for: "Test Switch"./);
   });

   it( "Check that queue is already defined before use throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         queue:                            "A"
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/"QueueType" must be defined first for queue "A" in: "Test Switch"/);
   });

   it( "Check that type is defined for an accessory  throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/No device type given in: "Test Switch"/);
   });

   it( "Check that unknown type is defined for an accessory  throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Sink",
         on:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Unknown device type: "Sink" given in: "Test Switch"./);
   });

   it( "Check that empty state_cmd for an accessory  throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                          true,
         state_cmd:                       false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/No state_cmd for: "Test Switch"./);
   });

   it( "Check that invalid state_cmd for an accessory  throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                          true,
         state_cmd:                       "/tmp/noFile"
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/The file: "\/tmp\/noFile" does not exist, It is highly likely the state_cmd will fail. Hint: Do not use wildcards that would normally be expanded by a shell./);
   });

   it( "Check that invalid characteristic for an accessory  throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         XOn:                               false
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/OOPS: "XOn" not found for parsing characteristics in: "Test Switch"./);
   });

   it( "Check that invalid polling type (string throws an error", ( ) =>
   {
      let config =
      {
         name:                   "Test Switch",
         type:                   "Switch",
         on:                     false,
         polling:                "yes",
         state_cmd:              `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( true );
      log.setOutputEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Unknown type for Polling "yes" given in: "Test Switch"./);
   });

   it( "Check that invalid polling characteristic for an accessory  throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ characteristic: "XOn"}],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/No such polling characteristic: "XOn" for: "Test Switch"./);
   });

   it( "Check that polling characteristic is also defined throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ characteristic: "Active"}],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Polling for: "Active" requested, but characteristic is not in your config.json file for: "Test Switch"./);
   });

   it( "Check that polling characteristic is invalid throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ "XOn": 15 }],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/OOPS: "XOn" not found while parsing for characteristic polling. There something wrong with your config.json file?/);
   });

   it( "Check that no polling characteristic defined throws an error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         [{ interval: 15 }],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setOutputEnabled( false );
      log.setBufferEnabled( true );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/No characteristic found while parsing for characteristic polling of: "Test Switch". There something wrong with your config.json file?/);
   });

   it( "Check that Constant definitions work", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants: {
                  "${psk}": "123456",
                  "${ipaddress}": "12Aa34bbcc",
                  "${port}": "8091"
              },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( "Check that Constant key starts with ${ works or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants:                     { "{psk}": "123456", },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Constant definition for: "{psk}" must start with "\${" for clarity./);

   });

   it( "Check that Constant key ends with } works or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants:                     { "${psk": "123456", },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Constant definition for: "\${psk" must end with "}" for clarity./);

   });

   it( "Check that Constant is an array/list or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         constants:                     "${psk}:1",
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Constants must be an array of\/or list of key\/value pairs: "\${psk}:1"./);

   });

   it( "Check that variable definitions work", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables: {
                  "${psk}": "123456",
                  "${ipaddress}": "12Aa34bbcc",
                  "${port}": "8091"
              },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( "Check that variable key starts with ${ works or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables:                     { "{psk}": "123456", },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Variable definition for: "{psk}" must start with "\${" for clarity./);

   });

   it( "Check that variable key ends with } works or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables:                     { "${psk": "123456", },
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Variable definition for: "\${psk" must end with "}" for clarity./);

   });

   it( "Check that Variables is an array/list or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         variables:                     "${psk}:1",
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Variables must be an array of\/or list of key\/value pairs: "\${psk}:1"./);

   });

   it( "Check that url definitions work", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         url:                         "http:blah",
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( "Check that url is a string or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         url:                             15,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/url must be a string: "15"./);

   });

   it( "Check that requires definitions work", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         requires:                      [{"${bravia}": "http"}],
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unxexpected stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unxexpected stderr: ${ log.errBuf }` );
   });

   it( "Check that requires is aarray  or throws error", ( ) =>
   {
      let config =
      {
         name:                            "Test Switch",
         type:                            "Switch",
         on:                               false,
         polling:                         true,
         requires:                             15,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );

      let STORED_DATA_ARRAY = [ ];

      expect ( ( ) => new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY ) ).to.throw(/Requires must be an array of\/or list of key\/value pairs: "15"./);

   });

});
describe('Cmd4Accessory Test determineCharacteristicsToPollOfAccessoryAndItsChildren', ( ) =>
{
   afterEach( function( )
   {
      settings.listOfCreatedPriorityQueues = { };
   });
   afterEach( function( )
   {
      // Clear any timers created for any polling queue
      Object.keys(settings.listOfCreatedPriorityQueues).forEach( (queueName) =>
      {
         let queue = settings.listOfCreatedPriorityQueues[ queueName ];
         Object.keys(queue.listOfRunningPolls).forEach( (key) =>
         {
            let timer = queue.listOfRunningPolls[ key ];
            clearTimeout( timer );
         });

         clearTimeout( queue.pauseTimer );
      });

      // Put back the polling queues
      settings.listOfCreatedPriorityQueues = { };
   });

   it( "Check that cmd4Storage gets created", function( done )
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`,
         interval:                      10,                // seconds
         stateChangeResponseTime:       1,                 // seconds
         timeout:                       6000,              // msec
         polling:                       true
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.instanceOf( accessory.STORED_DATA_ARRAY[0].cmd4Storage, Cmd4Storage, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to be an instance of Cmd4Storage. Found %s" , typeof accessory.STORED_DATA_ARRAY[0].cmd4Storage );

      done( );
   });

   it( "Check that storedValuesPer Array size is:  " + ACC_EOL, ( ) =>
   {
      let config =
      {
         name:                         "Test Switch",
         type:                         "Switch",
         on:                            false,
         state_cmd:                    `node ${ home }/.homebridge/Cmd4Scripts/State.js`,
         interval:                      10,                // seconds
         stateChangeResponseTime:       1,                 // seconds
         timeout:                       6000,              // msec
         polling:                       true
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let STORED_DATA_ARRAY = [ ];
      let accessory = new Cmd4Accessory( log, config, _api, STORED_DATA_ARRAY );

      assert.equal( Object.keys(accessory.STORED_DATA_ARRAY[0].cmd4Storage.DATA).length, ACC_EOL, "Expected accessory.STORED_DATA_ARRAY[0].cmd4Storage to size: %s. Found %s" , ACC_EOL, Object.keys(accessory.STORED_DATA_ARRAY[0].cmd4Storage.DATA).length );

   });

   it('Polling complains related polling characteristic is missing', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            name:                      "My_Door",
            displayName:               "My_Door",
            statusMsg:                 true,
            type:                      "Door",
            currentPosition:            0,
            targetPosition:             0,
            positionState:              0,
            Polling:                   [ { "characteristic": "CurrentPosition" },
                                         { "characteristic": "PositionState" } ],
            state_cmd:    "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      }

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      this.config = platformConfig.accessories;
      cmd4Platform.discoverDevices( );

      assert.include( log.errBuf, `[33mWarning, With polling for "CurrentPosition" requested, you also must do polling of "TargetPosition" or things will not function properly` , `expected stderr: ${ log.errBuf }` );

      done( );
   });

   it( "Test Polling generates log.if related characteristic not polled also", function( )
   {
      let thermostatConfig =
      {
         type:                         "Thermostat",
         name:                         "Thermostat",
         displayName:                  "Thermostat",
         temperatureDisplayUnits:      "CELSIUS",
         active:                       "Inactive",
         currentTemperature:            20.0,
         targetTemperature:             20.0,
         currentHeatingCoolingState:    0,
         targetHeatingCoolingState:     0,
         polling:                      [{characteristic: "CurrentTemperature", interval: 60, timeout:2000}],
         state_cmd:                    "./test/echoScripts/echo_quoted0"
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );


      let parentInfo = { };
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.equal( log.logBuf, "", ` Cmd4Accessory Unexpected stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With polling for "CurrentTemperature" requested, you also must do polling of "TargetTemperature" or things will not function properly`, ` Cmd4Accessory Incorrect stderr: ${ log.errBuf }` );

   });

   it( "Test Polling generates log for linked accessory if related characteristic not polled also", function( )
   {
      let thermostatConfig =
      {
         type:                         "Thermostat",
         name:                         "Thermostat",
         displayName:                  "Thermostat",
         temperatureDisplayUnits:      "CELSIUS",
         active:                       "Inactive",
         currentTemperature:            20.0,
         targetTemperature:             20.0,
         linkedTypes:
         {
            type:                      "Thermostat",
            name:                      "Linked_Thermostat",
            displayName:               "Linked_Thermostat",
            temperatureDisplayUnits:   "CELSIUS",
            active:                    "Inactive",
            currentTemperature:         20.0,
            targetTemperature:          20.0,
            currentHeatingCoolingState: 0,
            targetHeatingCoolingState:  0,
            polling:                   [{characteristic: "CurrentTemperature", interval: 60, timeout:2000}],
            state_cmd:                   "./test/echoScripts/echo_quoted0"
         },
         currentHeatingCoolingState:   0,
         targetHeatingCoolingState:    0,
         polling:                     [{characteristic: "CurrentTemperature",
                                        interval: 60,
                                        timeout:  2000},
                                       {characteristic: "TargetTemperature",
                                         interval: 60,
                                         timeout:  2000}],
         State_cmd:                     "./test/echoScripts/echo_quoted0"
      };
      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( false );


      let parentInfo={ "CMD4": constants.PLATFORM, "LEVEL": -1 };
      new Cmd4Accessory( log, thermostatConfig, _api, [ ], parentInfo );

      assert.include( log.logBuf, `Creating linked accessories for: Thermostat`, ` Cmd4Accessory output expected. received: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With polling for "CurrentTemperature" requested, you also must do polling of "TargetTemperature" or things will not function properly`, ` Cmd4Accessory Incorrect stderr:: ${ log.errBuf }` );

   });

   it( "Test Polling generates log for Added accessory if related characteristic not polled also", function( )
   {
      let platformConfig=
      {
         type:                         "Thermostat",
         name:                         "Thermostat",
         displayName:                  "Thermostat",
         temperatureDisplayUnits:      "CELSIUS",
         active:                       "Inactive",
         currentTemperature:            20.0,
         targetTemperature:             20.0,
         currentHeatingCoolingState:    0,
         targetHeatingCoolingState:     0,
         polling:                      [{ characteristic:   "CurrentTemperature" },
                                        { characteristic:   "TargetTemperature" } ],
         state_cmd:                      "./test/echoScripts/echo_quoted0",
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                  true,
            type:                      "GarageDoorOpener",
            displayName:               "StandaloneDoorOpener",
            name:                      "StandaloneDoorOpener",
            currentDoorState:          "CLOSED",
            targetDoorState:           "CLOSED",
            obstructionDetected:       "1",
            polling:                   [ { characteristic: "CurrentDoorState" },
                                      // { characteristic: "TargetDoorState" },
                                         { characteristic: "ObstructionDetected" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );

      assert.include( log.errBuf, `[33mWarning, With polling for "CurrentDoorState" requested, you also must do polling of "TargetDoorState" or things will not function properly`, ` Cmd4Accessory Incorrect stderr:: ${ log.errBuf }` );

   });


   it( "Test Polling generates log for Standalone accessory if related characteristic not polled also", function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                  true,
            type:                      "GarageDoorOpener",
            displayName:               "StandaloneDoorOpener",
            name:                      "StandaloneDoorOpener",
            currentDoorState:          "CLOSED",
            targetDoorState:           "CLOSED",
            obstructionDetected:       "1",
            polling:                   [ { characteristic: "CurrentDoorState" },
                                      // { characteristic: "TargetDoorState" },
                                         { characteristic: "ObstructionDetected" }
                     ],
            state_cmd:                   "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }],
         platforms: [
         {
            platform:                  "Cmd4",
            outputConstants:            false,
            restartRecover:            true,
            accessories: [
            {
               type:                        "Thermostat",
               name:                        "Thermostat",
               displayName:                 "Thermostat",
               temperatureDisplayUnits:     "CELSIUS",
               active:                      "Inactive",
               currentTemperature:           20.0,
               targetTemperature:            20.0,
               currentHeatingCoolingState:   0,
               targetHeatingCoolingState:    0,
               polling:                      [{ characteristic: "CurrentTemperature" },
                                              { characteristic: "TargetTemperature" }],
               state_cmd:                    "./test/echoScripts/echo_quoted0"
           }]
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.errBuf, `[33mWarning, With polling for "CurrentDoorState" requested, you also must do polling of "TargetDoorState" or things will not function properly`, ` Cmd4Accessory Incorrect stderr: ${ log.errBuf }` );

   });

   it( `Test that adding Target message is generated for related characteristics `, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                 true,
            type:                      "GarageDoorOpener",
            displayName:               "StandaloneDoorOpener",
            name:                      "StandaloneDoorOpener",
            currentDoorState:          "CLOSED",
            targetDoorState:           "CLOSED",
            obstructionDetected:       "1",
            polling:                   [ { characteristic: "CurrentDoorState" },
                                         { characteristic: "TargetDoorState" },
                                         { characteristic: "ObstructionDetected" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: StandaloneDoorOpener`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for StandaloneDoorOpener characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for StandaloneDoorOpener characteristic: TargetDoorState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for StandaloneDoorOpener characteristic: TargetDoorState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for StandaloneDoorOpener characteristic: CurrentDoorState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for StandaloneDoorOpener characteristic: ObstructionDetected`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

   });

   it( `Test that adding Target message is *NOT* generated for related characteristic TemperatureSensors`, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            accessory:                 "Cmd4",
            statusMsg:                  true,
            type:                      "TemperatureSensor",
            displayName:               "TemperatureSensor",
            name:                      "TemperatureSensor",
            currentTemperature:        "22.2",
            polling:                   [ { characteristic: "CurrentTemperature" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );


      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: TemperatureSensor`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for TemperatureSensor characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for TemperatureSensor characteristic: CurrentTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.notInclude( log.logBuf, `[33mAdding prioritySetValue for TemperatureSensor characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

   });


   it( `Test that adding "queued" Target message is generated for related characteristics`, function( )
   {
      let platformConfig =
      {
         accessories: [
         {
            type:                        "Thermostat",
            name:                        "Thermostat",
            displayName:                 "Thermostat",
            temperatureDisplayUnits:     "CELSIUS",
            currentTemperature:           20.0,
            targetTemperature:            20.0,
            currentHeatingCoolingState:   0,
            targetHeatingCoolingState:    0,
            queueTypes:                  [{ queue: "A", queueType: "WoRm" }],
            queue:                       "A",
            polling:                     [{ characteristic: "CurrentTemperature" },
                                          { characteristic: "TargetTemperature" },
                                          { characteristic: "CurrentHeatingCoolingState" },
                                          { characteristic: "TargetHeatingCoolingState" } ],
            state_cmd:                   "./test/echoScripts/echo_quoted0"
        }]
      };

      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );


      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      expect( cmd4Platform ).to.be.a.instanceOf( Cmd4Platform, "cmd4Platform is not an instance of Cmd4Platform" );

      cmd4Platform.discoverDevices( );



      assert.include( log.logBuf, `[34mCreating Platform Accessory type for : Thermostat`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCharacteristic polling for: Thermostat`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[90mCreated platformAccessory: Thermostat`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding getCachedValue for Thermostat characteristic: Name`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for Thermostat characteristic: TargetTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: CurrentTemperature`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: TargetHeatingCoolingState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding prioritySetValue for Thermostat characteristic: TargetHeatingCoolingState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.include( log.logBuf, `[33mAdding priorityGetValue for Thermostat characteristic: CurrentHeatingCoolingState`, ` Cmd4Accessory Incorrect stdout: ${ log.logBuf }` );
      assert.equal( log.errBuf, "", ` Cmd4Accessory Unexpected stderr: ${ log.errBuf }` );

   });
});


describe('Test Cmd4Accessory change characteristic Props', ( ) =>
{
   it('Test successful change Props definition ', ( done ) =>
   {
      let platformConfig =
      {
         accessories: [
         {
            type:                            "TemperatureSensor",
            displayName:                     "My_TemperatureSensor",
            name:                            "My_TemperatureSensor",
            currentTemperature:               25,
            statusFault:                     "NO_FAULT",
            props: { CurrentTemperature: { maxValue: 100,
                                           minValue: -100,
                                           minStep: 0.1
                                         }
                   },
            polling:                         [ { characteristic: "CurrentTemperature" } ],
            state_cmd:                 "node ./Extras/Cmd4Scripts/Examples/AnyDevice"
         } ]
      };


      let log = new Logger( );
      log.setBufferEnabled( );
      log.setOutputEnabled( false );
      log.setDebugEnabled( true );

      let cmd4Platform = new Cmd4Platform( log, platformConfig, _api );

      cmd4Platform.discoverDevices( );

      assert.equal( cmd4Platform.createdCmd4Accessories.length, 1, ` Cmd4Platform did not create the cmd4Accessory` );

      let cmd4Accessory = cmd4Platform.createdCmd4Accessories[0];
      assert.instanceOf( cmd4Accessory , Cmd4Accessory, "Expected cmd4Accessory to be instance of Cmd4Accessory." );

      assert.include( log.logBuf, `[90mOverriding characteristic CurrentTemperature props for: My_TemperatureSensor`, `Incorrect stdout: ${ log.logBuf }` );

      done( );
   });
});
