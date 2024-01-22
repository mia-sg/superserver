import { error } from './utils';
/**
 * Datasource class for managing CRUD operations on a collection of records.
 * @class
 * @param {Object} p_options - Configuration options for the datasource.
 * @param {string} p_options.name - Name of the datasource.
 * @param {string} p_options.model_name - Name of the model on backend (Prisma model).
 * @param {string} p_options.base_url - Base URL for CRUD operations.
 * @param {Function} p_options.retrive - Function for retrieving records.
 * @param {Function} p_options.update - Function for updating records.
 * @param {Function} p_options.create - Function for creating records.
 * @param {Function} p_options.destroy - Function for destroying records.
 * @param {number} [p_options.per_page=50] - Number of records per page.
 * @param {Array} [p_options.fields=[]] - Array of fields for records.
 * @param {boolean} [p_options.allow_create=false] - Flag to allow record creation.
 * @param {boolean} [p_options.allow_update=false] - Flag to allow record updates.
 * @param {boolean} [p_options.allow_destroy=false] - Flag to allow record destruction.
 * @throws Will throw an error if CRUD URLs are not provided.
 */
class Datasource {
    #modelName;
    #vName;
    #vOptions;
    #perPage;
    #currentPage;
    store;
    #$currentIndex;
    #fields;
    #allowCreate;
    #allowUpdate;
    #allowDestroy;
    #subscriptions;
    #crudUrls;
    constructor(p_options) {
        /**
         * Name of the Prisma model.
         * @type {string}
         * @private
         */
        this.#modelName = p_options.model_name;

        /**
         * Name of the datasource.
         * @type {string}
         * @private
         */
        this.#vName = p_options.name;

        /**
         * Configuration options for the datasource.
         * @type {Object}
         * @private
         */
        this.#vOptions = p_options;

        /**
         * Number of records per page.
         * @type {number}
         * @private
         */
        this.#perPage = p_options.per_page || 50;

        /**
         * Current page number.
         * @type {number}
         * @private
         */
        this.#currentPage = -1;

        /**
         * Array to store records.
         * @type {Array}
         * @private
         */
        this.store = [];

        /**
         * Index of the current record.
         * @type {number}
         * @private
         */
        this.#$currentIndex = 0;

        /**
         * Array of fields for records.
         * @type {Array}
         * @private
         */
        this.#fields = p_options.fields || [];

        /**
         * Flag to allow record creation.
         * @type {boolean}
         * @private
         */
        this.#allowCreate = p_options.allow_create || false;

        /**
         * Flag to allow record updates.
         * @type {boolean}
         * @private
         */
        this.#allowUpdate = p_options.allow_update || false;

        /**
         * Flag to allow record destruction.
         * @type {boolean}
         * @private
         */
        this.#allowDestroy = p_options.allow_destroy || false;

        /**
         * Object to store event subscriptions.
         * @type {Object}
         * @private
         */
        this.#subscriptions = {
            "indexChanged": [],
            "dataRetrived": [],
            "recordAdded": [],
            "recordCreated": [],
            "recordDestroyed": [],
            "recordUpdated": []
        };

