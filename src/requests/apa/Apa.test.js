import Apa from './Apa';
import Translator from './Translator';
import Metadata from './Metadata';
import { expect } from 'chai';

describe('testing apa class', () => {
  const dataDemo = {
    key0: 'value 0',
    key1: 'value 1',
    key2: 'value 2'
  };

  test('testing data attribute', () => {
    const apa = new Apa(dataDemo);

    expect(apa.data).to.have.property('key0', 'value 0');
  });

  test('add method', () => {
    const apa = new Apa(dataDemo);

    expect(apa.data).to.not.have.property('newKey', 'new value');
    apa.add({ newKey: 'new value' });
    expect(apa.data).to.have.property('newKey', 'new value');
  });

  test('remove method', () => {
    const apa = new Apa(dataDemo);

    apa.add({ newKey: 'new value' });
    expect(apa.data).to.have.property('newKey', 'new value');
    apa.remove('newKey');
    expect(apa.data).to.not.have.property('newKey', 'new value');
  });

  test('all method', () => {
    const apa = new Apa(dataDemo);

    expect(apa.all()).to.deep.equal(dataDemo);
  });

  test('setData method', () => {
    const apa = new Apa(dataDemo);
    const newData = {
      newKey0: 'new value 0',
      newKey1: 'new value 1',
      newKey2: 'new value 2',
    };

    expect(apa.all()).to.deep.equal(dataDemo);
    apa.setData(newData);
    expect(apa.all()).to.deep.equal(newData);
  });

  test('replaceAll method', () => {
    const apa = new Apa(dataDemo);
    const newData = {
      newKey0: 'new value 0',
      newKey1: 'new value 1',
      newKey2: 'new value 2',
    };

    expect(apa.all()).to.deep.equal(dataDemo);
    apa.replaceAll(newData);
    expect(apa.all()).to.deep.equal(newData);
  });

  test('get method', () => {
    const apa = new Apa(dataDemo);

    const val1 = apa.get('key1');
    expect(val1).to.equal('value 1');
  });

  test('set method', () => {
    const apa = new Apa(dataDemo);

    expect(apa.get('key1')).to.equal('value 1');
    apa.set('key1', 'new value 1');
    expect(apa.get('key1')).to.equal('new value 1');
  });
});

describe('testing Translator class', () => {
  test('testing country attribute', () => {
    Translator.setCountry('mexico');
    expect(Translator.country).to.equal('mexico');
  });

  test('testing setCountry method', () => {
    Translator.setCountry('mexico');
    expect(Translator.country).to.equal('mexico');
    Translator.setCountry('colombia');
    expect(Translator.country).to.equal('colombia');
  });

  test('testing getCountry method', () => {
    Translator.setCountry('mexico');
    expect(Translator.getCountry()).to.equal('mexico');
  });
});

describe('testing Metadata class', () => {
  const dataDemo = {
    key0: 'value 0',
    key1: 'value 1',
    key2: 'value 2',
    translations: '{"language":{"mexico":{"key0":"value 0", "key1":"value 1"}}}'
  };

  test('testing setData method', () => {
    Metadata.setData(dataDemo);

    expect(Metadata.all()).to.deep.equal(dataDemo);
    expect(Translator.getCountry()).to.equal('mexico');

    expect(Translator.get('key0')).to.equal('value 0');
  });

  test('testing replace method', () => {
    Metadata.replaceAll(dataDemo);

    expect(Metadata.all()).to.deep.equal(dataDemo);
    expect(Translator.getCountry()).to.equal('mexico');

    expect(Translator.get('key0')).to.equal('value 0');
  });
});
