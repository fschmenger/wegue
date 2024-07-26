import { mount } from '@vue/test-utils';
import ThemeSwitcher from '@/components/themeswitcher/ThemeSwitcher';

const defaultProps = {
  moduleName: 'wgu-toolbar',
  icon: 'md:dark_mode'
}

function createWrapper (props = defaultProps) {
  return mount(ThemeSwitcher, {
    props
  });
}

describe('themeswitcher/ThemeSwitcher.vue', () => {
  let comp;
  let vm;
  let button;

  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof ThemeSwitcher).to.not.equal('undefined');
  });

  describe('configured', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.moduleName).to.equal('wgu-toolbar');
      expect(vm.icon).to.equal('md:dark_mode');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('theme switching', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
      button = comp.find('.v-btn');
    });

    it('start with light theme', () => {
      expect(vm.theme.global.name.value).to.equal('light');
    });

    it('switch to dark theme', async () => {
      await button.trigger('click');
      expect(vm.theme.global.name.value).to.equal('dark');
    });

    it('switch back to light theme', async () => {
      expect(vm.theme.global.name.value).to.equal('light');

      await button.trigger('click');
      expect(vm.theme.global.name.value).to.equal('dark');

      await button.trigger('click');
      expect(vm.theme.global.name.value).to.equal('light');
    });

    afterEach(() => {
      comp.vm.theme.global.name.value = 'light';
      comp.unmount();
    });
  });
});
