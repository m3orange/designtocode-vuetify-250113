import '../../stylus/components/_avatars.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable).extend({
    name: 'v-avatar',
    functional: true,
    props: {
        // TODO: inherit these
        color: String,
        size: {
            type: [Number, String],
            default: 48
        },
        tile: Boolean
    },
    render(h, { data, props, children }) {
        data.staticClass = (`v-avatar ${data.staticClass || ''}`).trim();
        if (props.tile)
            data.staticClass += ' v-avatar--tile';
        const size = convertToUnit(props.size);
        data.style = {
            height: size,
            width: size,
            ...data.style
        };
        return h('div', Colorable.options.methods.setBackgroundColor(props.color, data), children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF2YXRhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdmF0YXIvVkF2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHVDQUF1QyxDQUFBO0FBRTlDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFJbEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUUsSUFBSTtJQUVoQixLQUFLLEVBQUU7UUFDTCxzQkFBc0I7UUFDdEIsS0FBSyxFQUFFLE1BQU07UUFFYixJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkO0lBRUQsTUFBTSxDQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxZQUFZLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUVoRSxJQUFJLEtBQUssQ0FBQyxJQUFJO1lBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxpQkFBaUIsQ0FBQTtRQUVyRCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUssRUFBRSxJQUFJO1lBQ1gsR0FBRyxJQUFJLENBQUMsS0FBSztTQUNkLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUM1RixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fYXZhdGFycy5zdHlsJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoQ29sb3JhYmxlKS5leHRlbmQoe1xuICBuYW1lOiAndi1hdmF0YXInLFxuXG4gIGZ1bmN0aW9uYWw6IHRydWUsXG5cbiAgcHJvcHM6IHtcbiAgICAvLyBUT0RPOiBpbmhlcml0IHRoZXNlXG4gICAgY29sb3I6IFN0cmluZyxcblxuICAgIHNpemU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA0OFxuICAgIH0sXG4gICAgdGlsZTogQm9vbGVhblxuICB9LFxuXG4gIHJlbmRlciAoaCwgeyBkYXRhLCBwcm9wcywgY2hpbGRyZW4gfSk6IFZOb2RlIHtcbiAgICBkYXRhLnN0YXRpY0NsYXNzID0gKGB2LWF2YXRhciAke2RhdGEuc3RhdGljQ2xhc3MgfHwgJyd9YCkudHJpbSgpXG5cbiAgICBpZiAocHJvcHMudGlsZSkgZGF0YS5zdGF0aWNDbGFzcyArPSAnIHYtYXZhdGFyLS10aWxlJ1xuXG4gICAgY29uc3Qgc2l6ZSA9IGNvbnZlcnRUb1VuaXQocHJvcHMuc2l6ZSlcbiAgICBkYXRhLnN0eWxlID0ge1xuICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAuLi5kYXRhLnN0eWxlXG4gICAgfVxuXG4gICAgcmV0dXJuIGgoJ2RpdicsIENvbG9yYWJsZS5vcHRpb25zLm1ldGhvZHMuc2V0QmFja2dyb3VuZENvbG9yKHByb3BzLmNvbG9yLCBkYXRhKSwgY2hpbGRyZW4pXG4gIH1cbn0pXG4iXX0=