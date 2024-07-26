import { toRaw } from 'vue';
import { shallowMount } from '@vue/test-utils';
import LayerListItem from '@/components/layerlist/LayerListItem';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

const osmLayer = new TileLayer({
  lid: 'osm',
  source: new OSM()
});

const view = new View({
  projection: 'EPSG:3857',
  center: [0, 0],
  zoom: 2
});

const moduleProps = {
  mapView: view,
  layer: osmLayer,
  showLegends: true,
  showOpacityControls: true,
  openedListItems: []
};

function createWrapper (props = moduleProps) {
  return shallowMount(LayerListItem, {
    props
  });
}

describe('layerlist/LayerListItem.vue', () => {
  let comp;
  let vm;

  it('is defined', () => {
    expect(LayerListItem).to.not.be.an('undefined');
  });

  describe('props', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct props', () => {
      expect(toRaw(vm.mapView)).to.equal(view);
      expect(toRaw(vm.layer)).to.equal(osmLayer);
      expect(vm.showLegends).to.equal(true);
      expect(vm.showOpacityControls).to.equal(true);
      expect(vm.openedListItems).to.be.an('array');
      expect(vm.openedListItems.length).to.eql(0);
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
      expect(vm.open).to.equal(false);
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

    it('are implemented', () => {
      expect(typeof vm.onItemClick).to.equal('function');
    });

    it('onItemClick toggles layer visibility', () => {
      expect(osmLayer.getVisible()).to.equal(true);
      vm.onItemClick();
      expect(osmLayer.getVisible()).to.equal(false);
    });

    afterEach(() => {
      comp.unmount();
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      comp = createWrapper();
      vm = comp.vm;
    });

    it('has correct showLegend property for layer', async () => {
      expect(vm.showLegend).to.equal(false);

      const osmLayer2 = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        legend: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.showLegend).to.equal(true);
    });

    it('has correct showOpacityControl property for layer', async () => {
      expect(vm.showOpacityControl).to.equal(false);

      const osmLayer2 = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        opacityControl: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.showOpacityControl).to.equal(true);
    });

    it('has correct showDetails property for layer', async () => {
      expect(vm.showDetails).to.equal(false);

      const osmLayer2 = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        legend: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.showDetails).to.equal(true);

      const osmLayer3 = new TileLayer({
        lid: 'osm3',
        source: new OSM(),
        opacityControl: true
      });
      comp.setProps({ layer: osmLayer3 });
      expect(vm.showDetails).to.equal(true);
    });

    it('has correct layerLid property for layer', async () => {
      expect(vm.layerLid).to.equal('osm');

      const osmLayer2 = new TileLayer({
        lid: 'osm2',
        source: new OSM(),
        legend: true
      });
      await comp.setProps({ layer: osmLayer2 });
      expect(vm.layerLid).to.equal('osm2');
    });

    afterEach(() => {
      comp.unmount();
    });
  });
});
