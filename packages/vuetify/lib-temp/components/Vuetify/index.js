import OurVue from 'vue';
import application from './mixins/application';
import breakpoint from './mixins/breakpoint';
import theme from './mixins/theme';
import icons from './mixins/icons';
import options from './mixins/options';
import genLang from './mixins/lang';
import goTo from './util/goTo';
// Utils
import { consoleWarn, consoleError } from '../../util/console';
const Vuetify = {
    install(Vue, opts = {}) {
        if (this.installed)
            return;
        this.installed = true;
        if (OurVue !== Vue) {
            consoleError('Multiple instances of Vue detected\nSee https://github.com/vuetifyjs/vuetify/issues/4068\n\nIf you\'re seeing "$attrs is readonly", it\'s caused by this');
        }
        checkVueVersion(Vue);
        const lang = genLang(opts.lang);
        Vue.prototype.$vuetify = new Vue({
            mixins: [
                breakpoint
            ],
            data: {
                application,
                dark: false,
                icons: icons(opts.iconfont, opts.icons),
                lang,
                options: options(opts.options),
                rtl: opts.rtl,
                theme: theme(opts.theme)
            },
            methods: {
                goTo,
                t: lang.t.bind(lang)
            }
        });
        if (opts.directives) {
            for (const name in opts.directives) {
                Vue.directive(name, opts.directives[name]);
            }
        }
        (function registerComponents(components) {
            if (components) {
                for (const key in components) {
                    const component = components[key];
                    if (component && !registerComponents(component.$_vuetify_subcomponents)) {
                        Vue.component(key, component);
                    }
                }
                return true;
            }
            return false;
        })(opts.components);
    },
    version: __VUETIFY_VERSION__
};
export function checkVueVersion(Vue, requiredVue) {
    const vueDep = requiredVue || __REQUIRED_VUE__;
    const required = vueDep.split('.', 3).map(v => v.replace(/\D/g, '')).map(Number);
    const actual = Vue.version.split('.', 3).map(n => parseInt(n, 10));
    // Simple semver caret range comparison
    const passes = actual[0] === required[0] && // major matches
        (actual[1] > required[1] || // minor is greater
            (actual[1] === required[1] && actual[2] >= required[2]) // or minor is eq and patch is >=
        );
    if (!passes) {
        consoleWarn(`Vuetify requires Vue version ${vueDep}`);
    }
}
export default Vuetify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WdWV0aWZ5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLEtBQUssQ0FBQTtBQUV4QixPQUFPLFdBQVcsTUFBTSxzQkFBc0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSxxQkFBcUIsQ0FBQTtBQUM1QyxPQUFPLEtBQUssTUFBTSxnQkFBZ0IsQ0FBQTtBQUNsQyxPQUFPLEtBQUssTUFBTSxnQkFBZ0IsQ0FBQTtBQUNsQyxPQUFPLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQTtBQUN0QyxPQUFPLE9BQU8sTUFBTSxlQUFlLENBQUE7QUFDbkMsT0FBTyxJQUFJLE1BQU0sYUFBYSxDQUFBO0FBRTlCLFFBQVE7QUFDUixPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBTTlELE1BQU0sT0FBTyxHQUFrQjtJQUM3QixPQUFPLENBQUUsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ3JCLElBQUssSUFBWSxDQUFDLFNBQVM7WUFBRSxPQUM1QjtRQUFDLElBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO1FBRS9CLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUNsQixZQUFZLENBQUMsMEpBQTBKLENBQUMsQ0FBQTtTQUN6SztRQUVELGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVwQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRS9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDO1lBQy9CLE1BQU0sRUFBRTtnQkFDTixVQUFVO2FBQ1g7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osV0FBVztnQkFDWCxJQUFJLEVBQUUsS0FBSztnQkFDWCxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDdkMsSUFBSTtnQkFDSixPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzlCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDekI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSTtnQkFDSixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2FBQzNDO1NBQ0Y7UUFFRCxDQUFDLFNBQVMsa0JBQWtCLENBQUUsVUFBMkM7WUFDdkUsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7b0JBQzVCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDakMsSUFBSSxTQUFTLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsRUFBRTt3QkFDdkUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBdUIsQ0FBQyxDQUFBO3FCQUM1QztpQkFDRjtnQkFDRCxPQUFPLElBQUksQ0FBQTthQUNaO1lBQ0QsT0FBTyxLQUFLLENBQUE7UUFDZCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDckIsQ0FBQztJQUNELE9BQU8sRUFBRSxtQkFBbUI7Q0FDN0IsQ0FBQTtBQUVELE1BQU0sVUFBVSxlQUFlLENBQUUsR0FBbUIsRUFBRSxXQUFvQjtJQUN4RSxNQUFNLE1BQU0sR0FBRyxXQUFXLElBQUksZ0JBQWdCLENBQUE7SUFFOUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDaEYsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUVsRSx1Q0FBdUM7SUFDdkMsTUFBTSxNQUFNLEdBQ1YsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0I7UUFDN0MsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLG1CQUFtQjtZQUM3QyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztTQUMxRixDQUFBO0lBRUgsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLFdBQVcsQ0FBQyxnQ0FBZ0MsTUFBTSxFQUFFLENBQUMsQ0FBQTtLQUN0RDtBQUNILENBQUM7QUFFRCxlQUFlLE9BQU8sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPdXJWdWUgZnJvbSAndnVlJ1xuXG5pbXBvcnQgYXBwbGljYXRpb24gZnJvbSAnLi9taXhpbnMvYXBwbGljYXRpb24nXG5pbXBvcnQgYnJlYWtwb2ludCBmcm9tICcuL21peGlucy9icmVha3BvaW50J1xuaW1wb3J0IHRoZW1lIGZyb20gJy4vbWl4aW5zL3RoZW1lJ1xuaW1wb3J0IGljb25zIGZyb20gJy4vbWl4aW5zL2ljb25zJ1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi9taXhpbnMvb3B0aW9ucydcbmltcG9ydCBnZW5MYW5nIGZyb20gJy4vbWl4aW5zL2xhbmcnXG5pbXBvcnQgZ29UbyBmcm9tICcuL3V0aWwvZ29UbydcblxuLy8gVXRpbHNcbmltcG9ydCB7IGNvbnNvbGVXYXJuLCBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWdWVDb25zdHJ1Y3RvciB9IGZyb20gJ3Z1ZS90eXBlcydcbmltcG9ydCB7IFZ1ZXRpZnkgYXMgVnVldGlmeVBsdWdpbiwgVnVldGlmeVVzZU9wdGlvbnMgfSBmcm9tICd0eXBlcydcblxuY29uc3QgVnVldGlmeTogVnVldGlmeVBsdWdpbiA9IHtcbiAgaW5zdGFsbCAoVnVlLCBvcHRzID0ge30pIHtcbiAgICBpZiAoKHRoaXMgYXMgYW55KS5pbnN0YWxsZWQpIHJldHVyblxuICAgIDsodGhpcyBhcyBhbnkpLmluc3RhbGxlZCA9IHRydWVcblxuICAgIGlmIChPdXJWdWUgIT09IFZ1ZSkge1xuICAgICAgY29uc29sZUVycm9yKCdNdWx0aXBsZSBpbnN0YW5jZXMgb2YgVnVlIGRldGVjdGVkXFxuU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDA2OFxcblxcbklmIHlvdVxcJ3JlIHNlZWluZyBcIiRhdHRycyBpcyByZWFkb25seVwiLCBpdFxcJ3MgY2F1c2VkIGJ5IHRoaXMnKVxuICAgIH1cblxuICAgIGNoZWNrVnVlVmVyc2lvbihWdWUpXG5cbiAgICBjb25zdCBsYW5nID0gZ2VuTGFuZyhvcHRzLmxhbmcpXG5cbiAgICBWdWUucHJvdG90eXBlLiR2dWV0aWZ5ID0gbmV3IFZ1ZSh7XG4gICAgICBtaXhpbnM6IFtcbiAgICAgICAgYnJlYWtwb2ludFxuICAgICAgXSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYXBwbGljYXRpb24sXG4gICAgICAgIGRhcms6IGZhbHNlLFxuICAgICAgICBpY29uczogaWNvbnMob3B0cy5pY29uZm9udCwgb3B0cy5pY29ucyksXG4gICAgICAgIGxhbmcsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMob3B0cy5vcHRpb25zKSxcbiAgICAgICAgcnRsOiBvcHRzLnJ0bCxcbiAgICAgICAgdGhlbWU6IHRoZW1lKG9wdHMudGhlbWUpXG4gICAgICB9LFxuICAgICAgbWV0aG9kczoge1xuICAgICAgICBnb1RvLFxuICAgICAgICB0OiBsYW5nLnQuYmluZChsYW5nKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAob3B0cy5kaXJlY3RpdmVzKSB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gb3B0cy5kaXJlY3RpdmVzKSB7XG4gICAgICAgIFZ1ZS5kaXJlY3RpdmUobmFtZSwgb3B0cy5kaXJlY3RpdmVzW25hbWVdKVxuICAgICAgfVxuICAgIH1cblxuICAgIChmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudHMgKGNvbXBvbmVudHM6IFZ1ZXRpZnlVc2VPcHRpb25zWydjb21wb25lbnRzJ10pIHtcbiAgICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbXBvbmVudHMpIHtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzW2tleV1cbiAgICAgICAgICBpZiAoY29tcG9uZW50ICYmICFyZWdpc3RlckNvbXBvbmVudHMoY29tcG9uZW50LiRfdnVldGlmeV9zdWJjb21wb25lbnRzKSkge1xuICAgICAgICAgICAgVnVlLmNvbXBvbmVudChrZXksIGNvbXBvbmVudCBhcyB0eXBlb2YgVnVlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSkob3B0cy5jb21wb25lbnRzKVxuICB9LFxuICB2ZXJzaW9uOiBfX1ZVRVRJRllfVkVSU0lPTl9fXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1Z1ZVZlcnNpb24gKFZ1ZTogVnVlQ29uc3RydWN0b3IsIHJlcXVpcmVkVnVlPzogc3RyaW5nKSB7XG4gIGNvbnN0IHZ1ZURlcCA9IHJlcXVpcmVkVnVlIHx8IF9fUkVRVUlSRURfVlVFX19cblxuICBjb25zdCByZXF1aXJlZCA9IHZ1ZURlcC5zcGxpdCgnLicsIDMpLm1hcCh2ID0+IHYucmVwbGFjZSgvXFxEL2csICcnKSkubWFwKE51bWJlcilcbiAgY29uc3QgYWN0dWFsID0gVnVlLnZlcnNpb24uc3BsaXQoJy4nLCAzKS5tYXAobiA9PiBwYXJzZUludChuLCAxMCkpXG5cbiAgLy8gU2ltcGxlIHNlbXZlciBjYXJldCByYW5nZSBjb21wYXJpc29uXG4gIGNvbnN0IHBhc3NlcyA9XG4gICAgYWN0dWFsWzBdID09PSByZXF1aXJlZFswXSAmJiAvLyBtYWpvciBtYXRjaGVzXG4gICAgKGFjdHVhbFsxXSA+IHJlcXVpcmVkWzFdIHx8IC8vIG1pbm9yIGlzIGdyZWF0ZXJcbiAgICAgIChhY3R1YWxbMV0gPT09IHJlcXVpcmVkWzFdICYmIGFjdHVhbFsyXSA+PSByZXF1aXJlZFsyXSkgLy8gb3IgbWlub3IgaXMgZXEgYW5kIHBhdGNoIGlzID49XG4gICAgKVxuXG4gIGlmICghcGFzc2VzKSB7XG4gICAgY29uc29sZVdhcm4oYFZ1ZXRpZnkgcmVxdWlyZXMgVnVlIHZlcnNpb24gJHt2dWVEZXB9YClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWdWV0aWZ5XG4iXX0=