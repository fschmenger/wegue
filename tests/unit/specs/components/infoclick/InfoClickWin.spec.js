import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { bindMap, unbindMap } from '@/composables/Map';
import InfoClickWin from '@/components/infoclick/InfoClickWin';
import OlMap from 'ol/Map';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Point from 'ol/geom/Point'

function createWrapper () {
  return shallowMount(InfoClickWin);
}

describe('infoclick/InfoClickWin.vue', () => {
  let comp;
  let vm;

  // Inspect the raw component options
  it('is defined', () => {
    expect(typeof InfoClickWin).to.not.equal('undefined');
  });

  // it('has a created hook', () => {
  //   expect(typeof InfoClickWin.created).to.equal('function');
  // });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('md:info');
      expect(vm.showMedia).to.equal(false);
      expect(vm.mediaInfoLinkUrlProp).to.equal(undefined);
      expect(vm.imageProp).to.equal(undefined);
      expect(vm.imageDescriptionProp).to.equal(undefined);
    });
  });

  describe('data', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct default data', () => {
      expect(vm.attributeData).to.equal(null);
      expect(vm.coordsData).to.equal(null);
    });
  });

  describe('methods', () => {
    let map;

    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('are implemented', () => {
      expect(typeof vm.onMapClick).to.equal('function');
    });

    it('onMapClick sets correct data if no feature found', () => {
      const mockEvt = {
        pixel: [0, 0],
        coordinate: [8, 8]
      };
      map = new OlMap();
      bindMap(map);
      // vm.map = map;
      vm.onMapClick(mockEvt);
      expect(vm.attributeData).to.equal(null);
      expect(toRaw(vm.coordsData.coordinate)).to.equal(mockEvt.coordinate);
      expect(toRaw(vm.coordsData.projection)).to.equal('EPSG:3857');
    });

    it('onMapClick sets correct data if we have features found', () => {
      const mockEvt = {
        pixel: [0, 0],
        coordinate: [0, 0]
      };
      const feat = new Feature({
        geometry: new Point(mockEvt.coordinate),
        foo: 'bar'
      });
      const layer = new VectorLayer({
        source: new VectorSource({
          features: [feat]
        })
      });
      map = new OlMap({
        layers: [layer]
      });
      map.forEachFeatureAtPixel = () => {
        vm.features.push([feat, layer]);
      };
      // vm.map = map;
      bindMap(map);
      vm.onMapClick(mockEvt);
      expect(vm.attributeData.foo).to.equal('bar');
      expect(toRaw(vm.coordsData.coordinate)).to.equal(mockEvt.coordinate);
      expect(toRaw(vm.coordsData.projection)).to.equal('EPSG:3857');
    });

    it('show resets data when module is closed', () => {
      // vm.map = new OlMap({});
      map = new OlMap();
      bindMap(map);
      vm.show(true);
      vm.show(false);
      expect(vm.attributeData).to.equal(null);
      expect(vm.coordsData).to.equal(null);
    });

    it('show registers map click when module is opened', () => {
      map = new OlMap();
      bindMap(map);
      // vm.map = map;
      const onSPy = sinon.replace(map, 'on', sinon.fake(map.on));

      vm.show(false);
      vm.show(true);

      expect(onSPy).to.have.been.calledOnceWithExactly('singleclick', vm.onMapClick);
    });

    it('show unregisters map click when module is closed', () => {
      map = new OlMap();
      bindMap(map);
      // vm.map = map;
      const unSPy = sinon.replace(map, 'un', sinon.fake(map.un));

      vm.show(true);
      vm.show(false);

      expect(unSPy).to.have.been.calledOnceWithExactly('singleclick', vm.onMapClick);
    });

    afterEach(() => {
      sinon.restore();
      unbindMap();
      map = undefined;
      comp.unmount();
    });
  });
});
