import Vue from 'vue';
import { mount, shallow } from 'avoriaz';
import toHaveBeenWarnedInit from '@/test/util/to-have-been-warned';
import Vuetify from '@/components/Vuetify';
import { compileToFunctions } from 'vue-template-compiler';
export function test(name, cb) {
    toHaveBeenWarnedInit();
    Vuetify.install(Vue);
    /*
      const app = document.createElement('div')
      app.setAttribute('data-app', true)
      document.body.appendChild(app)
    */
    var runAllTimers = rafPolyfill(window);
    // Very naive polyfill for performance.now()
    window.performance = { now: function () { return (new Date()).getTime(); } };
    describe(name, function () {
        return cb({
            functionalContext: functionalContext,
            mount: function (component, options) {
                if (component.options) {
                    component = component.options;
                }
                return mount(component, options);
            },
            shallow: shallow,
            compileToFunctions: compileToFunctions,
            runAllTimers: runAllTimers
        });
    });
}
test.skip = describe.skip;
export function functionalContext(context, children) {
    if (context === void 0) {
        context = {};
    }
    if (children === void 0) {
        children = [];
    }
    if (!Array.isArray(children))
        children = [children];
    return {
        context: Object.assign({
            data: {},
            props: {}
        }, context),
        children: children
    };
}
//requestAnimationFrame polyfill | Milos Djakonovic ( @Miloshio ) | MIT | https://github.com/milosdjakonovic/requestAnimationFrame-polyfill
export function rafPolyfill(w) {
    /**
     *
     * How many times should polyfill call
     * update callback? By canon, it should
     * be 60 times per second, so that ideal
     * framerate 60fps could be reached.
     *
     * However, even native implementations
     * of requestAnimationFrame often cannot
     * do 60fps, but, unlike any polyfill,
     * they can synchronise achievable fps
     * rate with screen refresh rate.
     *
     * So, leave this value 1000/60 unless
     * you target specific browser on spec
     * ific device that is going to work
     * better with custom value. I think
     * that this is the longest comment I've
     * written on single variable so far.
    **/
    var FRAME_RATE_INTERVAL = 1000 / 60, 
    /**
     * All queued callbacks in given cycle.
    **/
    allCallbacks = [], executeAllScheduled = false, shouldCheckCancelRaf = false, 
    /**
     * Callbacks queued for cancellation.
    **/
    callbacksForCancellation = [], 
    /**
     * Should callback be cancelled?
     * @param cb - callback
    **/
    isToBeCancelled = function (cb) {
        for (var i = 0; i < callbacksForCancellation.length; i++) {
            if (callbacksForCancellation[i] === cb) {
                callbacksForCancellation.splice(i, 1);
                return true;
            }
        }
    }, 
    /**
     *
     * Executes all (surprise) callbacks in
     * and removes them from callback queue.
     *
    **/
    executeAll = function () {
        executeAllScheduled = false;
        var _allCallbacks = allCallbacks;
        allCallbacks = [];
        for (var i = 0; i < _allCallbacks.length; i++) {
            if (shouldCheckCancelRaf === true) {
                if (isToBeCancelled(_allCallbacks[i])) {
                    shouldCheckCancelRaf = false;
                    return;
                }
            }
            _allCallbacks[i].apply(w, [new Date().getTime()]);
        }
    }, 
    /**
     *
     * requestAnimationFrame polyfill
     * @param callback - callback to be queued & executed | executed
     * @return callback
     *
    **/
    raf = function (callback) {
        allCallbacks.push(callback);
        if (executeAllScheduled === false) {
            w.setTimeout(executeAll, FRAME_RATE_INTERVAL);
            executeAllScheduled = true;
        }
        return callback;
    }, 
    /**
     *
     * Cancels raf.
    **/
    cancelRaf = function (callback) {
        callbacksForCancellation.push(callback);
        shouldCheckCancelRaf = true;
    }, 
    //https://gist.github.com/paulirish/1579671
    vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
        w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
        w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame']
            || w[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!w.requestAnimationFrame)
        w.requestAnimationFrame = raf;
    if (!w.cancelAnimationFrame)
        w.cancelAnimationFrame = cancelRaf;
    // TODO remove requestAnimationFrame polyfill when jest will support it: https://github.com/facebook/jest/pull/7776
    function runAllTimers() {
        while (allCallbacks.length) {
            executeAll();
        }
    }
    return runAllTimers;
}
export function touch(element) {
    var createTrigger = function (eventName) {
        return function (clientX, clientY) {
            var touches = [{ clientX: clientX, clientY: clientY }];
            element.trigger(eventName, ({ touches: touches, changedTouches: touches }));
            return touch(element);
        };
    };
    return {
        start: createTrigger('touchstart'),
        move: createTrigger('touchmove'),
        end: createTrigger('touchend')
    };
}
export var resizeWindow = function (width, height) {
    if (width === void 0) {
        width = global.innerWidth;
    }
    if (height === void 0) {
        height = global.innerHeight;
    }
    global.innerWidth = width;
    global.innerHeight = height;
    global.dispatchEvent(new Event('resize'));
    return new Promise(function (resolve) { return setTimeout(resolve, 200); });
};
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map