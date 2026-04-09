import { BaseFlippAdapter } from './BaseFlippAdapter'

export class IgaAdapter extends BaseFlippAdapter {
  readonly chain = 'IGA' as const
  readonly merchantNames = ['IGA', 'IGA Extra']
}
