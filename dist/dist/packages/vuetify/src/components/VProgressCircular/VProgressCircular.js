import '../../stylus/components/_progress-circular.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable).extend({
    name: 'v-progress-circular',
    props: {
        button: Boolean,
        indeterminate: Boolean,
        rotate: {
            type: [Number, String],
            default: 0
        },
        size: {
            type: [Number, String],
            default: 32
        },
        width: {
            type: [Number, String],
            default: 4
        },
        value: {
            type: [Number, String],
            default: 0
        }
    },
    computed: {
        calculatedSize: function () {
            return Number(this.size) + (this.button ? 8 : 0);
        },
        circumference: function () {
            return 2 * Math.PI * this.radius;
        },
        classes: function () {
            return {
                'v-progress-circular--indeterminate': this.indeterminate,
                'v-progress-circular--button': this.button
            };
        },
        normalizedValue: function () {
            if (this.value < 0) {
                return 0;
            }
            if (this.value > 100) {
                return 100;
            }
            return parseFloat(this.value);
        },
        radius: function () {
            return 20;
        },
        strokeDashArray: function () {
            return Math.round(this.circumference * 1000) / 1000;
        },
        strokeDashOffset: function () {
            return ((100 - this.normalizedValue) / 100) * this.circumference + 'px';
        },
        strokeWidth: function () {
            return Number(this.width) / +this.size * this.viewBoxSize * 2;
        },
        styles: function () {
            return {
                height: this.calculatedSize + "px",
                width: this.calculatedSize + "px"
            };
        },
        svgStyles: function () {
            return {
                transform: "rotate(" + Number(this.rotate) + "deg)"
            };
        },
        viewBoxSize: function () {
            return this.radius / (1 - Number(this.width) / +this.size);
        }
    },
    methods: {
        genCircle: function (h, name, offset) {
            return h('circle', {
                class: "v-progress-circular__" + name,
                attrs: {
                    fill: 'transparent',
                    cx: 2 * this.viewBoxSize,
                    cy: 2 * this.viewBoxSize,
                    r: this.radius,
                    'stroke-width': this.strokeWidth,
                    'stroke-dasharray': this.strokeDashArray,
                    'stroke-dashoffset': offset
                }
            });
        },
        genSvg: function (h) {
            var children = [
                this.indeterminate || this.genCircle(h, 'underlay', 0),
                this.genCircle(h, 'overlay', this.strokeDashOffset)
            ];
            return h('svg', {
                style: this.svgStyles,
                attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: this.viewBoxSize + " " + this.viewBoxSize + " " + 2 * this.viewBoxSize + " " + 2 * this.viewBoxSize
                }
            }, children);
        }
    },
    render: function (h) {
        var info = h('div', { staticClass: 'v-progress-circular__info' }, this.$slots.default);
        var svg = this.genSvg(h);
        return h('div', this.setTextColor(this.color, {
            staticClass: 'v-progress-circular',
            attrs: {
                'role': 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
            },
            class: this.classes,
            style: this.styles,
            on: this.$listeners
        }), [svg, info]);
    }
});
//# sourceMappingURL=VProgressCircular.js.map
//# sourceMappingURL=VProgressCircular.js.map