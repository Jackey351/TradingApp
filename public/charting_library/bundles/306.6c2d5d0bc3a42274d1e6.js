'use strict';
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [306, 8115],
  {
    59255: (t, e, n) => {
      (n.r(e), n.d(e, { default: () => S }));
      var r = (function () {
          if ('undefined' != typeof Map) return Map;
          function t(t, e) {
            var n = -1;
            return (
              t.some(function (t, r) {
                return t[0] === e && ((n = r), !0);
              }),
              n
            );
          }
          return (function () {
            function e() {
              this.__entries__ = [];
            }
            return (
              Object.defineProperty(e.prototype, 'size', {
                get: function () {
                  return this.__entries__.length;
                },
                enumerable: !0,
                configurable: !0,
              }),
              (e.prototype.get = function (e) {
                var n = t(this.__entries__, e),
                  r = this.__entries__[n];
                return r && r[1];
              }),
              (e.prototype.set = function (e, n) {
                var r = t(this.__entries__, e);
                ~r
                  ? (this.__entries__[r][1] = n)
                  : this.__entries__.push([e, n]);
              }),
              (e.prototype.delete = function (e) {
                var n = this.__entries__,
                  r = t(n, e);
                ~r && n.splice(r, 1);
              }),
              (e.prototype.has = function (e) {
                return !!~t(this.__entries__, e);
              }),
              (e.prototype.clear = function () {
                this.__entries__.splice(0);
              }),
              (e.prototype.forEach = function (t, e) {
                void 0 === e && (e = null);
                for (var n = 0, r = this.__entries__; n < r.length; n++) {
                  var o = r[n];
                  t.call(e, o[1], o[0]);
                }
              }),
              e
            );
          })();
        })(),
        o =
          'undefined' != typeof window &&
          'undefined' != typeof document &&
          window.document === document,
        i =
          void 0 !== n.g && n.g.Math === Math
            ? n.g
            : 'undefined' != typeof self && self.Math === Math
              ? self
              : 'undefined' != typeof window && window.Math === Math
                ? window
                : Function('return this')(),
        u =
          'function' == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(i)
            : function (t) {
                return setTimeout(function () {
                  return t(Date.now());
                }, 1e3 / 60);
              };
      var s = [
          'top',
          'right',
          'bottom',
          'left',
          'width',
          'height',
          'size',
          'weight',
        ],
        c = 'undefined' != typeof MutationObserver,
        a = (function () {
          function t() {
            ((this.connected_ = !1),
              (this.mutationEventsAdded_ = !1),
              (this.mutationsObserver_ = null),
              (this.observers_ = []),
              (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
              (this.refresh = (function (t, e) {
                var n = !1,
                  r = !1,
                  o = 0;
                function i() {
                  (n && ((n = !1), t()), r && c());
                }
                function s() {
                  u(i);
                }
                function c() {
                  var t = Date.now();
                  if (n) {
                    if (t - o < 2) return;
                    r = !0;
                  } else ((n = !0), (r = !1), setTimeout(s, e));
                  o = t;
                }
                return c;
              })(this.refresh.bind(this), 20)));
          }
          return (
            (t.prototype.addObserver = function (t) {
              (~this.observers_.indexOf(t) || this.observers_.push(t),
                this.connected_ || this.connect_());
            }),
            (t.prototype.removeObserver = function (t) {
              var e = this.observers_,
                n = e.indexOf(t);
              (~n && e.splice(n, 1),
                !e.length && this.connected_ && this.disconnect_());
            }),
            (t.prototype.refresh = function () {
              this.updateObservers_() && this.refresh();
            }),
            (t.prototype.updateObservers_ = function () {
              var t = this.observers_.filter(function (t) {
                return (t.gatherActive(), t.hasActive());
              });
              return (
                t.forEach(function (t) {
                  return t.broadcastActive();
                }),
                t.length > 0
              );
            }),
            (t.prototype.connect_ = function () {
              o &&
                !this.connected_ &&
                (document.addEventListener(
                  'transitionend',
                  this.onTransitionEnd_
                ),
                window.addEventListener('resize', this.refresh),
                c
                  ? ((this.mutationsObserver_ = new MutationObserver(
                      this.refresh
                    )),
                    this.mutationsObserver_.observe(document, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0,
                    }))
                  : (document.addEventListener(
                      'DOMSubtreeModified',
                      this.refresh
                    ),
                    (this.mutationEventsAdded_ = !0)),
                (this.connected_ = !0));
            }),
            (t.prototype.disconnect_ = function () {
              o &&
                this.connected_ &&
                (document.removeEventListener(
                  'transitionend',
                  this.onTransitionEnd_
                ),
                window.removeEventListener('resize', this.refresh),
                this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
                this.mutationEventsAdded_ &&
                  document.removeEventListener(
                    'DOMSubtreeModified',
                    this.refresh
                  ),
                (this.mutationsObserver_ = null),
                (this.mutationEventsAdded_ = !1),
                (this.connected_ = !1));
            }),
            (t.prototype.onTransitionEnd_ = function (t) {
              var e = t.propertyName,
                n = void 0 === e ? '' : e;
              s.some(function (t) {
                return !!~n.indexOf(t);
              }) && this.refresh();
            }),
            (t.getInstance = function () {
              return (
                this.instance_ || (this.instance_ = new t()),
                this.instance_
              );
            }),
            (t.instance_ = null),
            t
          );
        })(),
        f = function (t, e) {
          for (var n = 0, r = Object.keys(e); n < r.length; n++) {
            var o = r[n];
            Object.defineProperty(t, o, {
              value: e[o],
              enumerable: !1,
              writable: !1,
              configurable: !0,
            });
          }
          return t;
        },
        l = function (t) {
          return (t && t.ownerDocument && t.ownerDocument.defaultView) || i;
        },
        h = b(0, 0, 0, 0);
      function p(t) {
        return parseFloat(t) || 0;
      }
      function d(t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return e.reduce(function (e, n) {
          return e + p(t['border-' + n + '-width']);
        }, 0);
      }
      function v(t) {
        var e = t.clientWidth,
          n = t.clientHeight;
        if (!e && !n) return h;
        var r = l(t).getComputedStyle(t),
          o = (function (t) {
            for (
              var e = {}, n = 0, r = ['top', 'right', 'bottom', 'left'];
              n < r.length;
              n++
            ) {
              var o = r[n],
                i = t['padding-' + o];
              e[o] = p(i);
            }
            return e;
          })(r),
          i = o.left + o.right,
          u = o.top + o.bottom,
          s = p(r.width),
          c = p(r.height);
        if (
          ('border-box' === r.boxSizing &&
            (Math.round(s + i) !== e && (s -= d(r, 'left', 'right') + i),
            Math.round(c + u) !== n && (c -= d(r, 'top', 'bottom') + u)),
          !(function (t) {
            return t === l(t).document.documentElement;
          })(t))
        ) {
          var a = Math.round(s + i) - e,
            f = Math.round(c + u) - n;
          (1 !== Math.abs(a) && (s -= a), 1 !== Math.abs(f) && (c -= f));
        }
        return b(o.left, o.top, s, c);
      }
      var _ =
        'undefined' != typeof SVGGraphicsElement
          ? function (t) {
              return t instanceof l(t).SVGGraphicsElement;
            }
          : function (t) {
              return (
                t instanceof l(t).SVGElement && 'function' == typeof t.getBBox
              );
            };
      function y(t) {
        return o
          ? _(t)
            ? (function (t) {
                var e = t.getBBox();
                return b(0, 0, e.width, e.height);
              })(t)
            : v(t)
          : h;
      }
      function b(t, e, n, r) {
        return { x: t, y: e, width: n, height: r };
      }
      var m = (function () {
          function t(t) {
            ((this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = b(0, 0, 0, 0)),
              (this.target = t));
          }
          return (
            (t.prototype.isActive = function () {
              var t = y(this.target);
              return (
                (this.contentRect_ = t),
                t.width !== this.broadcastWidth ||
                  t.height !== this.broadcastHeight
              );
            }),
            (t.prototype.broadcastRect = function () {
              var t = this.contentRect_;
              return (
                (this.broadcastWidth = t.width),
                (this.broadcastHeight = t.height),
                t
              );
            }),
            t
          );
        })(),
        w = function (t, e) {
          var n,
            r,
            o,
            i,
            u,
            s,
            c,
            a =
              ((r = (n = e).x),
              (o = n.y),
              (i = n.width),
              (u = n.height),
              (s =
                'undefined' != typeof DOMRectReadOnly
                  ? DOMRectReadOnly
                  : Object),
              (c = Object.create(s.prototype)),
              f(c, {
                x: r,
                y: o,
                width: i,
                height: u,
                top: o,
                right: r + i,
                bottom: u + o,
                left: r,
              }),
              c);
          f(this, { target: t, contentRect: a });
        },
        g = (function () {
          function t(t, e, n) {
            if (
              ((this.activeObservations_ = []),
              (this.observations_ = new r()),
              'function' != typeof t)
            )
              throw new TypeError(
                'The callback provided as parameter 1 is not a function.'
              );
            ((this.callback_ = t),
              (this.controller_ = e),
              (this.callbackCtx_ = n));
          }
          return (
            (t.prototype.observe = function (t) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.');
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(t instanceof l(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".');
                var e = this.observations_;
                e.has(t) ||
                  (e.set(t, new m(t)),
                  this.controller_.addObserver(this),
                  this.controller_.refresh());
              }
            }),
            (t.prototype.unobserve = function (t) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.');
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(t instanceof l(t).Element))
                  throw new TypeError('parameter 1 is not of type "Element".');
                var e = this.observations_;
                e.has(t) &&
                  (e.delete(t),
                  e.size || this.controller_.removeObserver(this));
              }
            }),
            (t.prototype.disconnect = function () {
              (this.clearActive(),
                this.observations_.clear(),
                this.controller_.removeObserver(this));
            }),
            (t.prototype.gatherActive = function () {
              var t = this;
              (this.clearActive(),
                this.observations_.forEach(function (e) {
                  e.isActive() && t.activeObservations_.push(e);
                }));
            }),
            (t.prototype.broadcastActive = function () {
              if (this.hasActive()) {
                var t = this.callbackCtx_,
                  e = this.activeObservations_.map(function (t) {
                    return new w(t.target, t.broadcastRect());
                  });
                (this.callback_.call(t, e, t), this.clearActive());
              }
            }),
            (t.prototype.clearActive = function () {
              this.activeObservations_.splice(0);
            }),
            (t.prototype.hasActive = function () {
              return this.activeObservations_.length > 0;
            }),
            t
          );
        })(),
        E = 'undefined' != typeof WeakMap ? new WeakMap() : new r(),
        O = function t(e) {
          if (!(this instanceof t))
            throw new TypeError('Cannot call a class as a function.');
          if (!arguments.length)
            throw new TypeError('1 argument required, but only 0 present.');
          var n = a.getInstance(),
            r = new g(e, n, this);
          E.set(this, r);
        };
      ['observe', 'unobserve', 'disconnect'].forEach(function (t) {
        O.prototype[t] = function () {
          var e;
          return (e = E.get(this))[t].apply(e, arguments);
        };
      });
      const S = void 0 !== i.ResizeObserver ? i.ResizeObserver : O;
    },
    95257: (t, e) => {
      var n = Symbol.for('react.element'),
        r = Symbol.for('react.portal'),
        o = Symbol.for('react.fragment'),
        i = Symbol.for('react.strict_mode'),
        u = Symbol.for('react.profiler'),
        s = Symbol.for('react.provider'),
        c = Symbol.for('react.context'),
        a = Symbol.for('react.forward_ref'),
        f = Symbol.for('react.suspense'),
        l = Symbol.for('react.memo'),
        h = Symbol.for('react.lazy'),
        p = Symbol.iterator;
      var d = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        v = Object.assign,
        _ = {};
      function y(t, e, n) {
        ((this.props = t),
          (this.context = e),
          (this.refs = _),
          (this.updater = n || d));
      }
      function b() {}
      function m(t, e, n) {
        ((this.props = t),
          (this.context = e),
          (this.refs = _),
          (this.updater = n || d));
      }
      ((y.prototype.isReactComponent = {}),
        (y.prototype.setState = function (t, e) {
          if ('object' != typeof t && 'function' != typeof t && null != t)
            throw Error(
              'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
            );
          this.updater.enqueueSetState(this, t, e, 'setState');
        }),
        (y.prototype.forceUpdate = function (t) {
          this.updater.enqueueForceUpdate(this, t, 'forceUpdate');
        }),
        (b.prototype = y.prototype));
      var w = (m.prototype = new b());
      ((w.constructor = m), v(w, y.prototype), (w.isPureReactComponent = !0));
      var g = Array.isArray,
        E = Object.prototype.hasOwnProperty,
        O = { current: null },
        S = { key: !0, ref: !0, __self: !0, __source: !0 };
      function R(t, e, r) {
        var o,
          i = {},
          u = null,
          s = null;
        if (null != e)
          for (o in (void 0 !== e.ref && (s = e.ref),
          void 0 !== e.key && (u = '' + e.key),
          e))
            E.call(e, o) && !S.hasOwnProperty(o) && (i[o] = e[o]);
        var c = arguments.length - 2;
        if (1 === c) i.children = r;
        else if (1 < c) {
          for (var a = Array(c), f = 0; f < c; f++) a[f] = arguments[f + 2];
          i.children = a;
        }
        if (t && t.defaultProps)
          for (o in (c = t.defaultProps)) void 0 === i[o] && (i[o] = c[o]);
        return {
          $$typeof: n,
          type: t,
          key: u,
          ref: s,
          props: i,
          _owner: O.current,
        };
      }
      function k(t) {
        return 'object' == typeof t && null !== t && t.$$typeof === n;
      }
      var M = /\/+/g;
      function A(t, e) {
        return 'object' == typeof t && null !== t && null != t.key
          ? (function (t) {
              var e = { '=': '=0', ':': '=2' };
              return (
                '$' +
                t.replace(/[=:]/g, function (t) {
                  return e[t];
                })
              );
            })('' + t.key)
          : e.toString(36);
      }
      function C(t, e, o, i, u) {
        var s = typeof t;
        ('undefined' !== s && 'boolean' !== s) || (t = null);
        var c = !1;
        if (null === t) c = !0;
        else
          switch (s) {
            case 'string':
            case 'number':
              c = !0;
              break;
            case 'object':
              switch (t.$$typeof) {
                case n:
                case r:
                  c = !0;
              }
          }
        if (c)
          return (
            (u = u((c = t))),
            (t = '' === i ? '.' + A(c, 0) : i),
            g(u)
              ? ((o = ''),
                null != t && (o = t.replace(M, '$&/') + '/'),
                C(u, e, o, '', function (t) {
                  return t;
                }))
              : null != u &&
                (k(u) &&
                  (u = (function (t, e) {
                    return {
                      $$typeof: n,
                      type: t.type,
                      key: e,
                      ref: t.ref,
                      props: t.props,
                      _owner: t._owner,
                    };
                  })(
                    u,
                    o +
                      (!u.key || (c && c.key === u.key)
                        ? ''
                        : ('' + u.key).replace(M, '$&/') + '/') +
                      t
                  )),
                e.push(u)),
            1
          );
        if (((c = 0), (i = '' === i ? '.' : i + ':'), g(t)))
          for (var a = 0; a < t.length; a++) {
            var f = i + A((s = t[a]), a);
            c += C(s, e, o, f, u);
          }
        else if (
          ((f = (function (t) {
            return null === t || 'object' != typeof t
              ? null
              : 'function' == typeof (t = (p && t[p]) || t['@@iterator'])
                ? t
                : null;
          })(t)),
          'function' == typeof f)
        )
          for (t = f.call(t), a = 0; !(s = t.next()).done; )
            c += C((s = s.value), e, o, (f = i + A(s, a++)), u);
        else if ('object' === s)
          throw (
            (e = String(t)),
            Error(
              'Objects are not valid as a React child (found: ' +
                ('[object Object]' === e
                  ? 'object with keys {' + Object.keys(t).join(', ') + '}'
                  : e) +
                '). If you meant to render a collection of children, use an array instead.'
            )
          );
        return c;
      }
      function x(t, e, n) {
        if (null == t) return t;
        var r = [],
          o = 0;
        return (
          C(t, r, '', '', function (t) {
            return e.call(n, t, o++);
          }),
          r
        );
      }
      function j(t) {
        if (-1 === t._status) {
          var e = t._result;
          ((e = e()).then(
            function (e) {
              (0 !== t._status && -1 !== t._status) ||
                ((t._status = 1), (t._result = e));
            },
            function (e) {
              (0 !== t._status && -1 !== t._status) ||
                ((t._status = 2), (t._result = e));
            }
          ),
            -1 === t._status && ((t._status = 0), (t._result = e)));
        }
        if (1 === t._status) return t._result.default;
        throw t._result;
      }
      var $ = { current: null },
        T = { transition: null },
        D = {
          ReactCurrentDispatcher: $,
          ReactCurrentBatchConfig: T,
          ReactCurrentOwner: O,
        };
      ((e.Children = {
        map: x,
        forEach: function (t, e, n) {
          x(
            t,
            function () {
              e.apply(this, arguments);
            },
            n
          );
        },
        count: function (t) {
          var e = 0;
          return (
            x(t, function () {
              e++;
            }),
            e
          );
        },
        toArray: function (t) {
          return (
            x(t, function (t) {
              return t;
            }) || []
          );
        },
        only: function (t) {
          if (!k(t))
            throw Error(
              'React.Children.only expected to receive a single React element child.'
            );
          return t;
        },
      }),
        (e.Component = y),
        (e.Fragment = o),
        (e.Profiler = u),
        (e.PureComponent = m),
        (e.StrictMode = i),
        (e.Suspense = f),
        (e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = D),
        (e.cloneElement = function (t, e, r) {
          if (null == t)
            throw Error(
              'React.cloneElement(...): The argument must be a React element, but you passed ' +
                t +
                '.'
            );
          var o = v({}, t.props),
            i = t.key,
            u = t.ref,
            s = t._owner;
          if (null != e) {
            if (
              (void 0 !== e.ref && ((u = e.ref), (s = O.current)),
              void 0 !== e.key && (i = '' + e.key),
              t.type && t.type.defaultProps)
            )
              var c = t.type.defaultProps;
            for (a in e)
              E.call(e, a) &&
                !S.hasOwnProperty(a) &&
                (o[a] = void 0 === e[a] && void 0 !== c ? c[a] : e[a]);
          }
          var a = arguments.length - 2;
          if (1 === a) o.children = r;
          else if (1 < a) {
            c = Array(a);
            for (var f = 0; f < a; f++) c[f] = arguments[f + 2];
            o.children = c;
          }
          return {
            $$typeof: n,
            type: t.type,
            key: i,
            ref: u,
            props: o,
            _owner: s,
          };
        }),
        (e.createContext = function (t) {
          return (
            ((t = {
              $$typeof: c,
              _currentValue: t,
              _currentValue2: t,
              _threadCount: 0,
              Provider: null,
              Consumer: null,
              _defaultValue: null,
              _globalName: null,
            }).Provider = { $$typeof: s, _context: t }),
            (t.Consumer = t)
          );
        }),
        (e.createElement = R),
        (e.createFactory = function (t) {
          var e = R.bind(null, t);
          return ((e.type = t), e);
        }),
        (e.createRef = function () {
          return { current: null };
        }),
        (e.forwardRef = function (t) {
          return { $$typeof: a, render: t };
        }),
        (e.isValidElement = k),
        (e.lazy = function (t) {
          return {
            $$typeof: h,
            _payload: { _status: -1, _result: t },
            _init: j,
          };
        }),
        (e.memo = function (t, e) {
          return { $$typeof: l, type: t, compare: void 0 === e ? null : e };
        }),
        (e.startTransition = function (t) {
          var e = T.transition;
          T.transition = {};
          try {
            t();
          } finally {
            T.transition = e;
          }
        }),
        (e.unstable_act = function () {
          throw Error(
            'act(...) is not supported in production builds of React.'
          );
        }),
        (e.useCallback = function (t, e) {
          return $.current.useCallback(t, e);
        }),
        (e.useContext = function (t) {
          return $.current.useContext(t);
        }),
        (e.useDebugValue = function () {}),
        (e.useDeferredValue = function (t) {
          return $.current.useDeferredValue(t);
        }),
        (e.useEffect = function (t, e) {
          return $.current.useEffect(t, e);
        }),
        (e.useId = function () {
          return $.current.useId();
        }),
        (e.useImperativeHandle = function (t, e, n) {
          return $.current.useImperativeHandle(t, e, n);
        }),
        (e.useInsertionEffect = function (t, e) {
          return $.current.useInsertionEffect(t, e);
        }),
        (e.useLayoutEffect = function (t, e) {
          return $.current.useLayoutEffect(t, e);
        }),
        (e.useMemo = function (t, e) {
          return $.current.useMemo(t, e);
        }),
        (e.useReducer = function (t, e, n) {
          return $.current.useReducer(t, e, n);
        }),
        (e.useRef = function (t) {
          return $.current.useRef(t);
        }),
        (e.useState = function (t) {
          return $.current.useState(t);
        }),
        (e.useSyncExternalStore = function (t, e, n) {
          return $.current.useSyncExternalStore(t, e, n);
        }),
        (e.useTransition = function () {
          return $.current.useTransition();
        }),
        (e.version = '18.2.0'));
    },
    50959: (t, e, n) => {
      t.exports = n(95257);
    },
  },
]);
