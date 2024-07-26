import { nextTick, toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import MeasureWin from '@/components/measuretool/MeasureWin';
import OlMap from 'ol/Map';
import LineStringGeom from 'ol/geom/LineString';

function createWrapper () {
  return shallowMount(MeasureWin);
}

describe('measuretool/MeasureWin.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(typeof MeasureWin).to.not.equal('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:photo_size_select_small');
      expect(vm.showAngleTool).to.equal(false);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.moduleName).to.equal('wgu-measuretool');
      expect(vm.measureGeom).to.equal(null);
      expect(vm.measureType).to.equal('distance');
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('watchers - measureType', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('watches measureType resets old data', async () => {
      vm.map = new OlMap({});
      vm.onMapBound();
      vm.measureType = 'area';
      await nextTick();

      expect(vm.measureGeom).to.be.an('object').that.is.empty;
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('show resets map interaction when module is closed', () => {
      let cnt = 0;
      const mockFn = () => {
        cnt++;
      };

      vm.map = new OlMap({});
      vm.onMapBound();
      vm.olMapCtrl.removeInteraction = mockFn;

      vm.show(true);
      vm.show(false);
      expect(cnt).to.equal(1);
    });

    it('show registers map interaction when module is opened', () => {
      let cnt = 0;
      const mockFn = () => {
        cnt++;
      };
      vm.map = new OlMap({});
      vm.onMapBound();
      vm.olMapCtrl.addInteraction = mockFn;

      vm.show(false);
      vm.show(true);
      expect(cnt).to.equal(1);
    });

    it('are implemented', () => {
      expect(typeof vm.applyMeasureType).to.equal('function');
      expect(typeof vm.onMeasureVertexSet).to.equal('function');
    });

    it('applyMeasureType sets measureType', () => {
      vm.applyMeasureType('kalle');
      expect(vm.measureType).to.equal('kalle');
    });

    it('onMeasureVertexSet sets measureGeom object', () => {
      const lineGeom = new LineStringGeom([[0, 0], [1000, 0], [1000, 1000], [0, 1000]]);
      vm.onMeasureVertexSet(lineGeom);
      expect(toRaw(vm.measureGeom.geom)).to.equal(lineGeom);
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
