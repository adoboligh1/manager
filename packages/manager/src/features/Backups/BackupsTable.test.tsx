import { shallow } from 'enzyme';
import * as React from 'react';
import { TableRowLoading } from 'src/components/TableRowLoading/TableRowLoading';
import * as linodes from 'src/__data__/linodes';
import * as types from 'src/__data__/types';
import { BackupsTable } from './BackupsTable';
import { ExtendedLinode } from './types';

const type = types.types[0];

const linode1: ExtendedLinode = { ...linodes.linode1, typeInfo: type };
const linode2: ExtendedLinode = { ...linodes.linode2, typeInfo: type };

const component = shallow(<BackupsTable linodes={[]} loading={true} />);

describe('BackupsTable component', () => {
  it('should render', () => {
    expect(component).toBeDefined();
  });
  it('should display a loading spinner', () => {
    expect(
      component.containsMatchingElement(<TableRowLoading columns={3} />)
    ).toBeTruthy();
  });
  it('should display linodes', () => {
    expect(component.find('WithStyles(BackupLinodes)')).toHaveLength(0);
    component.setProps({ linodes: [linode1, linode2], loading: false });
    expect(component.find('WithStyles(BackupLinodes)')).toHaveLength(1);
  });
});