        /**
         * URLs for CRUD operations.
         * @type {Object}
         * @private
         */
        this.#crudUrls = {
            configUrl: `${p_options.base_url}/model/${this.#modelName}/config`,
            rowCountUrl: `${p_options.base_url}/model/${this.#modelName}/row_count`,
            createUrl: `${p_options.base_url}/model/${this.#modelName}/create`,
            retrieveUrl: `/model/${this.#modelName}/retrive`,
            updateUrl: `${p_options.base_url}/model/${this.#modelName}/update`,
            destroyUrl: `${p_options.base_url}/model/${this.#modelName}/destroy`,
        };
    }

    /**
     * Create a new record.
     * @param {Object} p_record - Record to be created.
     */
    create( p_record )
    {
        if( !this.#allowCreate ) return error(`Create a new record is not allowed.`);

        checkRecordCompatibilty( p_record );
        if( this.#vOptions.base_url ) {
            fetch( this.#crudUrls.createUrl ,{
                method:'POST',
                body: JSON.stringify( { model_name: this.#modelName , record: p_record } )
            })
            .then(res=>{
                res.json()
            })
            .then(data=>{
                add( data )
            })
            .catch(err=>{
                error( err );
            })
        }else{
            add( p_record );
        }
    }

    /**
     * Retrieve records.
     */
    retrive( p_page = false )
    {
        this.#currentPage = ( p_page ) ? p_page : this.#currentPage ;
        fetch(this.#crudUrls.retrieveUrl,{
            headers:{
                'Content-Type': 'application/json'
            },
            method:'POST',
            body: JSON.stringify( { take: this.#perPage, skip: this.#currentPage + 1  } )
        })
        .then(res=>{
            return res.json()
        })
        .then(result =>{
            result.rows.forEach(_r=>{
                this.#add( _r )
            });

            if( p_page ) {
                this.#currentPage = p_page;
            }
            
        })
        .catch(err=>{
            error( err );
        })
    }

    /**
     * Destroy a record.
     * @param {string} p_pk - Primary key of the record to be destroyed.
     */
    destroy(p_pk) {
        // Implementation...
    }

    /**
     * Update a record.
     * @param {string} p_pk - Primary key of the record to be updated.
     * @param {Object} p_values - Values to be updated.
     */
    update(p_pk, p_values) {
        // Implementation...
    }

    /**
     * Check compatibility of a record with defined fields.
     * @param {Object} pRecord - Record to be checked.
     * @private
     */
    #checkRecordCompatibilty( pRecord )
    {
        if( fields.length === 0 ) return error(1000, "No fields were set.");
        // Check data type
        let msgs = [];
        for( const[k,v] of Object.entries( pRecord ) ) {
            let f  = getFieldByName( k );
            if( !f ) {
                msgs.push(`Field ${k} does not exist.`);
                break;
            }
            if( f.data_type !== typeof v ) msgs.push(`The field ${k} must be of type ${ f.data_type } `);
        }
        if( msgs.length > 0 ) return error(1000, msgs );
    }

    /**
     * Set fields for records.
     * @param {Array} pFields - Array of fields to be set.
     * @private
     */
    #setFields( pFields )
    {
        pFields.forEach(function(_f){
            setField( _f );
        })
    }

    /**
     * Set a field for records.
     * @param {Object} pField - Field to be set.
     * @private
     */
    #setField( pField )
    {
        let f = fields.find(function(_f){ return _f.name === pField.name });
        if( f ) return error(10003, "Field allready exists.") ;
        if( !pField['name'] ) return error(10003, "The filed must have a name.") ;
        if( !pField['data_type'] ) return error(10003, "The field must have a data_type.") ;

        fields.push( pField );
    }

    /**
     * Add a record to the store.
     * @param {Object} pObject - Record to be added.
     * @private
     */
    #add( pObject )
    {
        let r = new ObservableObject( pObject, this );
        r.subscribe('keyChanged', this.#objKeyChanged );
        this.store.push( r );
        ///$currentIndex = store.length - 1;
        this.#notify('recordAdded', [r] );
        ///notify('indexChanged', [ $currentIndex ]);
    }

    /**
     * Get a field by name.
     * @param {string} pName - Name of the field.
     * @return {Object} - The field with the specified name.
     * @private
     */
    #getFieldByName( pName )
    {
        return fields.find(function(_f){ return _f.name === pName; })
    }

    /**
     * Check if the data type of a value is correct for a field.
     * @param {string} pKey - Key of the field.
     * @param {any} pValue - Value to be checked.
     * @return {boolean} - True if the data type is correct, false otherwise.
     * @private
     */
    #isDatatypeCorrect( pKey, pValue )
    {
        if( !getFieldByName( pKey ) ) return false;
        return getFieldByName( pKey ).data_type === typeof pValue;
    }

    /**
     * Subscribe to an event.
     * @param {string} pSubscription - Event to subscribe to.
     * @param {Function} pSubscriber - Subscriber function.
     */
    subscribe( pSubscription, pSubscriber )
    {
        if( subscriptions[ pSubscription ] ) {
            subscriptions[ pSubscription ].push( pSubscriber );
        }
    }

    /**
     * Notify subscribers of an event.
     * @param {string} pSubscription - Event to notify subscribers of.
     * @param {Array} pArgs - Arguments to pass to subscribers.
     * @private
     */
    #notify( pSubscription, pArgs )
    {
        if( this.#subscriptions[ pSubscription ] ) {
            this.#subscriptions[ pSubscription ].forEach(function( _sub ){
                _sub.apply(null, pArgs );
            })
        }
    }

    /**
     * Handle the event of a key being changed in a record.
     * @param {string} pKey - Key that changed.
     * @param {any} pOldval - Old value.
     * @param {any} pNewval - New value.
     * @private
     */
    #objKeyChanged( pKey, pOldval, pNewval)
    {
        notify( 'recordUpdated', [ $currentIndex, pKey, pOldval, pNewval ] );
    }

    /**
     * Change a value in the record based on DOM interaction.
     * @param {string} pKey - Key of the value to change.
     * @param {any} pValue - New value.
     * @param {Node} pNode - DOM node related to the change.
     * @private
     */
    #changeFromDom( pKey, pValue, pNode )
    {
        if( getCurrent( pKey ) ) {
            pNode.setAttribute('initiated-changing', pKey );
            getCurrent()[ pKey ] = pValue;
        }
    }

    /**
     * Get the current record or a specific property of it.
     * @param {string} [pKey] - Key of the property to retrieve.
     * @return {Object|any} - Current record or the value of a specific property.
     */
    getCurrent( pKey )
    {
        if( pKey ) return store[ $currentIndex ].hasOwnProperty( pKey ); 
        else return store[ $currentIndex ];
    }

    /**
     * Evaluate a condition based on the current record.
     * @param {string} pStmt - Condition statement.
     * @return {boolean} - Result of the evaluation.
     * @private
     */
    #evalIF( pStmt)
    {
        let current = store[ $currentIndex ];
        return eval( pStmt );
    }

    /**
     * Check if record creation is allowed.
     * @param {boolean} [pStatus] - New status for record creation.
     * @return {boolean} - Current status of record creation.
     * @private
     */
    #isCreateAllowed( pStatus )
    {
        if( pStatus && typeof pStatus === 'boolean' ) allowCreate = pStatus;
        return allowCreate;
    }

    /**
     * Check if record update is allowed.
     * @param {boolean} [pStatus] - New status for record update.
     * @return {boolean} - Current status of record update.
     * @private
     */
    #isUpdateAllowed( pStatus )
    {
        if( pStatus && typeof pStatus === 'boolean' ) this.#allowUpdate = pStatus;
        return this.#allowUpdate;
    }

    /**
     * Check if record destruction is allowed.
     * @param {boolean} [pStatus] - New status for record destruction.
     * @return {boolean} - Current status of record destruction.
     * @private
     */
    #isDestroyAllowed( pStatus )
    {
        if( pStatus && typeof pStatus === 'boolean' ) allowDestroy = pStatus;
        return allowDestroy;
    }

    /**
     * Get the data type of a field.
     * @param {string} pKey - Key of the field.
     * @return {string} - Data type of the field.
     * @private
     */
    #typeOf( pKey )
    {
        let f = getFieldByName( pKey );
        if( !f ) return error(1000, `No such field ${ pKey }`);
        return f.data_type;
    }
}



/**
 * @class
 * Creates an observable object with properties that can be subscribed to for changes.
 * @param {Object} obj - The object to be made observable.
 * @returns {Object} - An observable version of the input object.
 */
function ObservableObject(obj) {
    /**
     * @type {Map<string, Set<Function>>}
     * @description A map to store subscribers for each property of the observable object.
     * The keys are property names, and the values are sets of callback functions.
     */
    const subscribers = new Map();
  
    /**
     * Notifies subscribers of a property about its value change.
     * @param {string} prop - The name of the property that changed.
     * @param {*} newValue - The new value of the property.
     * @param {*} oldValue - The old value of the property.
     */
    const notifySubscribers = (prop, newValue, oldValue) => {
      if (subscribers.has(prop)) {
        subscribers.get(prop).forEach(callback => callback(newValue, oldValue));
      }
    };
  
    /**
     * The proxy handler for the observable object.
     */
    const handler = {
      /**
       * Handles property access, recursively creating observable objects for nested properties.
       * @param {Object} target - The target object.
       * @param {string} prop - The property name.
       * @param {Object} receiver - The proxy object.
       * @returns {*} - The value of the accessed property.
       */
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'object' && value !== null) {
          return observe(value); // recursively observe nested objects
        }
        return value;
      },
      /**
       * Handles property assignment, triggering notifications for subscribers.
       * @param {Object} target - The target object.
       * @param {string} prop - The property name.
       * @param {*} newValue - The new value to be assigned.
       * @param {Object} receiver - The proxy object.
       * @returns {boolean} - Returns true if the assignment was successful.
       */
      set(target, prop, newValue, receiver) {
        const oldValue = Reflect.get(target, prop, receiver);
        if (oldValue !== newValue) {
          Reflect.set(target, prop, newValue, receiver);
          notifySubscribers(prop, newValue, oldValue); // notify subscribers about the change
        }
        return true;
      },
    };
  
    /**
     * The observable object created using a Proxy with the defined handler.
     * @type {Object}
     */
    const observable = new Proxy(obj, handler);
  
    /**
     * Adds a callback function to the subscribers of a specific property.
     * @param {string} prop - The property name to subscribe to.
     * @param {Function} callback - The callback function to be executed on property changes.
     */
    observable.subscribe = (prop, callback) => {
      if (!subscribers.has(prop)) {
        subscribers.set(prop, new Set());
      }
      subscribers.get(prop).add(callback);
    };
  
    return observable;
}

export{
    Datasource,
    ObservableObject
}