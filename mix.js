(function (global){
    global.Mix = {
        //------------config----------
        nocache: false,
        path: {},
        synchronous: false,
        //----------private members---------
        _countModules: 0,
        _loadingCountModules: 0, //загруженные модули с зависимостями
        _loadingCountScripts: 0, //загруженные скрипты на клиента
        _modules: {},
        _loadingModules: {}, //загружаемые модули
        //----------public functions--------
        /**
         * загрузка модуля из аттрибута data-main
         */
        init: function (){
            var scripts = Mix.$('script'),
                mainModule = null;

            for (var i = 0, l = scripts.length; i < l; ++i) {
                var dataMain = scripts[i].getAttribute('data-main');

                if (dataMain != null) {
                    mainModule = dataMain === '' ? 'main' : dataMain;
                    break;
                }

            }

            if (mainModule)
                Mix.config({synchronous: true}).loadScript(mainModule, '');
        },
        namespace: function (namespaces){
            var ns = namespaces.split('.'),
                current = namespaces.length > 0 ? window[ns[0]] : window;

            if (current === undefined) {
                current = window[ns[0]] = {};
            }

            for (var i = 1; i < ns.length; ++i) {
                current = current[ns[i]] = current[ns[i]] || {};
            }
            return current;
        },
        getClassName: function (classPath){
            var path = classPath.split('.');
            return path[path.length - 1];
        },
        $: function (selector){
            return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
        },
        apply: function (o, c, defaults){
            // no "this" reference for friendly out of scope calls
            if (defaults) {
                Mix.apply(o, defaults);
            }
            if (o && c && typeof c == 'object') {
                for (var p in c) {
                    o[p] = c[p];
                }
            }
            return o;
        },
        config: function (config){
            return this.apply(this, config);
        },
        define: function (){
            var classPath = '',
                requires = [],
                config = {};
            //разбор аргументов. Если их 3 - classPath, requires, config
            //если 2 - classPath, config
            switch (arguments.length) {
                case 2:
                    classPath = arguments[0];
                    config = arguments[1];
                    break;
                case 3:
                    classPath = arguments[0];
                    requires = arguments[1] || [];
                    config = arguments[2];
                    break;
                default:
                    throw('Incorrect arguments');
            }

            var path = classPath.split('.');
            var className = path[path.length - 1];
            var classNamespace = this.namespace(path.slice(0, path.length - 1).join('.'));

            if (config.extend != undefined) {
                requires.push(config.extend);
                var pathParent = config.extend.split('.');
                var parentClassName = pathParent[pathParent.length - 1];
                var parentClassNamespace = this.namespace(pathParent.slice(0, pathParent.length - 1).join('.'));
            }

            Mix.module({
                name: classPath,
                requires: requires,
                body: function (){
                    var parent = parentClassNamespace && parentClassNamespace[parentClassName] || Mix.Class,
                        newClass = parent.create(config);

                    //добавляю статические функции
                    for (var f in config) {
                        if (!config.hasOwnProperty(f)) continue;
                        if (/static_/.test(f)) {
                            var funcName = f.substring(7);
                            newClass[funcName] = config[f];
                        }
                    }
                    classNamespace[className] = newClass;
                    console.log('class:', className);
                }
            });
        },
        module: function (config){
            config.loaded = false;

            if (!this._modules[config.name]) {
                this._countModules++;
            }
            this.apply(this._modules[config.name], config);

            if (!this._loadingModules[config.name]) {
                this._loadingCountModules++;
            }
            this.apply(this._loadingModules[config.name], config);

            //TODO: подписаться на событие onReady
            this.process();
        },
        getModuleConfig: function (moduleData){
            //TODO: отрефакторить!
            var config;

            function parseName(name){
                var parts = name.split(':');
                if (parts.length == 1) {
                    return {
                        name: name
                    };
                } else if (parts.length == 2) {
                    return {
                        pathName: parts[0],
                        name: parts[1]
                    }
                } else {
                    throw 'Module name is not correct!';
                }
            }

            if (typeof moduleData == "string") {

                config = this._modules[parseName(moduleData).name];
                if (!config) {
                    config = {
                        name: moduleData
                    };
                }
            } else if (typeof moduleData == "object") {
                config = this._modules[moduleData.name];
                if (!config) {
                    config = moduleData;
                }
            } else {
                throw ("Module data is not correct!");
            }

            this.apply(config, parseName(config.name));

            return config;
        },
        checkCircular: function (requiredFrom, moduleName, chain){
            chain = chain || [moduleName];
            if (requiredFrom) {
                chain.push(requiredFrom.name);
                if (requiredFrom.name == moduleName) {
                    throw  ('Unresolved (circular?) dependencies: ' + chain.join('->'));
                } else {
                    this.checkCircular(requiredFrom.requiredFrom, moduleName, chain);
                }
            }
        },
        loadModule: function (module, requiredFrom){
            if (module.loaded == true) return true;

            var load = true,
                requires = module.requires || [];

            for (var i = 0, l = requires.length; i < l; ++i) {
                var requireModule = this.getModuleConfig(requires[i]);
                if (!requireModule.requiredFrom)
                    requireModule.requiredFrom = module;

                this.checkCircular(module, requireModule.name);

                if (!requireModule.loaded) {
                    load = false;
                    this.loadModule(requireModule, module);
                }
            }

            if (load && !this._modules[module.name]) {
                load = false;
                this.loadScript(module.name, requiredFrom, module.pathName);
            }


            return (load && module.scriptLoaded);
        },
        process: function (){
            var moduleLoaded = false;
            for (var k in this._loadingModules) {
                if (!this._loadingModules.hasOwnProperty(k)) continue;
                var module = this._loadingModules[k];
                if (module.loaded) continue;

                module.loaded = this.loadModule(module, module.requiredFrom);
                if (module.loaded) {
                    moduleLoaded = true;
                    if (module.body) module.body();
                    this._loadingCountModules++;

                    this._loadingModules[module.name] = null;
                    delete this._loadingModules[module.name];

                    this.onProgress(this._countModules, this._loadingCountModules);
                }
            }

            //если загружен хоть один модуль - запускаю проверку повторно
            if (moduleLoaded) this.process();

        },
        onProgress: function (count, val){
//            if (count <= 0) return;
//            var p = val * 100 / count;
//            console.log('progress: ' + Math.round(p) + '%');//debug
        },
        loadScript: function (name, requiredFrom, pathName){
            var me = this,
                prefix = '';
            if (pathName) {
                if (!(prefix = this.path[pathName])) throw('Undefined path: ' + pathName);
                prefix += prefix.indexOf(prefix.length - 1) == '/' ? '' : '/';
            }
            var url = prefix + name.replace(/\./g, '/') + '.js' + (this.nocache ? '?nocache=' + new Date().getTime() : '');

            var config = {
                name: name,
                requiredFrom: requiredFrom,
                pathName: pathName,
                requires: [],
                loaded: false,
                scriptLoaded: false,
                body: null
            };
            if (!this._modules[name]) {
                this._countModules++;
                this._modules[name] = config;
            }

            if (!this._loadingModules[name]) {
                this._loadingModules[name] = config;
            }

            function onLoad(){
                me._modules[name].scriptLoaded = true;
                me._loadingModules[name].scriptLoaded = true;
                me._loadingCountScripts--;
                me.process();
            }


            this._loadingCountScripts++;
            if (this.synchronous) {
                this.injectScript(url, onLoad, function (){
                    throw ('Failed to load module/class ' + name + ' at ' + url + ' ' + 'required from ' + requiredFrom.name);
                }, this)
            } else {
                this.loadXHRScript(url, onLoad, function (){
                    throw ('Failed to load module/class ' + name + ' at ' + url + ' ' + 'required from ' + requiredFrom.name);
                }, this)
            }
        },
        loadXHRScript: function (url, onLoad, onError, scope){
            var isCrossOriginRestricted = false,
                fileName = url.split('/').pop(),
                xhr, status;

            if (typeof XMLHttpRequest !== 'undefined') {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }

            try {
                xhr.open('GET', url, false);
                xhr.send(null);
            } catch (e) {
                isCrossOriginRestricted = true;
            }

            status = (xhr.status === 1223) ? 204 : xhr.status;

            if (!isCrossOriginRestricted) {
                isCrossOriginRestricted = (status === 0);
            }

            if (isCrossOriginRestricted) {
                onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; It's likely that the file is either " +
                    "being loaded from a different domain or from the local file system whereby cross origin " +
                    "requests are not allowed due to security reasons. Use asynchronous loading with " +
                    "Ext.require instead.", this.synchronous);
            }
            else if (status >= 200 && status < 300) {
                // Firebug friendly, file names are still shown even though they're eval'ed code
                new Function(xhr.responseText + "\n//@ sourceURL=" + fileName)();

                onLoad.call(scope);
            }
            else {
                onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; please " +
                    "verify that the file exists. " +
                    "XHR status code: " + status, this.synchronous);
            }

            // Prevent potential IE memory leak
            xhr = null;

        },
        injectScript: function (url, onLoad, onError, scope){
            var script = document.createElement('script'),
                me = this,
                onLoadFn = function (){
                    me.cleanupScriptElement(script);
                    onLoad.call(scope);
                },
                onErrorFn = function (){
                    me.cleanupScriptElement(script);
                    onError.call(scope);
                };

            script.type = 'text/javascript';
            script.src = url;
            script.onload = onLoadFn;
            script.onerror = onErrorFn;
            script.onreadystatechange = function (){
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    onLoadFn();
                }
            };

            this.$('head')[0].appendChild(script);

            return script;
        },
        cleanupScriptElement: function (script){
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;
            return this;
        }
    };

    var initializing = false, fnTest = /xyz/.test(function (){
        xyz;
    }) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    Mix.Class = function (){
    };

    // Create a new Class that inherits from this class
    Mix.Class.create = function (prop){
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn){
                    return function (){
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class(){
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.create = arguments.callee;

        return Class;
    };

    Function.prototype.bind = function (scope){
        var _function = this;

        return function (){
            return _function.apply(scope, arguments);
        }
    };

    Mix.init();

})(this);