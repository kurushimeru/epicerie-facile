import { BaseFlippAdapter } from './BaseFlippAdapter'

export class WalmartAdapter extends BaseFlippAdapter {
  readonly chain = 'WALMART' as const
  readonly merchantNames = ['Walmart']
}
