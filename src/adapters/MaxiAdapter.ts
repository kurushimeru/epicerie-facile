import { BaseFlippAdapter } from './BaseFlippAdapter'

export class MaxiAdapter extends BaseFlippAdapter {
  readonly chain = 'MAXI' as const
  readonly merchantNames = ['Maxi']
}
