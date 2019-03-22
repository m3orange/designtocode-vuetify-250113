/**
 * Maskable
 *
 * @mixin
 *
 * Creates an input mask that is
 * generated from a masked str
 *
 * Example: mask="#### #### #### ####"
 */
import { isMaskDelimiter, maskText, unmaskText } from '../util/mask';
/* @vue/component */
export default {
    name: 'maskable',
    props: {
        dontFillMaskBlanks: Boolean,
        mask: {
            type: [Object, String],
            default: null
        },
        returnMaskedValue: Boolean,
        value: { required: false }
    },
    data: function (vm) {
        return ({
            selection: 0,
            lazySelection: 0,
            lazyValue: vm.value,
            preDefined: {
                'credit-card': '#### - #### - #### - ####',
                'date': '##/##/####',
                'date-with-time': '##/##/#### ##:##',
                'phone': '(###) ### - ####',
                'social': '###-##-####',
                'time': '##:##',
                'time-with-seconds': '##:##:##'
            }
        });
    },
    computed: {
        masked: function () {
            var preDefined = this.preDefined[this.mask];
            var mask = preDefined || this.mask || '';
            return mask.split('');
        }
    },
    watch: {
        /**
         * Make sure the cursor is in the correct
         * location when the mask changes
         */
        mask: function () {
            var _this = this;
            if (!this.$refs.input)
                return;
            var oldValue = this.$refs.input.value;
            var newValue = this.maskText(unmaskText(this.lazyValue));
            var position = 0;
            var selection = this.selection;
            for (var index = 0; index < selection; index++) {
                isMaskDelimiter(oldValue[index]) || position++;
            }
            selection = 0;
            if (newValue) {
                for (var index = 0; index < newValue.length; index++) {
                    isMaskDelimiter(newValue[index]) || position--;
                    selection++;
                    if (position <= 0)
                        break;
                }
            }
            this.$nextTick(function () {
                _this.$refs.input.value = newValue;
                _this.setCaretPosition(selection);
            });
        }
    },
    beforeMount: function () {
        if (!this.mask ||
            this.value == null ||
            !this.returnMaskedValue)
            return;
        var value = this.maskText(this.value);
        // See if masked value does not
        // match the user given value
        if (value === this.value)
            return;
        this.$emit('input', value);
    },
    methods: {
        setCaretPosition: function (selection) {
            var _this = this;
            this.selection = selection;
            window.setTimeout(function () {
                _this.$refs.input && _this.$refs.input.setSelectionRange(_this.selection, _this.selection);
            }, 0);
        },
        updateRange: function () {
            /* istanbul ignore next */
            if (!this.$refs.input)
                return;
            var newValue = this.maskText(this.lazyValue);
            var selection = 0;
            this.$refs.input.value = newValue;
            if (newValue) {
                for (var index = 0; index < newValue.length; index++) {
                    if (this.lazySelection <= 0)
                        break;
                    isMaskDelimiter(newValue[index]) || this.lazySelection--;
                    selection++;
                }
            }
            this.setCaretPosition(selection);
            // this.$emit() must occur only when all internal values are correct
            this.$emit('input', this.returnMaskedValue ? this.$refs.input.value : this.lazyValue);
        },
        maskText: function (text) {
            return this.mask ? maskText(text, this.masked, this.dontFillMaskBlanks) : text;
        },
        unmaskText: function (text) {
            return this.mask && !this.returnMaskedValue ? unmaskText(text) : text;
        },
        // When the input changes and is
        // re-created, ensure that the
        // caret location is correct
        setSelectionRange: function () {
            this.$nextTick(this.updateRange);
        },
        resetSelections: function (input) {
            if (!input.selectionEnd)
                return;
            this.selection = input.selectionEnd;
            this.lazySelection = 0;
            for (var index = 0; index < this.selection; index++) {
                isMaskDelimiter(input.value[index]) || this.lazySelection++;
            }
        }
    }
};
//# sourceMappingURL=maskable.js.map
//# sourceMappingURL=maskable.js.map
//# sourceMappingURL=maskable.js.map
//# sourceMappingURL=maskable.js.map
//# sourceMappingURL=maskable.js.map