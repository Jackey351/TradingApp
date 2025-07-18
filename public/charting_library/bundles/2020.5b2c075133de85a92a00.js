(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2020],
  {
    59142: function (o, e) {
      var l, i, n;
      ((i = [e]),
        (l = function (o) {
          'use strict';
          function e(o) {
            if (Array.isArray(o)) {
              for (var e = 0, l = Array(o.length); e < o.length; e++)
                l[e] = o[e];
              return l;
            }
            return Array.from(o);
          }
          Object.defineProperty(o, '__esModule', { value: !0 });
          var l = !1;
          if ('undefined' != typeof window) {
            var i = {
              get passive() {
                l = !0;
              },
            };
            (window.addEventListener('testPassive', null, i),
              window.removeEventListener('testPassive', null, i));
          }
          var n =
              'undefined' != typeof window &&
              window.navigator &&
              window.navigator.platform &&
              /iP(ad|hone|od)/.test(window.navigator.platform),
            a = [],
            t = !1,
            s = -1,
            c = void 0,
            r = void 0,
            d = function (o) {
              return a.some(function (e) {
                return !(
                  !e.options.allowTouchMove || !e.options.allowTouchMove(o)
                );
              });
            },
            T = function (o) {
              var e = o || window.event;
              return (
                !!d(e.target) ||
                1 < e.touches.length ||
                (e.preventDefault && e.preventDefault(), !1)
              );
            },
            L = function () {
              setTimeout(function () {
                (void 0 !== r &&
                  ((document.body.style.paddingRight = r), (r = void 0)),
                  void 0 !== c &&
                    ((document.body.style.overflow = c), (c = void 0)));
              });
            };
          ((o.disableBodyScroll = function (o, i) {
            if (n) {
              if (!o)
                return void console.error(
                  'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.'
                );
              if (
                o &&
                !a.some(function (e) {
                  return e.targetElement === o;
                })
              ) {
                var L = { targetElement: o, options: i || {} };
                ((a = [].concat(e(a), [L])),
                  (o.ontouchstart = function (o) {
                    1 === o.targetTouches.length &&
                      (s = o.targetTouches[0].clientY);
                  }),
                  (o.ontouchmove = function (e) {
                    var l, i, n, a;
                    1 === e.targetTouches.length &&
                      ((i = o),
                      (a = (l = e).targetTouches[0].clientY - s),
                      !d(l.target) &&
                        ((i && 0 === i.scrollTop && 0 < a) ||
                        ((n = i) &&
                          n.scrollHeight - n.scrollTop <= n.clientHeight &&
                          a < 0)
                          ? T(l)
                          : l.stopPropagation()));
                  }),
                  t ||
                    (document.addEventListener(
                      'touchmove',
                      T,
                      l ? { passive: !1 } : void 0
                    ),
                    (t = !0)));
              }
            } else {
              ((m = i),
                setTimeout(function () {
                  if (void 0 === r) {
                    var o = !!m && !0 === m.reserveScrollBarGap,
                      e =
                        window.innerWidth -
                        document.documentElement.clientWidth;
                    o &&
                      0 < e &&
                      ((r = document.body.style.paddingRight),
                      (document.body.style.paddingRight = e + 'px'));
                  }
                  void 0 === c &&
                    ((c = document.body.style.overflow),
                    (document.body.style.overflow = 'hidden'));
                }));
              var h = { targetElement: o, options: i || {} };
              a = [].concat(e(a), [h]);
            }
            var m;
          }),
            (o.clearAllBodyScrollLocks = function () {
              n
                ? (a.forEach(function (o) {
                    ((o.targetElement.ontouchstart = null),
                      (o.targetElement.ontouchmove = null));
                  }),
                  t &&
                    (document.removeEventListener(
                      'touchmove',
                      T,
                      l ? { passive: !1 } : void 0
                    ),
                    (t = !1)),
                  (a = []),
                  (s = -1))
                : (L(), (a = []));
            }),
            (o.enableBodyScroll = function (o) {
              if (n) {
                if (!o)
                  return void console.error(
                    'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.'
                  );
                ((o.ontouchstart = null),
                  (o.ontouchmove = null),
                  (a = a.filter(function (e) {
                    return e.targetElement !== o;
                  })),
                  t &&
                    0 === a.length &&
                    (document.removeEventListener(
                      'touchmove',
                      T,
                      l ? { passive: !1 } : void 0
                    ),
                    (t = !1)));
              } else
                1 === a.length && a[0].targetElement === o
                  ? (L(), (a = []))
                  : (a = a.filter(function (e) {
                      return e.targetElement !== o;
                    }));
            }));
        }),
        void 0 === (n = 'function' == typeof l ? l.apply(e, i) : l) ||
          (o.exports = n));
    },
    88803: (o) => {
      o.exports = {
        'tablet-normal-breakpoint': 'screen and (max-width: 768px)',
        'small-height-breakpoint': 'screen and (max-height: 360px)',
        'tablet-small-breakpoint': 'screen and (max-width: 430px)',
      };
    },
    14877: (o) => {
      o.exports = {
        favorite: 'favorite-_FRQhM5Y',
        hovered: 'hovered-_FRQhM5Y',
        disabled: 'disabled-_FRQhM5Y',
        active: 'active-_FRQhM5Y',
        checked: 'checked-_FRQhM5Y',
      };
    },
    24437: (o, e, l) => {
      'use strict';
      l.d(e, { DialogBreakpoints: () => n });
      var i = l(88803);
      const n = {
        SmallHeight: i['small-height-breakpoint'],
        TabletSmall: i['tablet-small-breakpoint'],
        TabletNormal: i['tablet-normal-breakpoint'],
      };
    },
    36189: (o, e, l) => {
      'use strict';
      l.d(e, { FavoriteButton: () => T });
      var i = l(44352),
        n = l(50959),
        a = l(97754),
        t = l(9745),
        s = l(39146),
        c = l(48010),
        r = l(14877);
      const d = {
        add: i.t(null, void 0, l(44629)),
        remove: i.t(null, void 0, l(72482)),
      };
      function T(o) {
        const { className: e, isFilled: l, isActive: i, onClick: T, ...L } = o;
        return n.createElement(t.Icon, {
          ...L,
          className: a(
            r.favorite,
            'apply-common-tooltip',
            l && r.checked,
            i && r.active,
            e
          ),
          icon: l ? s : c,
          onClick: T,
          title: l ? d.remove : d.add,
        });
      }
    },
    54784: (o) => {
      o.exports = {
        button: 'button-KTgbfaP5',
        hover: 'hover-KTgbfaP5',
        bg: 'bg-KTgbfaP5',
        icon: 'icon-KTgbfaP5',
        isActive: 'isActive-KTgbfaP5',
        isTransparent: 'isTransparent-KTgbfaP5',
        isGrayed: 'isGrayed-KTgbfaP5',
        isHidden: 'isHidden-KTgbfaP5',
        accessible: 'accessible-KTgbfaP5',
      };
    },
    66427: (o, e, l) => {
      'use strict';
      l.d(e, { ToolButton: () => s });
      var i = l(50959),
        n = l(97754),
        a = l(9745),
        t = l(54784);
      const s = (0, i.forwardRef)((o, e) => {
        const {
            id: l,
            activeClass: s,
            children: c,
            className: r,
            icon: d,
            isActive: T,
            isGrayed: L,
            isHidden: h,
            isTransparent: m,
            theme: v = t,
            onClick: z,
            onKeyDown: g,
            buttonHotKey: w,
            tooltipPosition: u = 'vertical',
            tag: f = 'div',
            tabIndex: N,
            tooltip: p,
            ...I
          } = o,
          A = 'button' === o.tag;
        return i.createElement(
          f,
          {
            'aria-label': A ? p : void 0,
            ...I,
            id: l,
            type: A ? 'button' : void 0,
            className: n(
              v.button,
              r,
              T && s,
              {
                'apply-common-tooltip': Boolean(p),
                'common-tooltip-vertical': Boolean(p) && 'vertical' === u,
                [v.isActive]: T,
                [v.isGrayed]: L,
                [v.isHidden]: h,
                [v.isTransparent]: m,
              },
              A && v.accessible
            ),
            onClick: z,
            onKeyDown: g,
            'data-role': A ? void 0 : 'button',
            ref: e,
            tabIndex: N,
            'data-tooltip-hotkey': w,
            'aria-pressed': A ? T : void 0,
            'data-tooltip': p,
          },
          i.createElement(
            'div',
            { className: v.bg },
            d &&
              ('string' == typeof d
                ? i.createElement(a.Icon, { className: v.icon, icon: d })
                : i.createElement('span', { className: v.icon }, d)),
            c
          )
        );
      });
    },
    87872: (o, e, l) => {
      'use strict';
      l.d(e, { drawingToolsIcons: () => i });
      const i = {
        SyncDrawing: l(99088),
        arrow: l(63743),
        cursor: l(18953),
        dot: l(72196),
        drawginmode: l(53950),
        drawginmodeActive: l(1532),
        eraser: l(27999),
        group: l(19799),
        hideAllDrawings: l(45820),
        hideAllDrawingsActive: l(84959),
        hideAllIndicators: l(42321),
        hideAllIndicatorsActive: l(75895),
        hideAllDrawingTools: l(93756),
        hideAllDrawingToolsActive: l(42650),
        hideAllPositionsTools: l(57313),
        hideAllPositionsToolsActive: l(65162),
        lockAllDrawings: l(91244),
        lockAllDrawingsActive: l(65186),
        magnet: l(68385),
        heart: l(10862),
        smile: l(7636),
        sticker: l(62567),
        strongMagnet: l(46049),
        measure: l(88518),
        removeAllDrawingTools: l(35149),
        showObjectTree: l(36515),
        zoom: l(6894),
        'zoom-out': l(45360),
      };
    },
    54819: (o, e, l) => {
      'use strict';
      l.d(e, { lineToolsInfo: () => v });
      var i = l(44352),
        n = l(61814),
        a = (l(42053), l(57673)),
        t = l(87872),
        s = l(59656),
        c = l(68335);
      const r = (0, c.humanReadableModifiers)(c.Modifiers.Shift, !1),
        d = (0, c.humanReadableModifiers)(c.Modifiers.Alt, !1),
        T = (0, c.humanReadableModifiers)(c.Modifiers.Mod, !1),
        L = { keys: [r], text: i.t(null, void 0, l(40234)) },
        h = { keys: [r], text: i.t(null, void 0, l(68125)) },
        m = { keys: [r], text: i.t(null, void 0, l(81591)) },
        v = {
          LineTool5PointsPattern: {
            icon: a.lineToolsIcons.LineTool5PointsPattern,
            localizedName: s.lineToolsLocalizedNames.LineTool5PointsPattern,
          },
          LineToolABCD: {
            icon: a.lineToolsIcons.LineToolABCD,
            localizedName: s.lineToolsLocalizedNames.LineToolABCD,
          },
          LineToolArc: {
            icon: a.lineToolsIcons.LineToolArc,
            localizedName: s.lineToolsLocalizedNames.LineToolArc,
          },
          LineToolArrow: {
            icon: a.lineToolsIcons.LineToolArrow,
            localizedName: s.lineToolsLocalizedNames.LineToolArrow,
          },
          LineToolArrowMarkDown: {
            icon: a.lineToolsIcons.LineToolArrowMarkDown,
            localizedName: s.lineToolsLocalizedNames.LineToolArrowMarkDown,
          },
          LineToolArrowMarkLeft: {
            icon: a.lineToolsIcons.LineToolArrowMarkLeft,
            localizedName: s.lineToolsLocalizedNames.LineToolArrowMarkLeft,
          },
          LineToolArrowMarkRight: {
            icon: a.lineToolsIcons.LineToolArrowMarkRight,
            localizedName: s.lineToolsLocalizedNames.LineToolArrowMarkRight,
          },
          LineToolArrowMarkUp: {
            icon: a.lineToolsIcons.LineToolArrowMarkUp,
            localizedName: s.lineToolsLocalizedNames.LineToolArrowMarkUp,
          },
          LineToolBalloon: {
            icon: a.lineToolsIcons.LineToolBalloon,
            localizedName: s.lineToolsLocalizedNames.LineToolBalloon,
          },
          LineToolComment: {
            icon: a.lineToolsIcons.LineToolComment,
            localizedName: s.lineToolsLocalizedNames.LineToolComment,
          },
          LineToolBarsPattern: {
            icon: a.lineToolsIcons.LineToolBarsPattern,
            localizedName: s.lineToolsLocalizedNames.LineToolBarsPattern,
          },
          LineToolBezierCubic: {
            icon: a.lineToolsIcons.LineToolBezierCubic,
            localizedName: s.lineToolsLocalizedNames.LineToolBezierCubic,
          },
          LineToolBezierQuadro: {
            icon: a.lineToolsIcons.LineToolBezierQuadro,
            localizedName: s.lineToolsLocalizedNames.LineToolBezierQuadro,
          },
          LineToolBrush: {
            icon: a.lineToolsIcons.LineToolBrush,
            localizedName: s.lineToolsLocalizedNames.LineToolBrush,
          },
          LineToolCallout: {
            icon: a.lineToolsIcons.LineToolCallout,
            localizedName: s.lineToolsLocalizedNames.LineToolCallout,
          },
          LineToolCircleLines: {
            icon: a.lineToolsIcons.LineToolCircleLines,
            localizedName: s.lineToolsLocalizedNames.LineToolCircleLines,
          },
          LineToolCypherPattern: {
            icon: a.lineToolsIcons.LineToolCypherPattern,
            localizedName: s.lineToolsLocalizedNames.LineToolCypherPattern,
          },
          LineToolDateAndPriceRange: {
            icon: a.lineToolsIcons.LineToolDateAndPriceRange,
            localizedName: s.lineToolsLocalizedNames.LineToolDateAndPriceRange,
          },
          LineToolDateRange: {
            icon: a.lineToolsIcons.LineToolDateRange,
            localizedName: s.lineToolsLocalizedNames.LineToolDateRange,
          },
          LineToolDisjointAngle: {
            icon: a.lineToolsIcons.LineToolDisjointAngle,
            localizedName: s.lineToolsLocalizedNames.LineToolDisjointAngle,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolElliottCorrection: {
            icon: a.lineToolsIcons.LineToolElliottCorrection,
            localizedName: s.lineToolsLocalizedNames.LineToolElliottCorrection,
          },
          LineToolElliottDoubleCombo: {
            icon: a.lineToolsIcons.LineToolElliottDoubleCombo,
            localizedName: s.lineToolsLocalizedNames.LineToolElliottDoubleCombo,
          },
          LineToolElliottImpulse: {
            icon: a.lineToolsIcons.LineToolElliottImpulse,
            localizedName: s.lineToolsLocalizedNames.LineToolElliottImpulse,
          },
          LineToolElliottTriangle: {
            icon: a.lineToolsIcons.LineToolElliottTriangle,
            localizedName: s.lineToolsLocalizedNames.LineToolElliottTriangle,
          },
          LineToolElliottTripleCombo: {
            icon: a.lineToolsIcons.LineToolElliottTripleCombo,
            localizedName: s.lineToolsLocalizedNames.LineToolElliottTripleCombo,
          },
          LineToolEllipse: {
            icon: a.lineToolsIcons.LineToolEllipse,
            localizedName: s.lineToolsLocalizedNames.LineToolEllipse,
            hotKey: (0, n.hotKeySerialize)(h),
          },
          LineToolExtended: {
            icon: a.lineToolsIcons.LineToolExtended,
            localizedName: s.lineToolsLocalizedNames.LineToolExtended,
          },
          LineToolFibChannel: {
            icon: a.lineToolsIcons.LineToolFibChannel,
            localizedName: s.lineToolsLocalizedNames.LineToolFibChannel,
          },
          LineToolFibCircles: {
            icon: a.lineToolsIcons.LineToolFibCircles,
            localizedName: s.lineToolsLocalizedNames.LineToolFibCircles,
            hotKey: (0, n.hotKeySerialize)(h),
          },
          LineToolFibRetracement: {
            icon: a.lineToolsIcons.LineToolFibRetracement,
            localizedName: s.lineToolsLocalizedNames.LineToolFibRetracement,
          },
          LineToolFibSpeedResistanceArcs: {
            icon: a.lineToolsIcons.LineToolFibSpeedResistanceArcs,
            localizedName:
              s.lineToolsLocalizedNames.LineToolFibSpeedResistanceArcs,
          },
          LineToolFibSpeedResistanceFan: {
            icon: a.lineToolsIcons.LineToolFibSpeedResistanceFan,
            localizedName:
              s.lineToolsLocalizedNames.LineToolFibSpeedResistanceFan,
            hotKey: (0, n.hotKeySerialize)(m),
          },
          LineToolFibSpiral: {
            icon: a.lineToolsIcons.LineToolFibSpiral,
            localizedName: s.lineToolsLocalizedNames.LineToolFibSpiral,
          },
          LineToolFibTimeZone: {
            icon: a.lineToolsIcons.LineToolFibTimeZone,
            localizedName: s.lineToolsLocalizedNames.LineToolFibTimeZone,
          },
          LineToolFibWedge: {
            icon: a.lineToolsIcons.LineToolFibWedge,
            localizedName: s.lineToolsLocalizedNames.LineToolFibWedge,
          },
          LineToolFlagMark: {
            icon: a.lineToolsIcons.LineToolFlagMark,
            localizedName: s.lineToolsLocalizedNames.LineToolFlagMark,
          },
          LineToolImage: {
            icon: a.lineToolsIcons.LineToolImage,
            localizedName: s.lineToolsLocalizedNames.LineToolImage,
          },
          LineToolFlatBottom: {
            icon: a.lineToolsIcons.LineToolFlatBottom,
            localizedName: s.lineToolsLocalizedNames.LineToolFlatBottom,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolAnchoredVWAP: {
            icon: a.lineToolsIcons.LineToolAnchoredVWAP,
            localizedName: s.lineToolsLocalizedNames.LineToolAnchoredVWAP,
          },
          LineToolGannComplex: {
            icon: a.lineToolsIcons.LineToolGannComplex,
            localizedName: s.lineToolsLocalizedNames.LineToolGannComplex,
          },
          LineToolGannFixed: {
            icon: a.lineToolsIcons.LineToolGannFixed,
            localizedName: s.lineToolsLocalizedNames.LineToolGannFixed,
          },
          LineToolGannFan: {
            icon: a.lineToolsIcons.LineToolGannFan,
            localizedName: s.lineToolsLocalizedNames.LineToolGannFan,
          },
          LineToolGannSquare: {
            icon: a.lineToolsIcons.LineToolGannSquare,
            localizedName: s.lineToolsLocalizedNames.LineToolGannSquare,
            hotKey: (0, n.hotKeySerialize)({
              keys: [r],
              text: i.t(null, void 0, l(10289)),
            }),
          },
          LineToolHeadAndShoulders: {
            icon: a.lineToolsIcons.LineToolHeadAndShoulders,
            localizedName: s.lineToolsLocalizedNames.LineToolHeadAndShoulders,
          },
          LineToolHorzLine: {
            icon: a.lineToolsIcons.LineToolHorzLine,
            localizedName: s.lineToolsLocalizedNames.LineToolHorzLine,
            hotKey: (0, n.hotKeySerialize)({
              keys: [d, 'H'],
              text: '{0} + {1}',
            }),
          },
          LineToolHorzRay: {
            icon: a.lineToolsIcons.LineToolHorzRay,
            localizedName: s.lineToolsLocalizedNames.LineToolHorzRay,
          },
          LineToolIcon: {
            icon: a.lineToolsIcons.LineToolIcon,
            localizedName: s.lineToolsLocalizedNames.LineToolIcon,
          },
          LineToolEmoji: {
            icon: a.lineToolsIcons.LineToolEmoji,
            localizedName: s.lineToolsLocalizedNames.LineToolEmoji,
          },
          LineToolInsidePitchfork: {
            icon: a.lineToolsIcons.LineToolInsidePitchfork,
            localizedName: s.lineToolsLocalizedNames.LineToolInsidePitchfork,
          },
          LineToolNote: {
            icon: a.lineToolsIcons.LineToolNote,
            localizedName: s.lineToolsLocalizedNames.LineToolNote,
          },
          LineToolNoteAbsolute: {
            icon: a.lineToolsIcons.LineToolNoteAbsolute,
            localizedName: s.lineToolsLocalizedNames.LineToolNoteAbsolute,
          },
          LineToolSignpost: {
            icon: a.lineToolsIcons.LineToolSignpost,
            localizedName: s.lineToolsLocalizedNames.LineToolSignpost,
          },
          LineToolParallelChannel: {
            icon: a.lineToolsIcons.LineToolParallelChannel,
            localizedName: s.lineToolsLocalizedNames.LineToolParallelChannel,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolPitchfan: {
            icon: a.lineToolsIcons.LineToolPitchfan,
            localizedName: s.lineToolsLocalizedNames.LineToolPitchfan,
          },
          LineToolPitchfork: {
            icon: a.lineToolsIcons.LineToolPitchfork,
            localizedName: s.lineToolsLocalizedNames.LineToolPitchfork,
          },
          LineToolPolyline: {
            icon: a.lineToolsIcons.LineToolPolyline,
            localizedName: s.lineToolsLocalizedNames.LineToolPolyline,
          },
          LineToolPath: {
            icon: a.lineToolsIcons.LineToolPath,
            localizedName: s.lineToolsLocalizedNames.LineToolPath,
          },
          LineToolPrediction: {
            icon: a.lineToolsIcons.LineToolPrediction,
            localizedName: s.lineToolsLocalizedNames.LineToolPrediction,
          },
          LineToolPriceLabel: {
            icon: a.lineToolsIcons.LineToolPriceLabel,
            localizedName: s.lineToolsLocalizedNames.LineToolPriceLabel,
          },
          LineToolPriceNote: {
            icon: a.lineToolsIcons.LineToolPriceNote,
            localizedName: s.lineToolsLocalizedNames.LineToolPriceNote,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolArrowMarker: {
            icon: a.lineToolsIcons.LineToolArrowMarker,
            localizedName: s.lineToolsLocalizedNames.LineToolArrowMarker,
          },
          LineToolPriceRange: {
            icon: a.lineToolsIcons.LineToolPriceRange,
            localizedName: s.lineToolsLocalizedNames.LineToolPriceRange,
          },
          LineToolProjection: {
            icon: a.lineToolsIcons.LineToolProjection,
            localizedName: s.lineToolsLocalizedNames.LineToolProjection,
          },
          LineToolRay: {
            icon: a.lineToolsIcons.LineToolRay,
            localizedName: s.lineToolsLocalizedNames.LineToolRay,
          },
          LineToolRectangle: {
            icon: a.lineToolsIcons.LineToolRectangle,
            localizedName: s.lineToolsLocalizedNames.LineToolRectangle,
            hotKey: (0, n.hotKeySerialize)({
              keys: [r],
              text: i.t(null, void 0, l(81591)),
            }),
          },
          LineToolCircle: {
            icon: a.lineToolsIcons.LineToolCircle,
            localizedName: s.lineToolsLocalizedNames.LineToolCircle,
          },
          LineToolRegressionTrend: {
            icon: a.lineToolsIcons.LineToolRegressionTrend,
            localizedName: s.lineToolsLocalizedNames.LineToolRegressionTrend,
          },
          LineToolRiskRewardLong: {
            icon: a.lineToolsIcons.LineToolRiskRewardLong,
            localizedName: s.lineToolsLocalizedNames.LineToolRiskRewardLong,
          },
          LineToolRiskRewardShort: {
            icon: a.lineToolsIcons.LineToolRiskRewardShort,
            localizedName: s.lineToolsLocalizedNames.LineToolRiskRewardShort,
          },
          LineToolFixedRangeVolumeProfile: {
            icon: a.lineToolsIcons.LineToolFixedRangeVolumeProfile,
            localizedName:
              s.lineToolsLocalizedNames.LineToolFixedRangeVolumeProfile,
          },
          LineToolRotatedRectangle: {
            icon: a.lineToolsIcons.LineToolRotatedRectangle,
            localizedName: s.lineToolsLocalizedNames.LineToolRotatedRectangle,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolSchiffPitchfork: {
            icon: a.lineToolsIcons.LineToolSchiffPitchfork,
            localizedName: s.lineToolsLocalizedNames.LineToolSchiffPitchfork,
          },
          LineToolSchiffPitchfork2: {
            icon: a.lineToolsIcons.LineToolSchiffPitchfork2,
            localizedName: s.lineToolsLocalizedNames.LineToolSchiffPitchfork2,
          },
          LineToolSineLine: {
            icon: a.lineToolsIcons.LineToolSineLine,
            localizedName: s.lineToolsLocalizedNames.LineToolSineLine,
          },
          LineToolText: {
            icon: a.lineToolsIcons.LineToolText,
            localizedName: s.lineToolsLocalizedNames.LineToolText,
          },
          LineToolTextAbsolute: {
            icon: a.lineToolsIcons.LineToolTextAbsolute,
            localizedName: s.lineToolsLocalizedNames.LineToolTextAbsolute,
          },
          LineToolThreeDrivers: {
            icon: a.lineToolsIcons.LineToolThreeDrivers,
            localizedName: s.lineToolsLocalizedNames.LineToolThreeDrivers,
          },
          LineToolTimeCycles: {
            icon: a.lineToolsIcons.LineToolTimeCycles,
            localizedName: s.lineToolsLocalizedNames.LineToolTimeCycles,
          },
          LineToolTrendAngle: {
            icon: a.lineToolsIcons.LineToolTrendAngle,
            localizedName: s.lineToolsLocalizedNames.LineToolTrendAngle,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolTrendBasedFibExtension: {
            icon: a.lineToolsIcons.LineToolTrendBasedFibExtension,
            localizedName:
              s.lineToolsLocalizedNames.LineToolTrendBasedFibExtension,
          },
          LineToolTrendBasedFibTime: {
            icon: a.lineToolsIcons.LineToolTrendBasedFibTime,
            localizedName: s.lineToolsLocalizedNames.LineToolTrendBasedFibTime,
          },
          LineToolTrendLine: {
            icon: a.lineToolsIcons.LineToolTrendLine,
            localizedName: s.lineToolsLocalizedNames.LineToolTrendLine,
            hotKey: (0, n.hotKeySerialize)(L),
          },
          LineToolInfoLine: {
            icon: a.lineToolsIcons.LineToolInfoLine,
            localizedName: s.lineToolsLocalizedNames.LineToolInfoLine,
          },
          LineToolTriangle: {
            icon: a.lineToolsIcons.LineToolTriangle,
            localizedName: s.lineToolsLocalizedNames.LineToolTriangle,
          },
          LineToolTrianglePattern: {
            icon: a.lineToolsIcons.LineToolTrianglePattern,
            localizedName: s.lineToolsLocalizedNames.LineToolTrianglePattern,
          },
          LineToolVertLine: {
            icon: a.lineToolsIcons.LineToolVertLine,
            localizedName: s.lineToolsLocalizedNames.LineToolVertLine,
            hotKey: (0, n.hotKeySerialize)({
              keys: [d, 'V'],
              text: '{0} + {1}',
            }),
          },
          LineToolCrossLine: {
            icon: a.lineToolsIcons.LineToolCrossLine,
            localizedName: s.lineToolsLocalizedNames.LineToolCrossLine,
          },
          LineToolHighlighter: {
            icon: a.lineToolsIcons.LineToolHighlighter,
            localizedName: s.lineToolsLocalizedNames.LineToolHighlighter,
          },
          SyncDrawing: {
            icon: t.drawingToolsIcons.SyncDrawing,
            iconActive: t.drawingToolsIcons.SyncDrawingActive,
            localizedName: i.t(null, void 0, l(36551)),
          },
          arrow: {
            icon: t.drawingToolsIcons.arrow,
            localizedName: i.t(null, void 0, l(96237)),
          },
          cursor: {
            icon: t.drawingToolsIcons.cursor,
            localizedName: i.t(null, void 0, l(29908)),
          },
          dot: {
            icon: t.drawingToolsIcons.dot,
            localizedName: i.t(null, void 0, l(60925)),
          },
          drawginmode: {
            icon: t.drawingToolsIcons.drawginmode,
            iconActive: t.drawingToolsIcons.drawginmodeActive,
            localizedName: i.t(null, void 0, l(49421)),
          },
          eraser: {
            icon: t.drawingToolsIcons.eraser,
            localizedName: i.t(null, void 0, l(99289)),
          },
          group: {
            icon: t.drawingToolsIcons.group,
            localizedName: i.t(null, void 0, l(91977)),
          },
          hideAllDrawings: {
            icon: t.drawingToolsIcons.hideAllDrawings,
            iconActive: t.drawingToolsIcons.hideAllDrawingsActive,
            localizedName: i.t(null, void 0, l(17517)),
            hotKey: (0, n.hotKeySerialize)({
              keys: [T, d, 'H'],
              text: '{0} + {1} + {2}',
            }),
          },
          lockAllDrawings: {
            icon: t.drawingToolsIcons.lockAllDrawings,
            iconActive: t.drawingToolsIcons.lockAllDrawingsActive,
            localizedName: i.t(null, void 0, l(37057)),
          },
          magnet: {
            icon: t.drawingToolsIcons.magnet,
            localizedName: i.t(null, void 0, l(37140)),
            hotKey: (0, n.hotKeySerialize)({ keys: [T], text: '{0}' }),
          },
          measure: {
            icon: t.drawingToolsIcons.measure,
            localizedName: i.t(null, void 0, l(59607)),
            hotKey: (0, n.hotKeySerialize)({
              keys: [r],
              text: i.t(null, void 0, l(32868)),
            }),
          },
          removeAllDrawingTools: {
            icon: t.drawingToolsIcons.removeAllDrawingTools,
            localizedName: i.t(null, void 0, l(76091)),
          },
          showObjectsTree: {
            icon: t.drawingToolsIcons.showObjectTree,
            localizedName: i.t(null, void 0, l(51072)),
          },
          zoom: {
            icon: t.drawingToolsIcons.zoom,
            localizedName: i.t(null, void 0, l(38925)),
          },
          'zoom-out': {
            icon: t.drawingToolsIcons['zoom-out'],
            localizedName: i.t(null, void 0, l(49895)),
          },
        };
      v.LineToolGhostFeed = {
        icon: a.lineToolsIcons.LineToolGhostFeed,
        localizedName: s.lineToolsLocalizedNames.LineToolGhostFeed,
      };
    },
    71810: (o, e, l) => {
      'use strict';
      l.d(e, { LinetoolsFavoritesStore: () => s });
      var i = l(57898),
        n = l(56840);
      const a = ['LineToolBalloon'];
      var t, s;
      (!(function (o) {
        function e() {
          var e, i;
          o.favorites = [];
          let s = !1;
          const c = Boolean(
              void 0 === (0, n.getValue)('chart.favoriteDrawings')
            ),
            r = (0, n.getJSON)('chart.favoriteDrawings', []);
          if (0 === r.length && c && 'undefined' != typeof window) {
            const o = JSON.parse(
              null !==
                (i =
                  null === (e = window.urlParams) || void 0 === e
                    ? void 0
                    : e.favorites) && void 0 !== i
                ? i
                : '{}'
            ).drawingTools;
            o && Array.isArray(o) && r.push(...o);
          }
          (r.forEach((e, i) => {
            const n = e.tool || e;
            l(n)
              ? a.includes(n)
                ? (s = !0)
                : o.favorites.push(n)
              : 'LineToolTweet' === n && (o.tweetToolPosition = i);
          }),
            s && t(),
            o.favoritesSynced.fire());
        }
        function l(o) {
          return 'string' == typeof o && '' !== o && !0;
        }
        function t(e) {
          const l = o.favorites.slice();
          (null !== o.tweetToolPosition &&
            l.splice(o.tweetToolPosition, 0, 'LineToolTweet'),
            (0, n.setJSON)('chart.favoriteDrawings', l, e));
        }
        ((o.favorites = []),
          (o.favoritesSynced = new i.Delegate()),
          (o.tweetToolPosition = null),
          (o.favoriteIndex = function (e) {
            return o.favorites.indexOf(e);
          }),
          (o.isValidLineToolName = l),
          (o.saveFavorites = t),
          e(),
          n.onSync.subscribe(null, e));
      })(t || (t = {})),
        (function (o) {
          function e(o) {
            return t.isValidLineToolName(o);
          }
          function l() {
            return t.favorites.length;
          }
          function n(o) {
            return -1 !== t.favoriteIndex(o);
          }
          ((o.favoriteAdded = new i.Delegate()),
            (o.favoriteRemoved = new i.Delegate()),
            (o.favoriteMoved = new i.Delegate()),
            (o.favoritesSynced = t.favoritesSynced),
            (o.favorites = function () {
              return t.favorites.slice();
            }),
            (o.isValidLineToolName = e),
            (o.favoritesCount = l),
            (o.favorite = function (o) {
              return o < 0 || o >= l() ? '' : t.favorites[o];
            }),
            (o.addFavorite = function (l, i) {
              return (
                !(n(l) || !e(l)) &&
                (t.favorites.push(l),
                t.saveFavorites(i),
                o.favoriteAdded.fire(l),
                !0)
              );
            }),
            (o.removeFavorite = function (e, l) {
              const i = t.favoriteIndex(e);
              if (-1 === i) return !1;
              t.favorites.splice(i, 1);
              const n = t.tweetToolPosition;
              return (
                null !== n && n > i && (t.tweetToolPosition = n - 1),
                t.saveFavorites(l),
                o.favoriteRemoved.fire(e),
                !0
              );
            }),
            (o.isFavorite = n),
            (o.moveFavorite = function (i, n, a) {
              if (n < 0 || n >= l() || !e(i)) return !1;
              const s = t.favoriteIndex(i);
              if (-1 === s || n === s) return !1;
              let c = t.tweetToolPosition;
              return (
                null !== c &&
                  (s < c && n > c ? c-- : n < c && s > c && c++,
                  (t.tweetToolPosition = c)),
                t.favorites.splice(s, 1),
                t.favorites.splice(n, 0, i),
                t.saveFavorites(a),
                o.favoriteMoved.fire(i, s, n),
                !0
              );
            }));
        })(s || (s = {})));
    },
    19799: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M5.5 13A2.5 2.5 0 0 0 3 15.5 2.5 2.5 0 0 0 5.5 18 2.5 2.5 0 0 0 8 15.5 2.5 2.5 0 0 0 5.5 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 15 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 15 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>';
    },
    63743: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11.682 16.09l3.504 6.068 1.732-1-3.497-6.057 3.595-2.1L8 7.74v10.512l3.682-2.163zm-.362 1.372L7 20V6l12 7-4.216 2.462 3.5 6.062-3.464 2-3.5-6.062z"/></svg>';
    },
    18953: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M18 15h8v-1h-8z"/><path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"/></g></svg>';
    },
    72196: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><circle fill="currentColor" cx="14" cy="14" r="3"/></svg>';
    },
    1532: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 17.5v-2a2.5 2.5 0 0 0-5 0v2h1v-2a1.5 1.5 0 0 1 3 0v2h1z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>';
    },
    53950: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.002 23C23 23 23 18.003 23 18.003L15.998 18C16 18 16 22.997 16 22.997l7.002.003zM15 18.003A1 1 0 0 1 15.998 17h7.004c.551 0 .998.438.998 1.003v4.994A1 1 0 0 1 23.002 24h-7.004A.993.993 0 0 1 15 22.997v-4.994z"/><path d="M19 20h1v2h-1z"/><path fill-rule="nonzero" d="M22 14.5a2.5 2.5 0 0 0-5 0v3h1v-3a1.5 1.5 0 0 1 3 0v.5h1v-.5z"/><g fill-rule="nonzero"><path d="M3 14.707A1 1 0 0 1 3.293 14L14.439 2.854a1.5 1.5 0 0 1 2.122 0l2.585 2.585a1.5 1.5 0 0 1 0 2.122L8 18.707a1 1 0 0 1-.707.293H4a1 1 0 0 1-1-1v-3.293zm1 0V18h3.293L18.439 6.854a.5.5 0 0 0 0-.708l-2.585-2.585a.5.5 0 0 0-.708 0L4 14.707z"/><path d="M13.146 4.854l4 4 .708-.708-4-4zm-9 9l4 4 .708-.708-4-4z"/><path d="M15.146 6.146l-9 9 .708.708 9-9z"/></g></g></svg>';
    },
    27999: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 31" width="29" height="31"><g fill="currentColor" fill-rule="nonzero"><path d="M15.3 22l8.187-8.187c.394-.394.395-1.028.004-1.418l-4.243-4.243c-.394-.394-1.019-.395-1.407-.006l-11.325 11.325c-.383.383-.383 1.018.007 1.407l1.121 1.121h7.656zm-9.484-.414c-.781-.781-.779-2.049-.007-2.821l11.325-11.325c.777-.777 2.035-.78 2.821.006l4.243 4.243c.781.781.78 2.048-.004 2.832l-8.48 8.48h-8.484l-1.414-1.414z"/><path d="M13.011 22.999h7.999v-1h-7.999zM13.501 11.294l6.717 6.717.707-.707-6.717-6.717z"/></g></svg>';
    },
    10862: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M24.13 14.65a6.2 6.2 0 0 0-.46-9.28c-2.57-2.09-6.39-1.71-8.75.6l-.92.91-.92-.9c-2.36-2.32-6.18-2.7-8.75-.61a6.2 6.2 0 0 0-.46 9.28l9.07 8.92c.58.57 1.53.57 2.12 0l9.07-8.92Zm-9.77 8.2 9.07-8.91a5.2 5.2 0 0 0-.39-7.8c-2.13-1.73-5.38-1.45-7.42.55L14 8.29l-1.62-1.6c-2.03-2-5.29-2.28-7.42-.55a5.2 5.2 0 0 0-.4 7.8l9.08 8.91c.2.2.52.2.72 0Z"/></svg>';
    },
    68385: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 10a2 2 0 0 0-2 2v11H6V12c0-4.416 3.584-8 8-8s8 3.584 8 8v11h-6V12a2 2 0 0 0-2-2zm-3 2a3 3 0 0 1 6 0v10h4V12c0-3.864-3.136-7-7-7s-7 3.136-7 7v10h4V12z"/><path d="M6.5 18h5v1h-5zm10 0h5v1h-5z"/></g></svg>';
    },
    88518: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M2 9.75a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h24a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5zm0 1h3v2.5h1v-2.5h3.25v3.9h1v-3.9h3.25v2.5h1v-2.5h3.25v3.9h1v-3.9H22v2.5h1v-2.5h3a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 1 .5-.5z" transform="rotate(-45 14 14)"/></svg>';
    },
    36515: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M14 18.634l-.307-.239-7.37-5.73-2.137-1.665 9.814-7.633 9.816 7.634-.509.394-1.639 1.269-7.667 5.969zm7.054-6.759l1.131-.876-8.184-6.366-8.186 6.367 1.123.875 7.063 5.491 7.054-5.492z"/><path d="M7 14.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/><path d="M7 17.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/></g></svg>';
    },
    7636: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.05 14a9.95 9.95 0 1 1 19.9 0 9.95 9.95 0 0 1-19.9 0ZM14 3a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm-3 13.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';
    },
    62567: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M7 4h14a3 3 0 0 1 3 3v11c0 .34-.03.67-.08 1H20.3c-1.28 0-2.31.97-2.31 2.24V24H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm12 19.92A6 6 0 0 0 23.66 20H20.3c-.77 0-1.31.48-1.31 1.24v2.68ZM3 7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v11a7 7 0 0 1-7 7H7a4 4 0 0 1-4-4V7Zm8 9.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';
    },
    46049: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="nonzero" d="M14 5a7 7 0 0 0-7 7v3h4v-3a3 3 0 1 1 6 0v3h4v-3a7 7 0 0 0-7-7zm7 11h-4v3h4v-3zm-10 0H7v3h4v-3zm-5-4a8 8 0 1 1 16 0v8h-6v-8a2 2 0 1 0-4 0v8H6v-8zm3.293 11.294l-1.222-2.037.858-.514 1.777 2.963-2 1 1.223 2.037-.858.514-1.778-2.963 2-1zm9.778-2.551l.858.514-1.223 2.037 2 1-1.777 2.963-.858-.514 1.223-2.037-2-1 1.777-2.963z"/></svg>';
    },
    99088: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M15.039 5.969l-.019-.019-2.828 2.828.707.707 2.474-2.474c1.367-1.367 3.582-1.367 4.949 0s1.367 3.582 0 4.949l-2.474 2.474.707.707 2.828-2.828-.019-.019c1.415-1.767 1.304-4.352-.334-5.99-1.638-1.638-4.224-1.749-5.99-.334zM5.97 15.038l-.019-.019 2.828-2.828.707.707-2.475 2.475c-1.367 1.367-1.367 3.582 0 4.949s3.582 1.367 4.949 0l2.474-2.474.707.707-2.828 2.828-.019-.019c-1.767 1.415-4.352 1.304-5.99-.334-1.638-1.638-1.749-4.224-.334-5.99z"/><path d="M10.485 16.141l5.656-5.656.707.707-5.656 5.656z"/></g></svg>';
    },
    42650: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M19.76 6.07l-.7.7a13.4 13.4 0 011.93 2.47c.19.3.33.55.42.72l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02a5.1 5.1 0 00-.15-.28 16 16 0 00-2.53-3.41zM6.24 13.93l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41zm6.09-.43a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm-1.97-3.69l-.93.93a3.6 3.6 0 014.24-4.24l-.95.95a2.6 2.6 0 00-2.36 2.36zm11.29 7.84l-.8.79a1.5 1.5 0 000 2.12l.59.59a1.5 1.5 0 002.12 0l1.8-1.8-.71-.7-1.8 1.79a.5.5 0 01-.7 0l-.59-.59a.5.5 0 010-.7l.8-.8-.71-.7zm-5.5 3.5l.35.35-.35-.35.01-.02.02-.02.02-.02a4.68 4.68 0 01.65-.5c.4-.27 1-.59 1.65-.59.66 0 1.28.33 1.73.77.44.45.77 1.07.77 1.73a2.5 2.5 0 01-.77 1.73 2.5 2.5 0 01-1.73.77h-4a.5.5 0 01-.42-.78l1-1.5 1-1.5a.5.5 0 01.07-.07zm.74.67a3.46 3.46 0 01.51-.4c.35-.24.75-.42 1.1-.42.34 0 .72.17 1.02.48.3.3.48.68.48 1.02 0 .34-.17.72-.48 1.02-.3.3-.68.48-1.02.48h-3.07l.49-.72.97-1.46zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>';
    },
    75895: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M16.47 3.7A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76zm-7.04 7.04l.93-.93a2.6 2.6 0 012.36-2.36l.95-.95a3.6 3.6 0 00-4.24 4.24zm.1 5.56c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02-.02-.03-.01-.03a9.5 9.5 0 00-.57-1 16 16 0 00-2.08-2.63l-.7.7.27.29a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76zm2.8-2.8a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm7.9 3.73c-.12.12-.23.35-.23.77v2h1v1h-1v2c0 .58-.14 1.1-.52 1.48-.38.38-.9.52-1.48.52s-1.1-.14-1.48-.52c-.38-.38-.52-.9-.52-1.48h1c0 .42.1.65.23.77.12.12.35.23.77.23.42 0 .65-.1.77-.23.12-.12.23-.35.23-.77v-2h-1v-1h1v-2c0-.58.14-1.1.52-1.48.38-.38.9-.52 1.48-.52s1.1.14 1.48.52c.38.38.52.9.52 1.48h-1c0-.42-.1-.65-.23-.77-.12-.12-.35-.23-.77-.23-.42 0-.65.1-.77.23zm2.56 6.27l-1.14-1.15.7-.7 1.15 1.14 1.15-1.14.7.7-1.14 1.15 1.14 1.15-.7.7-1.15-1.14-1.15 1.14-.7-.7 1.14-1.15zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>';
    },
    65162: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5.5 18.2L21.2 2.5l-.7-.7L4.8 17.5l.7.7zM19.05 6.78l.71-.7a14.26 14.26 0 0 1 2.08 2.64 14.26 14.26 0 0 1 .6 1.05v.02h.01L22 10l.45.22-.01.02a5.18 5.18 0 0 1-.15.28 16 16 0 0 1-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-1.29 0-2.44-.3-3.47-.76l.76-.76c.83.32 1.73.52 2.71.52 2.73 0 4.85-1.53 6.33-3.12a15.01 15.01 0 0 0 2.08-2.9l.03-.04-.03-.04a15 15 0 0 0-2.36-3.18zM22 10l.45-.22.1.22-.1.22L22 10zM6.94 13.23l-.7.7a14.24 14.24 0 0 1-2.08-2.64 14.28 14.28 0 0 1-.6-1.05v-.02h-.01L4 10l-.45-.22.01-.02a5.55 5.55 0 0 1 .15-.28 16 16 0 0 1 2.23-3.1C7.5 4.69 9.88 2.94 13 2.94c1.29 0 2.44.3 3.47.76l-.76.76A7.27 7.27 0 0 0 13 3.94c-2.73 0-4.85 1.53-6.33 3.12a15 15 0 0 0-2.08 2.9l-.03.04.03.04a15.01 15.01 0 0 0 2.36 3.18zM4 10l-.45.22-.1-.22.1-.22L4 10zm9 3.56c-.23 0-.46-.02-.67-.06l.95-.95a2.6 2.6 0 0 0 2.36-2.36l.93-.93a3.6 3.6 0 0 1-3.57 4.3zm-3.57-2.82l.93-.93a2.6 2.6 0 0 1 2.36-2.36l.95-.95a3.6 3.6 0 0 0-4.24 4.24zM17.5 21.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zM18.58 19.22a.5.5 0 0 1 .7-.14L22 20.9l2.72-1.82a.5.5 0 0 1 .56.84L22 22.1l-3.28-2.18a.5.5 0 0 1-.14-.7z"/></svg>';
    },
    65186: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h6V9a3 3 0 0 0-3-3zm4 6V9a4 4 0 0 0-8 0v3H8.5A2.5 2.5 0 0 0 6 14.5v7A2.5 2.5 0 0 0 8.5 24h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H18zm-5 5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>';
    },
    91244: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 6 21.5v-7A2.5 2.5 0 0 1 8.5 12H10V9a4 4 0 0 1 8 0h-1a3 3 0 0 0-3-3zm-1 11a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>';
    },
    45820: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>';
    },
    93756: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76l-.41-.72-.03-.04.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12 2.73 0 4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-2.73 0-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a5.04 5.04 0 01-.15.28 16.01 16.01 0 01-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-3.12 0-5.5-1.75-7.06-3.44a16 16 0 01-2.38-3.38v-.02h-.01L4 10l-.45-.22.01-.02a5.4 5.4 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.88 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16.01 16.01 0 012.38 3.38v.02h.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10 3.6 3.6 0 0013 13.56c2 0 3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zm7.85 12l.8-.8.7.71-.79.8a.5.5 0 000 .7l.59.59c.2.2.5.2.7 0l1.8-1.8.7.71-1.79 1.8a1.5 1.5 0 01-2.12 0l-.59-.59a1.5 1.5 0 010-2.12zM16.5 21.5l-.35-.35a.5.5 0 00-.07.07l-1 1.5-1 1.5a.5.5 0 00.42.78h4a2.5 2.5 0 001.73-.77A2.5 2.5 0 0021 22.5a2.5 2.5 0 00-.77-1.73A2.5 2.5 0 0018.5 20a3.1 3.1 0 00-1.65.58 5.28 5.28 0 00-.69.55v.01h-.01l.35.36zm.39.32l-.97 1.46-.49.72h3.07c.34 0 .72-.17 1.02-.48.3-.3.48-.68.48-1.02 0-.34-.17-.72-.48-1.02-.3-.3-.68-.48-1.02-.48-.35 0-.75.18-1.1.42a4.27 4.27 0 00-.51.4z"/></svg>';
    },
    42321: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76a13.27 13.27 0 01-.41-.72L4.56 10l.03-.04a15 15 0 012.08-2.9c1.48-1.6 3.6-3.12 6.33-3.12s4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.08 2.9c-1.48 1.6-3.6 3.12-6.33 3.12s-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a14.3 14.3 0 01-.6 1.05c-.4.64-1 1.48-1.78 2.33-1.56 1.7-3.94 3.44-7.06 3.44s-5.5-1.75-7.06-3.44a16 16 0 01-2.23-3.1 9.39 9.39 0 01-.15-.28v-.02h-.01L4 10l-.45-.22.01-.02a5.59 5.59 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.87 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16 16 0 012.23 3.1 9.5 9.5 0 01.15.28v.01l.01.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10c0 1.98 1.65 3.56 3.65 3.56s3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zM20 18c0-.42.1-.65.23-.77.12-.13.35-.23.77-.23.42 0 .65.1.77.23.13.12.23.35.23.77h1c0-.58-.14-1.1-.52-1.48-.38-.38-.9-.52-1.48-.52s-1.1.14-1.48.52c-.37.38-.52.9-.52 1.48v2h-1v1h1v2c0 .42-.1.65-.23.77-.12.13-.35.23-.77.23-.42 0-.65-.1-.77-.23-.13-.12-.23-.35-.23-.77h-1c0 .58.14 1.1.52 1.48.38.37.9.52 1.48.52s1.1-.14 1.48-.52c.37-.38.52-.9.52-1.48v-2h1v-1h-1v-2zm1.65 4.35l1.14 1.15-1.14 1.15.7.7 1.15-1.14 1.15 1.14.7-.7-1.14-1.15 1.14-1.15-.7-.7-1.15 1.14-1.15-1.14-.7.7z"/></svg>';
    },
    57313: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.5 10a8.46 8.46 0 0 0 .46.8c.38.6.94 1.4 1.68 2.19 1.48 1.6 3.62 3.13 6.36 3.13s4.88-1.53 6.36-3.13A15.07 15.07 0 0 0 21.5 10a7.41 7.41 0 0 0-.46-.8c-.38-.6-.94-1.4-1.68-2.19-1.48-1.6-3.62-3.13-6.36-3.13S8.12 5.4 6.64 7A15.07 15.07 0 0 0 4.5 10zM22 10l.41-.19-.4.19zm0 0l.41.19-.4-.19zm.41.19l.09-.19-.09-.19-.01-.02a6.86 6.86 0 0 0-.15-.28c-.1-.18-.25-.45-.45-.76-.4-.64-.99-1.48-1.77-2.32C18.47 4.74 16.11 3 13 3 9.89 3 7.53 4.74 5.97 6.43A15.94 15.94 0 0 0 3.6 9.79v.02h-.01L3.5 10l.09.19.01.02a6.59 6.59 0 0 0 .15.28c.1.18.25.45.45.76.4.64.99 1.48 1.77 2.32C7.53 15.26 9.89 17 13 17c3.11 0 5.47-1.74 7.03-3.43a15.94 15.94 0 0 0 2.37-3.36v-.02h.01zM4 10l-.41-.19.4.19zm9-2.63c-1.5 0-2.7 1.18-2.7 2.63s1.2 2.63 2.7 2.63c1.5 0 2.7-1.18 2.7-2.63S14.5 7.37 13 7.37zM9.4 10C9.4 8.07 11 6.5 13 6.5s3.6 1.57 3.6 3.5S15 13.5 13 13.5A3.55 3.55 0 0 1 9.4 10zm8.1 11.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zm1.78-2.82a.5.5 0 0 0-.56.84L22 22.1l3.28-2.18a.5.5 0 1 0-.56-.84L22 20.9l-2.72-1.82z"/></svg>';
    },
    6894: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/><path d="M13 16V9h-1v7z"/></svg>';
    },
    45360: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/></svg>';
    },
    14665: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>';
    },
    39146: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path fill="currentColor" d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"/></svg>';
    },
    48010: (o) => {
      o.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none"><path stroke="currentColor" d="M9 2.13l1.903 3.855.116.236.26.038 4.255.618-3.079 3.001-.188.184.044.259.727 4.237-3.805-2L9 12.434l-.233.122-3.805 2.001.727-4.237.044-.26-.188-.183-3.079-3.001 4.255-.618.26-.038.116-.236L9 2.13z"/></svg>';
    },
  },
]);
